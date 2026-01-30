# Build stage – Alpine 3.20 + Security-Updates
FROM node:22-alpine3.20 AS builder

RUN apk update && apk upgrade --no-cache \
  && corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG CONVEX_DEPLOY_KEY
ENV CONVEX_DEPLOY_KEY=$CONVEX_DEPLOY_KEY
RUN npx convex deploy

ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
RUN pnpm run build

# Runtime – Coolify übernimmt Reverse-Proxy
FROM node:22-alpine3.20

RUN apk update && apk upgrade --no-cache

WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npx", "-y", "serve", "dist", "-s", "-l", "3000"]
