# Clôture étape 1 — cadrage refonte frontend `new-api`

Date: 2026-03-20
Branche: `frontend-refonte`

## Statut
Étape 1 terminée.

L'étape 1 correspondait au cadrage complet avant démarrage du scaffold.

## Ce qui a été validé
- arrêt du polish incrémental du frontend legacy
- décision de repartir sur une refonte partielle progressive
- nettoyage Git du clone
- resynchronisation de `main` avec `upstream/main`
- création de la branche propre `frontend-refonte`
- push de la branche sur `origin`

## Ce qui a été documenté dans le repo
- `docs/frontend-refonte-plan.md`
- `docs/frontend-refonte-arborescence.md`
- `docs/frontend-refonte-endpoints-initial.md`
- `docs/frontend-refonte-mvp-endpoints-table.md`

## Décisions retenues
### Produit
MVP prioritaire:
- login
- dashboard simplifié
- token management
- usage logs
- playground ensuite ou dans un second lot selon charge

### Technique
Recommandation structure:
- créer un nouveau frontend dans `web-v2/`
- garder `web/` comme legacy temporaire
- ne pas fusionner trop tôt

### Backend
Le backend actuel couvre déjà l'essentiel du MVP sans chantier majeur.

Zones validées comme réutilisables:
- auth
- tokens
- logs
- playground
- dashboard simplifié

## Point d'attention principal
Le dashboard legacy mélange:
- endpoints backend réels
- données globales injectées via `statusState.status`

Conclusion retenue:
- ne pas recopier toute la complexité du dashboard legacy
- ne reprendre dans le MVP que les éléments utiles

## Fin de l'étape 1 = définition de l'étape 2
L'étape 2 peut commencer.

### Étape 2 attendue
Créer la base du nouveau frontend:
- `web-v2/`
- stack React + Vite + Tailwind
- routing
- app shell
- i18n de base
- auth de base

## Règle pour la suite
À partir de maintenant, éviter de rouvrir le cadrage sauf contrainte forte.
La prochaine session doit exécuter, pas rediscuter les fondations.
