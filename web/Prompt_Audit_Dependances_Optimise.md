# Prompt d'audit et mise à jour des dépendances

## Configuration MCP requise

- **File System MCP** : Lecture et analyse des fichiers projet (obligatoire)
- **Context7 MCP** : Documentation frameworks - React, Next.js, Vue, Tailwind (obligatoire)
- **Brave Search MCP** : Changelogs pour @types/\*, eslint, prettier, vite (recommandé)

## 🎯 Objectif

Nettoyer, moderniser et fiabiliser les dépendances **sans casser l'application** via un processus automatisé et documenté.

---

## RÈGLES GLOBALES D'EXÉCUTION

### Principes fondamentaux

- **Processus continu** : Aller jusqu'à la fin, jamais d'arrêt prématuré
- **Pas de placeholders** : Toujours exécuter et documenter les résultats réels
- **Tests systématiques** : lint + test + build + dev après chaque modification
- **Documentation immédiate** : Journal mis à jour en temps réel
- **En cas d'échec** : Marquer ❌, documenter l'erreur, continuer avec le suivant

### Format des résultats obligatoire

Toujours utiliser ce format exact pour les résultats de tests :

- `Lint : ✅ Aucune erreur` ou `Lint : ❌ Échec - [détail]`
- `Tests : ✅ X/X passés` ou `Tests : ❌ Y échecs - [liste]`
- `Build : ✅ Succès` ou `Build : ❌ Échec - [détail]`
- `Dev : ✅ Démarre sans erreur` ou `Dev : ❌ [erreurs console]`
- `Statut : ✅ Réussi` ou `Statut : ❌ Échec`

### Phrases interdites

Ne jamais écrire :

- "Le processus peut se poursuivre..."
- "À compléter après test"
- "[À remplir...]"
- "En attente de validation" (sauf pauses explicites)

---

## Phase 1 : Initialisation

Créer immédiatement `DEPENDENCY_UPDATE_LOG.md` avec la structure suivante :

```markdown
# Journal des mises à jour de dépendances

**Date :** [DATE_ACTUELLE]
**Projet :** [NOM_DU_PROJET]

## Résumé des actions

- [ ] Audit de sécurité
- [ ] Packages non utilisés
- [ ] PATCH (🟢)
- [ ] MINOR (🔵)
- [ ] MAJOR (🔴)
- [ ] Migration Tailwind (si applicable)

## Détail des modifications

[Sera complété au fur et à mesure]

## Résumé final

[À compléter en fin de processus]
```

---

## Phase 2 : Audit de Sécurité (PRIORITAIRE)

### 2.1 Exécution

```bash
npm audit
npm audit fix
```

### 2.2 Documentation dans le journal

```markdown
## Audit de Sécurité

### Vulnérabilités détectées

- Critiques : X | Élevées : Y | Moyennes : Z | Faibles : W

### Corrections automatiques

Commande : `npm audit fix`
Packages corrigés :

- [package@version] : [type vulnérabilité]

### Corrections manuelles requises

| Package | Version actuelle → Recommandée | Vulnérabilité     | Priorité    |
| ------- | ------------------------------ | ----------------- | ----------- |
| [nom]   | [v1 → v2]                      | [CVE/description] | 🔴 Critique |

**Statut :** ✅ Aucune vulnérabilité / ⚠️ Vulnérabilités restantes
```

---

## Phase 3 : Packages non utilisés

### 3.1 Analyse

Exécuter : `npx depcheck`

### 3.2 Vérification méthodique (File System MCP)

Pour chaque package signalé :

1. **Identifier le rôle** du package
2. **Vérifier ces emplacements** :
   - Fichiers source : `.ts`, `.tsx`, `.js`, `.jsx`
   - Configs : `tailwind.config.*`, `vite.config.*`, `postcss.config.*`, `tsconfig.json`
   - Scripts : `package.json` → "scripts"
   - Imports dynamiques : `import()`, `require()`
   - Tests : `*.test.*`, `*.spec.*`
3. **Documenter** la recherche et la conclusion

### 3.3 Documentation

