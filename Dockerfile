FROM node:20-alpine AS base

# Install dependencies for better-sqlite3 native addon
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy seed script + dependencies needed at runtime
COPY --from=builder /app/src/lib/seed.ts ./src/lib/seed.ts
COPY --from=builder /app/src/lib/db.ts ./src/lib/db.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Data dir for SQLite + uploads (mount Railway Volume here)
RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs

EXPOSE 8080

# Seed DB then start server
CMD npx tsx src/lib/seed.ts && node server.js

