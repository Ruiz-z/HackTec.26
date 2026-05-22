FROM node:20-alpine3.20 AS base
RUN apk add --no-cache openssl && npm install -g pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

FROM deps AS builder
COPY prisma ./prisma/
RUN pnpm prisma generate
COPY . .
RUN pnpm build

FROM node:20-alpine3.20 AS runner
RUN apk add --no-cache openssl && npm install -g pnpm
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY --from=builder /app/prisma       ./prisma
COPY --from=builder /app/package.json ./
EXPOSE 3001
CMD sh -c "pnpm prisma migrate deploy && node dist/index.js"