```markdown
## Packages Non Utilisés

### Analyse détaillée

#### [nom-package]

- **Statut** : Non utilisé / Utilisé confirmé
- **Emplacements vérifiés** : [liste fichiers/patterns]
- **Conclusion** : À valider utilisateur / Conserver
- **Raison** : [explication]

### Liste validation utilisateur

| Package | Raison détection | Recommandation        |
| ------- | ---------------- | --------------------- |
| [nom]   | [raison]         | ⚠️ Validation requise |
```

**⚠️ IMPORTANT** : Ne **jamais supprimer automatiquement** - toujours lister pour validation utilisateur.

---

## Phase 4 : Mises à jour par lots

### 4.1 Diagnostic initial

```bash
ncu                    # Afficher toutes les MAJ disponibles
ncu --target patch     # Afficher PATCH uniquement
ncu --target minor     # Afficher MINOR uniquement
```

---

### 🟢 4.2 LOT PATCH (Sécuritaires)

#### Stratégie

- **Traitement** : Lot complet en une fois
- **Recherche** : AUCUNE (rétrocompatibles par définition SemVer)
- **Tests** : Complets après installation

#### Exécution

```bash
ncu --target patch -u && npm install
npm run lint
npm test
npm run build
npm run dev
```

#### Documentation

```markdown
### Lot PATCH (🟢)

- **Packages** : [liste complète avec versions]
- **Commande** : `ncu --target patch -u && npm install`
- **Tests** :
  - Lint : [résultat]
  - Tests : [résultat]
  - Build : [résultat]
  - Dev : [résultat]
- **Statut** : ✅ Réussi / ❌ Échec
```

---

### 🔵 4.3 LOT MINOR (Rétrocompatibles)

#### Stratégie

- **Traitement** : Lot complet en une fois
- **Recherche** : AUCUNE (rétrocompatibles par définition SemVer)
- **Tests** : Complets après installation

#### Exécution

```bash
ncu --target minor -u && npm install
npm run lint
npm test
npm run build
npm run dev
```

#### Documentation

```markdown
### Lot MINOR (🔵)

- **Packages** : [liste complète avec versions]
- **Commande** : `ncu --target minor -u && npm install`
- **Tests** :
  - Lint : [résultat]
  - Tests : [résultat]
  - Build : [résultat]
  - Dev : [résultat]
- **Statut** : ✅ Réussi / ❌ Échec
```

---

### 🔴 4.4 MISES À JOUR MAJOR (Breaking changes)

#### 4.4.1 Groupes de dépendances liées

Détecter automatiquement par patterns et traiter ensemble :

| Groupe      | Pattern                                             | Documentation    | Codemods                                         |
| ----------- | --------------------------------------------------- | ---------------- | ------------------------------------------------ |
| React       | `react`, `react-dom`, `@types/react*`               | Context7         | `npx types-react-codemod@latest preset-19 ./src` |
| TypeScript  | `typescript`, `@types/*` (TS alignée)               | Context7 + Brave | `npx @typescript-eslint/codemod@latest`          |
| ESLint      | `eslint`, `@typescript-eslint/*`, `eslint-plugin-*` | Brave            | `npx @eslint/migrate-config@latest`              |
| Tailwind    | `tailwindcss`, `@tailwindcss/*`, plugins            | Context7         | Voir Phase 5                                     |
| Next.js     | `next`, types NextJS                                | Context7         | -                                                |
| Vite        | `vite`, `@vitejs/*`, plugins vite                   | Context7         | -                                                |
| Radix UI    | `@radix-ui/react-*`                                 | Brave            | -                                                |
| Tanstack    | `@tanstack/*`                                       | Brave            | -                                                |
| Types       | `@types/*` (hors React/TS)                          | Brave            | -                                                |
| Build tools | prettier, webpack, babel                            | Brave            | -                                                |

#### 4.4.2 Processus pour chaque groupe/package MAJOR

**Pour chaque groupe détecté :**

1. **Analyser** avec documentation appropriée (Context7 ou Brave Search)
2. **Installer** : `npm install package1@latest package2@latest ...`
3. **Appliquer codemods** si disponibles (voir tableau)
4. **Modifications manuelles** selon breaking changes
5. **Tests complets** (lint + test + build + dev)
6. **Documenter** résultats
7. **Continuer** avec groupe suivant

