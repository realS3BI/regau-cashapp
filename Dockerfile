# Build stage – Alpine 3.20 + Security-Updates
FROM node:22-alpine3.20 AS builder

RUN apk update && apk upgrade --no-cache \
  && corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG ADMIN_PASSWORD
ARG CONVEX_SELF_HOSTED_ADMIN_KEY
ARG CONVEX_SELF_HOSTED_URL
ARG VITE_CONVEX_URL
ENV CONVEX_SELF_HOSTED_ADMIN_KEY=$CONVEX_SELF_HOSTED_ADMIN_KEY
ENV CONVEX_SELF_HOSTED_URL=$CONVEX_SELF_HOSTED_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
RUN test -n "$ADMIN_PASSWORD" || (echo "Error: ADMIN_PASSWORD must be set for Convex deployment" && exit 1)
RUN test -n "$CONVEX_SELF_HOSTED_ADMIN_KEY" || (echo "Error: CONVEX_SELF_HOSTED_ADMIN_KEY must be set" && exit 1)
RUN test -n "$CONVEX_SELF_HOSTED_URL" || (echo "Error: CONVEX_SELF_HOSTED_URL must be set" && exit 1)
RUN npx convex env set ADMIN_PASSWORD "$ADMIN_PASSWORD"
RUN npx convex dev --once
RUN pnpm run build

# Runtime – Coolify übernimmt Reverse-Proxy
FROM node:22-alpine3.20

RUN apk update && apk upgrade --no-cache

WORKDIR /app
COPY --from=builder /app/dist ./dist

RUN npm install -g serve
EXPOSE 3000

CMD ["serve", "dist", "-s", "-l", "3000"]
