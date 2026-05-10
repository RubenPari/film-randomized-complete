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
docker compose up --build   # Full stack (Postgres + backend + frontend)
```

## Code Style

- **Prettier**: 100 char width, single quotes, 2 spaces, semicolons required, trailing commas (es5 in frontend, all in backend)
- **Frontend**: Imports must include `.jsx`/`.js` extensions. Function expressions for components, declarations for utilities.
- **Backend**: TypeScript strict mode, `no-explicit-any` is off, `no-floating-promises` is warn.

## Architecture

### Frontend-Backend Data Flow

The browser talks to **two APIs**:
1. **TMDb API** — called directly from the browser via `tmdbClient.js`. API key is a Vite build-time env var (`VITE_TMDB_API_KEY`) baked into the JS bundle.
2. **NestJS backend** — called via `apiClient.js`. In dev: `http://localhost:8000/api`. In production: relative `/api` (nginx proxies to backend).

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

PostgreSQL 16 with TypeORM migrations (synchronize is off in production). Supports `DATABASE_URL` (Fly Postgres) or discrete `DB_*` vars. Three tables: `users`, `watchlist_items`, `discovered_items`. `media_type_enum` is a Postgres ENUM.

## Environment Variables

Set in root `.env` (see `.env.example`):
- `VITE_TMDB_API_KEY` — TMDb API key (build-time for frontend)
- `JWT_SECRET` — min 32 chars
- `DB_*` or `DATABASE_URL` — PostgreSQL connection
- `MAILTRAP_TOKEN`, `MAILTRAP_SENDER_EMAIL` — password reset emails (optional; email service disabled if absent)
- `FRONTEND_URL` — used for password reset links
- `PORT` — backend port (default 8000)

## Deployment

Both apps deploy to **Fly.io** (FRA region) with their own `fly.toml`:
- Frontend: nginx serves the SPA and proxies `/api` to `film-randomized-api.internal:8000`
- Backend: runs migrations on startup via `docker-entrypoint.sh`, health check on `GET /api/health`