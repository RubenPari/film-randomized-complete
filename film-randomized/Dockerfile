# Frontend Dockerfile for Film Randomized React/Vite app
# Multi-stage build — nginx serves static files and proxies /api to BACKEND_UPSTREAM

# Build stage
FROM node:20-alpine AS build

# Build-time TMDb API key for Vite
ARG VITE_TMDB_API_KEY
ENV VITE_TMDB_API_KEY=${VITE_TMDB_API_KEY}

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build Vite frontend (uses VITE_TMDB_API_KEY)
RUN npm run build

# Production stage - use nginx for serving static files
FROM nginx:alpine AS production

# Default for Docker Compose / local stack; override on Fly via [env] or fly secrets
ENV BACKEND_UPSTREAM=backend:8000

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Template → /etc/nginx/conf.d/default.conf via nginx image entrypoint (envsubst)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
