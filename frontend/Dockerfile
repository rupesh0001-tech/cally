# Multi-stage Dockerfile for Cally Frontend (Bun)

# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package management files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy source code and configuration files
COPY . .

# Build production bundle
RUN bun run build

# ==========================================
# Stage 2: Production Server
# ==========================================
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules and built assets from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["bun", "src/index.ts"]
