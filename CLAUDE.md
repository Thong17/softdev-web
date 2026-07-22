# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

SoftDev Web is a React 17 + TypeScript single-page app (bootstrapped from Create React App) for a POS / retail-management system: sales, stock, reservations, loans, promotions, staff/role admin, and reporting, with receipt printing via QZ Tray. State is managed with Redux Toolkit for domain data and React Context for cross-cutting concerns (auth, theme, language, alerts, notifications, web/site config).

## Commands

```bash
npm start              # dev server (uses local .env), source maps disabled
npm run start:dev      # dev server using .env.development (via env-cmd)
npm run start:test     # dev server using .env.test (via env-cmd)
npm run build           # production build to ./build
npm test                # CRA/Jest test runner in watch mode
npm test -- --testPathPattern=<name> --watchAll=false   # run a single test file once
npm run serve            # serve the production build (`serve -s build`)
npm run dockerBuild       # build production docker image (thonggee/softdev-web:production)
npm run dockerPush        # push that image
```

There is no lint script beyond CRA's built-in eslint (`eslintConfig: "react-app"` in package.json) — lint errors surface in the console during `npm start`/build.

Environment variables are loaded from `.env` (or `.env.development`/`.env.test` via `env-cmd`) — see `.env.example` for the full list (API URL, hash secret, YouTube API, direct-printing URL, social links). The Dockerfile copies a build-arg-selected env file (`ENV_FILE`, default `.env.production`) over `.env` before building.

## Architecture

### Path aliases
`tsconfig.json` defines absolute import roots off `src/`: `asset/*`, `components/*`, `modules/*`, `utils/*`, `context/*`, `app/*`, `hooks/*`, `constants/*`, `styles/*`, `shared/*`. Always import with these instead of relative `../../..` paths.

### App shell
- `src/app/App.tsx` — mounts routes and wraps them in a `Compose` of all context providers (`Notify`, `Alert`, `Auth`, `Language`, `Themes`, `Config`, `Web`). Also polls `getAlertNotification` every minute via Redux.
- `src/app/router.tsx` — the single source of truth for all routes, built as a flat `RouteObject[]` tree. Feature areas (`/admin`, `/function`, `/organize`, `/sale`, `/report`) are parent routes wrapping nested children, each child typically guarded by `AuthGuard`.
- `src/app/store.ts` — Redux Toolkit store; one reducer slice per feature module (category, brand, product, store, stock, promotion, transaction, reservation, payment, loan, role, queue, user, shared).

### Auth & permissions
- `src/auth/AuthGuard.tsx` wraps route elements: `<AuthGuard role={{ route: 'user', action: 'create' }}>`. It checks `user.privilege[route][action]` from the auth context; on failure it fires a notify toast and renders `Restrict`.
- `src/contexts/auth/AuthContext.tsx` holds the authenticated user, exposes `login`/`register`/`logout`/`reload`, and persists the session token (`x-access-token` in localStorage) via `setSession`.
- Every API call is signed: `constants/functions/Axios.ts` builds an `x-access-hash` (SHA-256 of body + `REACT_APP_HASH_SECRET` + timestamp + token) and sends it with `x-access-ts`/`x-access-token` headers. Use this `Axios` wrapper (not raw `axios`) for any authenticated backend call — hand it `{ method, url, body, params, headers }`.

### Feature module pattern
Each domain lives under `src/modules/<area>/<feature>/` (e.g. `modules/organize/product/`) and typically contains:
- `index.tsx` — re-exports the feature's public components (list/create/update/detail pages) for the router/store to import.
- `Create.tsx`, `Update.tsx`, `Detail.tsx`, `Form.tsx`, plus feature-specific subcomponents (e.g. `ColorForm.tsx`, `OptionForm.tsx`).
- `redux/index.ts` + `redux/constant.ts` — a Redux Toolkit slice: `createAsyncThunk`s calling the shared `Axios` wrapper, an `initialState` (per-request `{ data, status, count?, hasMore? }` shape from `shared/interface`'s `IBody<T>`), sync reducers, `extraReducers` handling `pending/rejected/fulfilled` for each thunk, and exported `selectX` selectors.
- `schema/` — Yup validation schemas for forms (see `shared/schema/index.ts` for cross-feature schemas like `transactionSchema`, `reservationSchema`).

When adding a new feature module, mirror this structure rather than inventing a new one, and wire its reducer into `src/app/store.ts` and its routes into `src/app/router.tsx`.

### Contexts vs Redux
Contexts (`src/contexts/*`) are for app-wide, mostly-static or session concerns (auth, theme, language, site/web config, alert banners, toast notifications) and are composed once in `App.tsx`. Redux (`src/app/store.ts` + per-module slices) is for domain/business data fetched from the API (products, stock, sales, reports, etc.). Don't mix the two — new server-backed list/detail data goes in a Redux slice; new cross-cutting UI/session state goes in a context + `hooks/useX` accessor (see `src/hooks/useAuth.ts`, `useNotify.ts`, `useAlert.ts`, etc.).

### Shared building blocks
- `src/shared/interface/index.ts` — generic `IBody<T>` request-state shape and shared string-literal types (`StructureStatusType`, etc.) used across slices.
- `src/shared/redux/` — a slice for cross-feature state (e.g. alert notifications polled from `App.tsx`).
- `src/shared/schema/index.ts` — Yup schemas shared by multiple modules (transactions, customers, drawer, reservations).
- `src/utils/index.tsx` — formatting/calculation helpers (currency/duration formatting per currency code `USD`/`KHR`/percent, date helpers, hash generation, structure pricing, debounce/throttle, Excel buffer download, etc.). Check here before writing a new formatter.
- `src/utils/printer.ts` — QZ Tray integration for direct receipt printing (certificate/signature handshake against `/config/get-certificate` and `/config/sign-qz-cert` on the API), used alongside `src/api/receipt.api.ts` (`directPrinting`, supports USB/NETWORK and 58mm/80mm/thermal printer types).
- `src/components/shared/` — the shared UI kit (Sidebar, Navbar, Bottombar, Dialog, Button, status/label chips like `LoanStatus`, `PromotionTag`, `RankStatus`, etc.) built on MUI v5 (`@mui/material`) — note `@material-ui/core` (v4) is also still a dependency for legacy pieces, so check which a given component already uses before adding new UI.

### Routing conventions
Routes needing permission checks are wrapped in `AuthGuard` with a `{ route, action }` pair matching keys in the logged-in user's `privilege` object. List pages are frequently paired with a `HintButton playlistId="..."` that surfaces a YouTube help playlist (via `src/api/youtube.ts`) — follow this pattern when adding new list pages that should have contextual help.
