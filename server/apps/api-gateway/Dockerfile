FROM node:18-alpine AS base

WORKDIR /usr/src/app

# Установка curl для health check
RUN apk add --no-cache curl

# Копирование package файлов
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Установка зависимостей
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development

RUN npm ci

COPY . .

RUN npm run build api-gateway

# Production stage
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY . .

COPY --from=development /usr/src/app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Правильный путь к main файлу
CMD ["node", "dist/apps/api-gateway/main"]