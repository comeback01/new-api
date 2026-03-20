# Tableau MVP — endpoints réutilisables pour la refonte frontend

Date: 2026-03-20
Branche: `frontend-refonte`
Projet: `new-api`

## Objectif
Avoir un mapping simple et exploitable des écrans MVP vers les endpoints backend existants.

## Résumé rapide
Le backend actuel permet déjà de reconstruire sans modification majeure:
- login
- token management
- usage logs
- playground

Le dashboard est faisable aussi, mais avec une particularité:
- une partie des données vient d'endpoints dédiés
- une autre partie vient de `statusState.status` (config / contenu injecté globalement)

---

## 1. Login / Auth

| Écran | Endpoint | Méthode | Usage | Remarques |
|---|---|---:|---|---|
| login | `/api/user/login` | POST | connexion utilisateur | endpoint principal |
| 2FA | `/api/user/login/2fa` | POST | validation second facteur | à garder si activé |
| register | `/api/user/register` | POST | inscription | hors MVP si on veut limiter |
| reset request | `/api/reset_password` | GET | demande reset password | optionnel MVP |
| reset confirm | `/api/user/reset` | POST | confirmation reset password | optionnel MVP |
| email verification | `/api/verification` | GET | vérification email | surtout pour register |
| passkey begin | `/api/user/passkey/login/begin` | POST | login passkey début | optionnel MVP |
| passkey finish | `/api/user/passkey/login/finish` | POST | login passkey fin | optionnel MVP |
| current user | `/api/user/self` | GET | récupérer utilisateur courant | utile après login |

### Décision recommandée
Pour le MVP, prioriser:
- login standard
- récupération user courant
- logout côté frontend

Garder en V1.1 ou optionnel:
- register
- passkey
- reset password
- 2FA si non indispensable au premier jet

---

## 2. Dashboard

| Écran | Endpoint / source | Méthode | Usage | Remarques |
|---|---|---:|---|---|
| dashboard stats data | `/api/data/` | GET | stats admin filtrées par période | si admin |
| dashboard stats data self | `/api/data/self/` | GET | stats user filtrées par période | base principale du dashboard user |
| current user | `/api/user/self` | GET | quota, used_quota, request_count | utilisé pour cartes hautes |
| uptime | `/api/uptime/status` | GET | monitoring uptime | si activé |
| api info | `statusState.status.api_info` | n/a | infos API affichées | pas un endpoint direct identifié ici |
| announcements | `statusState.status.announcements` | n/a | annonces dashboard | vient du status global |
| faq | `statusState.status.faq` | n/a | FAQ dashboard | vient du status global |
| panel flags | `statusState.status.*_enabled` | n/a | activer/cacher panneaux | config globale |

### Lecture technique
Le dashboard actuel se construit à partir de:
1. `GET /api/user/self`
2. `GET /api/data/...` ou `GET /api/data/self/...`
3. `GET /api/uptime/status`
4. données globales déjà chargées dans `statusState.status`

### Décision recommandée
Pour le nouveau MVP dashboard:
- garder seulement les vraies cartes utiles
- considérer `api_info`, `announcements`, `faq` comme **secondaires**
- ne pas bloquer la refonte sur ces panneaux secondaires

MVP dashboard conseillé:
- quota courant
- consommation
- nombre de requêtes
- stats sur période
- uptime seulement si simple à réintégrer

---

## 3. Token management

| Écran | Endpoint | Méthode | Usage | Remarques |
|---|---|---:|---|---|
| list tokens | `/api/token/?p={page}&size={size}` | GET | liste paginée | base principale |
| search tokens | `/api/token/search?...` | GET | recherche / filtrage | utile si MVP garde search |
| reveal/copy key | `/api/token/{id}/key` | POST | récupérer / révéler clé | utile |
| update token status | `/api/token/?status_only=true` | PUT | enable / disable | utilisé dans legacy |
| delete token | `/api/token/{id}/` | DELETE | suppression | utile |
| batch action | `/api/token/batch` | POST | batch ops | probablement hors MVP initial |

### Décision recommandée
Pour le MVP tokens:
- liste
- création si endpoint existant à confirmer dans code complémentaire
- enable/disable
- suppression
- affichage/copie clé

Le batch peut attendre.

---

## 4. Usage logs

| Écran | Endpoint | Méthode | Usage | Remarques |
|---|---|---:|---|---|
| logs admin | `/api/log/?...` | GET | liste logs admin | paginé / filtré |
| logs self | `/api/log/self/?...` | GET | liste logs user | MVP probable |
| logs stat admin | `/api/log/stat?...` | GET | stats agrégées logs admin | utile si dashboard/logs enrichis |
| logs stat self | `/api/log/self/stat?...` | GET | stats agrégées logs user | utile |
| user detail | `/api/user/{id}` | GET | enrichissement détails user | probablement non prioritaire MVP |

### Décision recommandée
Pour le MVP logs:
- liste self ou admin selon rôle
- filtres principaux
- pagination
- détail simple si nécessaire

---

## 5. Playground

| Écran | Endpoint | Méthode | Usage | Remarques |
|---|---|---:|---|---|
| models list | `/api/user/models` | GET | récupérer modèles accessibles | nécessaire |
| groups list | `/api/user/self/groups` | GET | récupérer groupes utilisateur | nécessaire |
| chat request | endpoint chat completions configuré côté constants | POST/fetch | envoi requête playground | à figer précisément au scaffold |

### Lecture technique
Le playground actuel:
- charge modèles
- charge groupes
- envoie les requêtes via un endpoint de chat défini dans les constantes / helpers

### Décision recommandée
Le playground peut être dans le MVP, mais en version simple:
- sélection modèle
- sélection groupe
- saisie message
- réponse streamée ou non

Pas besoin de viser toutes les options avancées au départ.

---

## Décisions de périmètre recommandées
### MVP v1
Inclure:
- login
- dashboard simplifié
- tokens
- logs

### MVP v1.1
Ajouter ensuite:
- playground
- uptime si non inclus dès v1
- panneaux secondaires dashboard
- auth avancée (passkey / register / reset)

---

## Conclusion
La refonte peut démarrer sans gros chantier backend.
Le backend actuel couvre déjà l'essentiel du MVP.
Le seul point à simplifier côté produit est le dashboard, pour éviter de reproduire toute la complexité legacy.

## Prochaine étape recommandée
À partir de ce tableau:
1. valider le périmètre MVP exact
2. créer `web-v2/`
3. poser le shell + auth + dashboard simplifié