#### 4.4.3 Documentation MAJOR

```markdown
### Groupe [Nom] (🔴)

- **Packages** : [package1@old→new, package2@old→new, ...]
- **Documentation** : Context7 "[query]" ou Brave Search "[query]"
- **Breaking changes détectés** :
  - [Change 1 avec impact]
  - [Change 2 avec impact]
- **Commande** : `npm install [packages@versions]`
- **Codemods** : [commande si disponible] ou "Aucun"
- **Fichiers modifiés** : [liste] ou "Aucun"
- **Tests** :
  - Lint : [résultat]
  - Tests : [résultat]
  - Build : [résultat]
  - Dev : [résultat]
- **Statut** : ✅ Réussi / ❌ Échec
```

#### 4.4.4 Exemples recherches MCP

**Context7 (frameworks majeurs)** :

```
"tailwindcss v4 migration guide"
"react 19 migration guide"
"next.js 15 breaking changes"
"vue 3.5 migration guide"
"vite 5 migration guide"
```

**Brave Search (types et outils)** :

```
"@types/node 18 to 22 breaking changes"
"eslint 8 to 9 migration guide"
"prettier 2 to 3 changelog"
"@tanstack/react-query v4 to v5 migration"
```

---

## Phase 5 : Migration Tailwind 3.x → 4.x (si applicable)

### 5.1 Détection

```bash
current_version=$(npm list tailwindcss --depth=0 | grep tailwindcss)
target_version=$(npm view tailwindcss version)
```

**SI** migration 3.x → 4.x détectée **ALORS** exécuter cette phase, **SINON** passer à Phase 6.

---

### 5.2 Analyse pré-migration

```markdown
## Migration Tailwind CSS 3.x → 4.x

### État avant migration

- **Version actuelle** : tailwindcss@[VERSION]
- **Configuration** : [tailwind.config.js/ts]
- **Plugins custom** : [liste ou "Aucun"]
- **Fichiers Tailwind** : X fichiers
- **@apply/@layer** : Détecté dans Y fichiers
```

---

### 5.3 Migration automatique

```bash
# Outil officiel
npx @tailwindcss/upgrade@latest

# Installation v4
npm install tailwindcss@4

# Tests
npm run lint
npm run build
npm test
npm run dev
```

---

### 5.4 Corrections plugins custom

Pour chaque plugin custom détecté, documenter :

````markdown
#### Plugin : [nom]

**Code v3** :

```javascript
// tailwind.config.js
plugins: [
  function ({ addVariant }) {
    addVariant('hover-active', '&:hover, &:active');
  },
];
```
````

**Code v4** :

```css
/* tailwind.css */
@variant hover-active (&:hover, &:active);
```

**Action** : ✅ Appliqué automatiquement

````

---

### 5.5 Migration classes obsolètes

```markdown
#### Classes obsolètes

| Fichier | Ligne | v3 | v4 | Statut |
|---------|-------|----|----|--------|
| Button.tsx | 23 | `ring-opacity-50` | `ring/50` | ✅ Migré |
| Card.tsx | 45 | `bg-opacity-75` | `bg/75` | ✅ Migré |

**Total** : X occurrences migrées
````

---

### 5.6 Tests automatiques

```markdown
### Tests automatiques

- **Lint** : [résultat]
- **Build** : [résultat]
- **Tests** : [résultat]
- **Dev** : [résultat]
```

---

### 5.7 ⏸️ PAUSE UTILISATEUR - Validation visuelle

```markdown
### 🛑 VALIDATION VISUELLE NÉCESSAIRE

#### Checklist à vérifier :

- [ ] Boutons (hover, focus, disabled)
- [ ] Formulaires (inputs, validation, erreurs)
- [ ] Navigation (menu, liens, breadcrumb)
- [ ] Layouts (grid, flex, responsive)
- [ ] Typographie
- [ ] Couleurs
- [ ] Espacements
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark mode (si applicable)

#### Pages prioritaires :

