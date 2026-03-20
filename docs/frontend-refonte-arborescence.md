# Arborescence détaillée recommandée — frontend refonte `new-api`

Date: 2026-03-20
Branche: `frontend-refonte`

## Objectif
Définir une structure claire pour le nouveau frontend MVP sans casser immédiatement le frontend legacy.

## Recommandation principale
Créer le nouveau frontend dans un dossier dédié, par exemple:
- `web-v2/`

Pourquoi:
- évite de casser `web/` trop tôt
- permet une migration progressive
- facilite les comparaisons
- simplifie le rollback
- permet de garder le frontend legacy opérationnel le temps de la transition

## Structure proposée
```text
web-v2/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.node.json
  postcss.config.js
  tailwind.config.ts
  components.json
  src/
    main.tsx
    app/
      router.tsx
      providers.tsx
      layout/
        app-shell.tsx
        app-sidebar.tsx
        app-topbar.tsx
        mobile-nav.tsx
    pages/
      public/
        home-page.tsx
        login-page.tsx
      app/
        dashboard-page.tsx
        tokens-page.tsx
        logs-page.tsx
        playground-page.tsx
      fallback/
        legacy-redirect-page.tsx
        not-found-page.tsx
    components/
      ui/
      layout/
      common/
      dashboard/
      tokens/
      logs/
      playground/
      auth/
    features/
      auth/
        api.ts
        hooks.ts
        types.ts
        store.ts
      dashboard/
        api.ts
        hooks.ts
        types.ts
      tokens/
        api.ts
        hooks.ts
        types.ts
      logs/
        api.ts
        hooks.ts
        types.ts
      playground/
        api.ts
        hooks.ts
        types.ts
    lib/
      api-client.ts
      query-client.ts
      cn.ts
      env.ts
      utils.ts
    i18n/
      index.ts
      locales/
        fr/
          common.json
          auth.json
          dashboard.json
          tokens.json
          logs.json
          playground.json
        en/
          common.json
          auth.json
          dashboard.json
          tokens.json
          logs.json
          playground.json
    hooks/
      use-mobile.ts
      use-page-title.ts
    types/
      api.ts
      ui.ts
    styles/
      globals.css
```

## Principes de structure
### `app/`
Contient l'infrastructure de l'application:
- router
- providers
- layout global

### `pages/`
Pages finales assemblées par route.
Les pages doivent rester fines et déléguer la logique métier aux `features/` et composants.

### `components/`
Composants UI réutilisables.
Sous-dossiers par domaine pour éviter le fourre-tout.

### `features/`
Chaque feature contient:
- accès API
- hooks métier
- types métier locaux
- état local éventuel

### `lib/`
Outils transverses:
- client API
- configuration env
- helpers partagés

### `i18n/`
Tous les textes visibles passent ici.
Aucune string métier/UI importante ne doit être hardcodée dans les pages finales.

## Routing recommandé
### Public
- `/` → home ou redirection
- `/login`

### App
- `/app`
- `/app/tokens`
- `/app/logs`
- `/app/playground`

### Temporaire / transition
- `/legacy/*` si on veut exposer des redirections claires
- `/console/*` continue à exister côté legacy tant qu'on ne remplace pas tout

## Layout recommandé
### App shell desktop
- sidebar gauche
- topbar légère
- zone contenu scrollable
- largeur max cohérente selon écran

### App shell mobile
- topbar compacte
- drawer ou navigation mobile dédiée
- actions secondaires repliées

## Composants clés par feature
### Auth
- `login-form`
- `password-input`
- `auth-card`

### Dashboard
- `stat-card`
- `quota-summary`
- `request-summary`
- `dashboard-empty-state`

### Tokens
- `token-table`
- `token-status-badge`
- `create-token-dialog`
- `token-actions-menu`

### Logs
- `logs-filter-bar`
- `usage-log-table`
- `log-detail-drawer`

### Playground
- `playground-form`
- `model-selector`
- `message-editor`
- `response-panel`

## Séparation legacy / refonte
Pendant la transition:
- `web/` = frontend legacy
- `web-v2/` = nouveau frontend MVP

Décision recommandée:
- ne pas essayer de fusionner trop tôt
- d'abord stabiliser le MVP
- ensuite décider si on remplace `web/` ou si on change le wiring build/serveur

## Critères d'une bonne implémentation
- pages fines
- data fetching centralisé par feature
- composants testables / réutilisables
- i18n propre
- responsive dès le départ
- pas de dépendance forte au legacy UI

## Prochaine étape liée à cette doc
Après validation de cette arborescence:
1. créer `web-v2/`
2. initialiser Vite + React + Tailwind
3. poser router + providers + shell
4. brancher login
