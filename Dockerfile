FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching.
COPY app/package*.json ./
RUN npm ci --legacy-peer-deps

# Build prerequisites used by app prebuild script.
COPY scripts/ /scripts/
COPY static/ /static/

# Build the frontend app.
COPY app/ ./
RUN npm run build && npm run api:build && npm prune --omit=dev

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/.api-dist /app/.api-dist
COPY --from=builder /app/server /app/server

EXPOSE 3000

CMD ["node", "server/index.cjs"]
