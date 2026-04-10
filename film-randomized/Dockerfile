# Frontend Dockerfile for Film Randomized React/Vite app
# Multi-stage build for optimized image size
# Optimized for Railway deployment

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

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (Railway will set PORT env variable)
# Nginx listens on port 80 by default, but Railway may assign a different port
EXPOSE 80

# Start nginx
# Railway sets PORT automatically, nginx will listen on 80
CMD ["nginx", "-g", "daemon off;"]
