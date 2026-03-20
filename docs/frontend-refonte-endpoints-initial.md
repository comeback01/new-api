# Inventaire initial — endpoints / besoins MVP frontend refonte

Date: 2026-03-20
Branche: `frontend-refonte`

## Objectif
Lister ce qu'il faut vérifier côté backend/API pour reconstruire le MVP frontend sans modifier le backend inutilement.

## Méthode recommandée
Avant de coder lourdement:
1. repérer dans le frontend actuel les services / appels API utilisés
2. associer chaque écran MVP aux endpoints nécessaires
3. noter les zones floues ou couplages legacy
4. n'adapter le backend que si vraiment indispensable

## Écrans MVP et besoins

### 1. Login
Besoins probables:
- authentification utilisateur
- récupération session / token / statut connecté
- logout

À identifier:
- endpoint login exact
- format de réponse
- mode de persistance auth (cookie, token, local storage, autre)
- endpoint de récupération utilisateur courant

Questions:
- la session actuelle du frontend legacy est-elle facilement réutilisable ?
- faut-il garder la même mécanique d'auth pour compatibilité immédiate ?

---

### 2. Dashboard
Besoins probables:
- balance actuelle
- consommation
- nombre de requêtes
- statistiques globales
- éventuellement données de graphiques
- notices / status / faq si on les garde

À identifier:
- endpoints dashboard réellement appelés aujourd'hui
- structure des données de stats
- dépendances à des composants legacy de charting

Question produit:
- faut-il garder tout le dashboard actuel ou seulement les indicateurs utiles ?

---

### 3. Token management
Besoins probables:
- lister les tokens
- créer un token
- mettre à jour un token
- supprimer un token
- copier / afficher une clé
- filtrer par statut / groupe si utile

À identifier:
- endpoint liste tokens
- endpoint création
- endpoint update
- endpoint suppression
- structure des objets token
- format des erreurs

---

### 4. Usage logs
Besoins probables:
- liste paginée / filtrée des logs
- filtres date / modèle / type / canal / user si utile
- détail d'une entrée

À identifier:
- endpoint principal de logs
- pagination
- paramètres de filtrage disponibles
- format des montants / tokens / dates

---

### 5. Playground
Besoins probables:
- récupérer liste groupes / modèles
- envoyer une requête de test
- afficher la réponse
- éventuellement gérer multimodal si prévu

À identifier:
- endpoint d'appel playground ou équivalent
- différence entre playground UI et endpoint API réel
- dépendances éventuelles au legacy

Question:
- ce playground doit-il être dans le MVP immédiat ou en second temps ?

## Travail technique recommandé sur le repo
Dans le frontend actuel, inspecter en priorité:
- `web/src/services/`
- `web/src/pages/`
- `web/src/hooks/`
- `web/src/helpers/`
- recherches par mots-clés: `fetch`, `axios`, `API`, `token`, `log`, `user`, `dashboard`, `playground`

## Livrable attendu pour la prochaine phase
Un tableau simple du style:

| Écran | Endpoint | Méthode | Usage | Remarques |
|---|---|---|---|---|
| login | /... | POST | auth | ... |
| dashboard | /... | GET | stats | ... |
| tokens | /... | GET | liste | ... |

## Règle de décision
Si un endpoint backend existant suffit même s'il est un peu moche:
- on le garde d'abord
- on priorise la refonte UI

Si un endpoint est vraiment inutilisable:
- on documente le manque
- on décide explicitement d'une adaptation backend

## Prochaine étape liée à cette doc
Après cette phase d'inventaire:
1. valider les endpoints MVP
2. définir `api-client.ts`
3. lancer le scaffold du frontend `web-v2/`
