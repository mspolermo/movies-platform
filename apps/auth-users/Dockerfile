FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Установка curl для health check
RUN apk add --no-cache curl

# Копирование package файлов
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Установка зависимостей
RUN npm ci --only=production && npm cache clean --force

# Development stage (bind-mount DX — root; не USER node)
FROM base AS development

RUN npm ci

COPY . .

RUN npm run build auth-users

# Production stage
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
# Sync with apps/common/constants/network.ts NETWORK.authUsers.listen
ENV PORT=3001

COPY . .

COPY --from=development /usr/src/app/dist ./dist

RUN chown -R node:node /usr/src/app

USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

CMD ["node", "dist/apps/auth-users/main"]
