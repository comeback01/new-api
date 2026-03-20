# Plan de refonte frontend — `new-api`

Date: 2026-03-20
Branche cible: `frontend-refonte`
Projet: `new-api`
Serveur principal: `srv2508.hd1.ch`
Clone de travail: `/home/new-api`

## Décision validée
Le polish incrémental du frontend actuel est abandonné.

Décision retenue:
- conserver le backend `new-api`
- arrêter de corriger / polisher le frontend legacy existant comme stratégie principale
- repartir sur une **refonte partielle progressive** du frontend
- préserver le legacy comme fallback tant que tout n'est pas remplacé

## Pourquoi
Le frontend actuel a été jugé trop hétérogène pour justifier un investissement incrémental important:
- dette visuelle élevée
- i18n incohérente
- responsive mobile encore brut
- beaucoup d'effort pour un résultat moyen

## Contraintes non négociables
- ne jamais modifier directement `/home/one-api` sans demande explicite
- travailler uniquement sur le clone `/home/new-api`
- éviter tout conflit avec la production
- backend non prioritaire pour l'instant
- objectif principal: refaire l'expérience frontend utile, pas toute l'admin legacy d'un coup

## État actuel de l'instance de dev
Preview dev observée sur:
- `http://51.75.253.51:3001`

Constat d'audit:
- login OK
- navigation globale OK
- pas de crash bloquant détecté
- UX/UI insuffisante pour une simple phase de polish
- mélange de langues visible
- responsive mobile encore faible
- pages admin visuellement trop brutes

## Nettoyage Git déjà effectué
Sur le clone `/home/new-api`:
- suppression de l'ancienne branche `frontend-rework`
- resynchronisation de `main` avec `upstream/main`
- création de la branche propre `frontend-refonte`
- push de `frontend-refonte` sur `origin`

## Objectif produit de la refonte
Construire une UI plus propre, cohérente et maintenable, en remplaçant d'abord les écrans réellement utiles.

La nouvelle UI doit:
- être responsive desktop + mobile dès la base
- être internationalisable proprement
- réutiliser autant que possible les endpoints backend existants
- permettre une migration progressive écran par écran
- cohabiter temporairement avec le frontend legacy

## Périmètre MVP recommandé
### À reconstruire en priorité
1. login
2. dashboard
3. token management
4. usage logs
5. playground (si utile produit immédiat)

### À laisser en legacy temporairement
- channel management
- subscription management
- model management avancé
- model deployment
- redemption code management
- user management avancé
- autres écrans admin secondaires

## Principe de routing recommandé
### Nouvelles routes MVP
- `/login`
- `/` → landing minimale ou redirection si connecté
- `/app`
- `/app/tokens`
- `/app/logs`
- `/app/playground`

### Fallback legacy
- `/console/*` reste disponible tant que non remplacé

## Architecture frontend recommandée
### Stack
- React
- Vite
- Tailwind CSS
- shadcn/ui (ou équivalent propre)
- React Router
- TanStack Query
- i18next
- Zustand uniquement si un petit état global devient nécessaire

### Principes
- mobile-first
- composants réutilisables
- séparation claire app shell / pages / data fetching
- aucune string UI critique hardcodée sans passer par i18n
- design simple, sobre, admin moderne

## Layout cible
### Desktop
- sidebar fixe
- topbar légère
- contenu centré avec largeur maîtrisée

### Mobile
- navigation adaptée (drawer ou bottom nav)
- filtres repliables
- cartes et tables pensées pour lecture compacte

## Composants de base à prévoir
- `AppShell`
- `Sidebar`
- `Topbar`
- `MobileNav`
- `PageHeader`
- `StatCard`
- `DataTable`
- `EmptyState`
- `StatusBadge`
- `SearchFilterBar`
- `AuthForm`
- `TokenTable`
- `UsageLogTable`
- `PlaygroundForm`

## Données / backend
Objectif: ne pas toucher au backend tant que ce n'est pas indispensable.

Travail technique à faire avant implémentation lourde:
- inventorier les endpoints déjà utilisés par le frontend actuel pour:
  - auth
  - dashboard
  - tokens
  - logs
  - playground
- identifier les écarts éventuels entre besoins UI et API disponible
- documenter les contournements temporaires si besoin

## i18n
Exigences:
- structure i18n mise en place dès le départ
- éviter tout mélange de langues dans la nouvelle UI
- FR/EN minimum si nécessaire selon l'usage visé
- pas de chaînes visibles hardcodées dans les écrans MVP

## Plan d'exécution recommandé
### Phase 1 — cadrage
- documenter l'architecture cible
- inventorier les endpoints backend utiles
- décider où vit le nouveau frontend dans le repo

### Phase 2 — squelette
- routing
- app shell
- auth
- base i18n
- base design system

### Phase 3 — MVP utile
- dashboard
- tokens
- logs
- playground

### Phase 4 — stabilisation
- responsive
- i18n
- fallback legacy
- polish final

## Critères de réussite MVP
Le MVP est considéré comme réussi si:
- login propre et fiable
- dashboard lisible
- token management exploitable
- usage logs lisibles
- mobile acceptable sans bricolage
- UI cohérente
- fallback legacy disponible pour le non couvert

## Questions à trancher avant le scaffold
1. Le nouveau frontend doit-il vivre dans `web/` ou dans un nouveau dossier dédié (ex: `web-v2/`) ?
2. Veut-on une landing publique minimale ou une redirection directe ?
3. Le playground fait-il partie du MVP initial ou de la V1.1 ?
4. Souhaite-t-on FR seul au départ, ou FR + EN immédiatement ?

## Prochaine étape recommandée
La prochaine session doit produire l'un de ces livrables:
1. inventaire des endpoints backend utilisés par les écrans MVP
2. arborescence détaillée du nouveau frontend
3. scaffold initial sur la branche `frontend-refonte`
