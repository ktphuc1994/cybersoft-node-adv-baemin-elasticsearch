FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN apk add --no-cache git \
    && corepack enable pnpm \
    && pnpm install --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
ARG BUILD_ENVIRONMENT
# ARG SERVER_API_URL
ARG NEXT_PUBLIC_CLIENT_API_URL
ENV NEXT_PUBLIC_CLIENT_API_URL=$NEXT_PUBLIC_CLIENT_API_URL

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN apk add --no-cache git curl \
    && npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]


# Build không cần backend để tạo ISR
# docker build --build-arg BUILD_ENVIRONMENT=local -t baemin-frontend-nextjs-img .
# docker run -d -p 3000:3000 --name baemin-frontend-nextjs-container --network node_network baemin-frontend-nextjs-img

# Build cần backend để tọa ISR hoặc SSG, và backend này đang có port ngoài là localhost:8080. Port trong là nestjs-baemin-container:8080
# docker build --build-arg SERVER_API_URL=http://localhost:8080 --network=host -t baemin-frontend-nextjs-img .
# docker run -d -p 3000:3000 --name baemin-frontend-nextjs-container --network node_network --env SERVER_API_URL=http://nestjs-baemin-container:8080 baemin-frontend-nextjs-img