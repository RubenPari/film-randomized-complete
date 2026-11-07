# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Film Randomized — a random movie/TV show generator. Three independent packages (no npm workspaces):

- **`film-randomized/`** — React 19 + Vite + TailwindCSS frontend
- **`film-randomized-back/`** — NestJS 11 + TypeORM + PostgreSQL backend
- **`film_randomized_mobile/`** — Flutter stub (no real app code yet)

Root `docker-compose.yml` orchestrates all three services; `.env` is shared at root.

## Commands

### Frontend (`film-randomized/`)
```bash
npm run dev            # Dev server at :5173
npm run build          # Production build
npm run lint           # ESLint
npm run format         # Prettier write
npm run format:check   # Prettier check
npm run test           # Vitest (jsdom)
```

### Backend (`film-randomized-back/`)
```bash
npm run start:dev          # Watch mode
npm run build              # nest build
npm run start:prod          # Production
npm run test                # Jest unit tests
npm run test:e2e            # E2E tests
npm run lint                 # ESLint
npm run typeorm:run          # Run pending migrations
npm run typeorm:generate     # Generate migration from entity changes
npm run typeorm:revert       # Revert last migration
npm run seed                 # Idempotent seed (demo user + sample data)
```

### Docker Compose (root)
```bash
docker compose up --build   # Full stack (Postgres + app) at http://localhost:8000
```

## Code Style

- **Prettier**: 100 char width, single quotes, 2 spaces, semicolons required, trailing commas (es5 in frontend, all in backend)
- **Frontend**: Imports must include `.jsx`/`.js` extensions. Function expressions for components, declarations for utilities.
- **Backend**: TypeScript strict mode, `no-explicit-any` is off, `no-floating-promises` is warn.

## Architecture

### Frontend-Backend Data Flow

The browser talks to **two APIs**:
1. **TMDb API** — called directly from the browser via `tmdbClient.js`. API key is a Vite build-time env var (`VITE_TMDB_API_KEY`) baked into the JS bundle.
2. **NestJS backend** — called via `apiClient.js`. Always relative `/api`: in dev the Vite server proxies it to `http://localhost:8000`; in production NestJS serves both SPA and API.

### Frontend Key Patterns

- **Hook aggregation**: `useMediaGenerator` composes `useMediaFilters`, `useGenres`, and `useMediaFetcher`. Uses React 19 `useTransition` for non-blocking filter updates.
- **Service layer**: `apiClient.js` (backend calls), `tmdbClient.js` (TMDb calls), `tmdbApi.js` (TMDb endpoint functions).
- **Data normalization**: `normalizeMediaItem.js` converts snake_case API responses to camelCase.
- **i18n**: i18next with English and Italian locales in `src/locales/`.

### Backend Key Patterns

- **Abstract collection service**: `MediaCollectionService` in `common/services/` is a generic CRUD base. Both `WatchlistService` and `DiscoveredService` extend it.
- **Shared DTO + mapper**: `TmdbMediaPayloadDto` and `buildMediaItemFromTmdbPayload()` handle the common snake_case payload for both watchlist and discovered items.
- **Entity inheritance**: `BaseMediaItem` abstract entity → `WatchlistItem` and `DiscoveredItem` with user FK and unique constraint on `(userId, tmdbId, mediaType)`.
- **Global guards**: ThrottlerGuard (60 req/min global, 5 req/min on auth endpoints), JWT auth via Passport.
- **Exception filter**: `HttpExceptionFilter` returns consistent `{ statusCode, message, error }` JSON.

### Database

PostgreSQL 16 with TypeORM migrations (synchronize always off). Connection from `DATABASE_URL` only (`database/typeorm-env.ts`). Three tables: `users`, `watchlist_items`, `discovered_items`. `media_type_enum` is a Postgres ENUM.

## Environment Variables

Set in root `.env` (see `.env.example`). Required:
- `VITE_TMDB_API_KEY` — TMDb API key (build-time for frontend)
- `JWT_SECRET` — min 32 chars

Optional:
- `DATABASE_URL` — default `postgresql://postgres:postgres@localhost:5432/film_randomized`; SSL/socket options go in the URL
- `AI_GATEWAY_URL`, `AI_GATEWAY_KEY` — AI recommendation explanations (disabled if absent)

## Deployment

**GCP Cloud Run**, one service `film-randomized`: root `Dockerfile` builds the SPA and the API into one image; NestJS serves the SPA from `public/` (same origin, no CORS, no nginx). Postgres on **Cloud SQL** via Unix socket.
- Release = push a tag `v*` (`git tag v1.2.0 && git push origin v1.2.0`). `.github/workflows/release.yml` runs CI, builds + pushes the image to Artifact Registry, deploys it (image only), then creates the GitHub Release.
- `.github/workflows/ci.yml` runs tests/builds on PRs and pushes to `main` (no deploy).
- Runtime config (secrets `jwt-secret`, `database-url`) lives on the Cloud Run service / Secret Manager, set once by `scripts/gcp-bootstrap.sh`. GitHub needs secret `VITE_TMDB_API_KEY` and vars `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA` (keyless auth via Workload Identity Federation).
- Migrations run on container start (`film-randomized-back/docker-entrypoint.sh`); health check `GET /api/health`.