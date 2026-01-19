# ============================================
# Hangman - Production Dockerfile
# Multi-stage build for optimal image size
# ============================================

# Stage 1: Install dependencies
FROM oven/bun:1.1 AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM oven/bun:1.1 AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Nuxt application
ENV NODE_ENV=production
RUN bun run build

# Stage 3: Production runtime
FROM oven/bun:1.1-slim AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nuxt && \
    adduser --system --uid 1001 --gid 1001 nuxt

# Copy built application
COPY --from=builder --chown=nuxt:nuxt /app/.output ./.output

# Switch to non-root user
USER nuxt

# Expose port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the server
CMD ["bun", ".output/server/index.mjs"]
