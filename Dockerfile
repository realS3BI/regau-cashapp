# Build stage – Alpine 3.20 + Security-Updates
FROM node:22-alpine3.20 AS builder

RUN apk update && apk upgrade --no-cache \
  && corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG CONVEX_DEPLOY_KEY
ARG ADMIN_PASSWORD
ENV CONVEX_DEPLOY_KEY=$CONVEX_DEPLOY_KEY
RUN test -n "$ADMIN_PASSWORD" || (echo "Error: ADMIN_PASSWORD must be set for Convex deployment" && exit 1)
RUN npx convex env set ADMIN_PASSWORD "$ADMIN_PASSWORD"
RUN npx convex deploy

ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
RUN pnpm run build

# Runtime – Coolify übernimmt Reverse-Proxy
FROM node:22-alpine3.20

RUN apk update && apk upgrade --no-cache

WORKDIR /app
COPY --from=builder /app/dist ./dist

RUN npm install -g serve
EXPOSE 3000

CMD ["serve", "dist", "-s", "-l", "3000"]
