# Dockerfile for Cally Background Worker Service (Bun + BullMQ)

FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy package management files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy worker source code
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

CMD ["bun", "index.ts"]
