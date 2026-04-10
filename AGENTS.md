# AGENTS.md - Film Randomized

## Project Structure

Two packages in this monorepo:
- `film-randomized/` - Frontend (React 19 + Vite + TailwindCSS)
- `film-randomized-back/` - Backend (NestJS)

## Developer Commands

### Frontend (`film-randomized/`)
```bash
npm run dev          # Dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run lint         # ESLint
npm run format       # Prettier write
npm run format:check # Check formatting
npm run test         # Vitest
```

### Backend (`film-randomized-back/`)
```bash
npm run start        # Production
npm run start:dev    # Watch mode
npm run test         # Unit tests
npm run test:e2e     # E2E tests
```

## Required Environment Variables

Create `.env` in root:
```
VITE_TMDB_API_KEY=your_tmdb_api_key
MAILTRAP_TOKEN=your_mailtrap_token
MAILTRAP_SENDER_EMAIL=your_sender_email
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:80
```

## Code Style

- Line width: 100 chars (Prettier)
- Single quotes, 2 spaces, semicolons required
- Imports must include `.jsx` or `.js` extension
- Use function expressions for components, declarations for utilities

## Testing

- Frontend: Vitest with jsdom
- Backend: Jest with ts-jest

## Key Architecture Notes

- Custom hooks in `src/features/media/hooks/` handle API logic
- TMDb API key read from `import.meta.env.VITE_TMDB_API_KEY`
- i18n configured with `src/i18n.js` (Italian/English)