- [ ] Accueil
- [ ] Formulaire principal
- [ ] Dashboard/Admin
- [ ] [Pages détectées automatiquement]

**Commande test** : `npm run dev`

**Si problème** : Documenter ci-dessous pour correction manuelle
```

---

### 5.8 Documentation finale migration

```markdown
### ✅ Migration Tailwind v4 - RÉSUMÉ

- **Version** : 3.x.x → 4.x.x
- **Fichiers migrés** : X fichiers
- **Classes mises à jour** : Y occurrences
- **Plugins migrés** : Z plugins
- **Tests automatiques** : ✅ Réussis / ⚠️ Voir détails
- **Validation visuelle** : [À compléter par utilisateur]

#### Changements appliqués

1. Config : `tailwind.config.js` → `tailwind.css`
2. Plugins → directives @variant/@utility
3. Classes opacity : `bg-opacity-X` → `bg/X`
4. [Autres changements]

#### Rollback si nécessaire

`npm install tailwindcss@3` + restaurer fichiers depuis backup
```

---

## Phase 6 : Finalisation

### 6.1 Compléter le journal final

````markdown
## Résumé final - TERMINÉ ✅

### Statistiques

- **Durée estimée** : [temps]
- **Packages analysés** : X
- **Vulnérabilités corrigées** : Y

### Mises à jour réussies

- **PATCH** : X packages ✅
- **MINOR** : Y packages ✅
- **MAJOR** : Z packages ✅
- **Tailwind** : ✅ Réussie / ⚠️ Tests visuels requis / ❌ Non applicable

### Packages échoués (si applicable)

| Package | Version tentée | Erreur   | Solution suggérée |
| ------- | -------------- | -------- | ----------------- |
| [nom]   | [version]      | [erreur] | [solution]        |

### Packages non utilisés (validation requise)

| Package | Raison   | Recommandation               |
| ------- | -------- | ---------------------------- |
| [nom]   | [raison] | ⚠️ Valider avant suppression |

### État final

- **Build** : ✅ Fonctionne / ❌ Erreurs critiques
- **Dev** : ✅ Démarre / ⚠️ Warnings [liste]
- **Tests** : ✅ X/X passés / ❌ Y échecs
- **Lint** : ✅ Aucune erreur / ⚠️ Warnings [X]

---

## Actions IMMÉDIATEMENT requises

### 🔴 CRITIQUES

- [ ] Valider et supprimer packages non utilisés
- [ ] Tests visuels complets (si Tailwind)
- [ ] Résoudre packages échoués

### 🟠 ÉLEVÉES

- [ ] Tests profondeur toutes fonctionnalités
- [ ] Tests e2e (si disponibles)
- [ ] Déployer en staging

### 🟡 MOYENNES

- [ ] Documenter changements majeurs
- [ ] Informer équipe breaking changes
- [ ] Formation si nécessaire (React 19, etc.)

---

## Rollback d'urgence

**Si problème critique** :

```bash
# Restaurer depuis backup externe
# Puis réinstaller
npm install
```
````

---

## ✅ AUDIT TERMINÉ

**Date** : [DATE_HEURE]
**Tous les packages traités selon le processus défini**

```

---

### 6.2 Message final obligatoire

Afficher ce message exact :

> 🎯 **AUDIT TERMINÉ** - Tous les packages ont été traités. Consultez `DEPENDENCY_UPDATE_LOG.md` pour tous les détails. Passez aux actions utilisateur listées ci-dessus.

---

## SÉQUENCE D'EXÉCUTION COMPLÈTE

Ordre strict obligatoire :

1. ✅ **Phase 1** : Créer journal
2. 🔒 **Phase 2** : Audit sécurité + corrections
3. 🗑️ **Phase 3** : Analyser packages non utilisés
4. 🟢 **Phase 4.2** : Lot PATCH + tests
5. 🔵 **Phase 4.3** : Lot MINOR + tests
6. 🔴 **Phase 4.4** : Groupes/packages MAJOR + codemods + tests
7. 🎨 **Phase 5** : Migration Tailwind 3→4 (si applicable)
8. ✅ **Phase 6** : Finalisation + rapport complet
```
