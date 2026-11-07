# Single production image: NestJS API that also serves the built React SPA.
# Build context: repository root.

# --- Frontend build (Vite bakes VITE_TMDB_API_KEY into the bundle) ---
FROM node:24.22.1-alpine AS web
ARG VITE_TMDB_API_KEY
ENV VITE_TMDB_API_KEY=${VITE_TMDB_API_KEY}
WORKDIR /web
COPY film-randomized/package*.json ./
RUN npm ci
COPY film-randomized/ ./
RUN npm run build

# --- Backend build ---
FROM node:24.22.1-alpine AS api
WORKDIR /app
COPY film-randomized-back/package*.json ./
RUN npm ci
COPY film-randomized-back/ ./
RUN npm run build

# --- Runtime ---
FROM node:24.22.1-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY film-randomized-back/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=api /app/dist ./dist
COPY --from=web /web/dist ./public
COPY film-randomized-back/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
USER node
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-8000}/api/health" || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
