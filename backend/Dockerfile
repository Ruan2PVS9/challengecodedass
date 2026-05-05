FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci --quiet --no-audit --no-fund
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm prune --production

FROM node:22-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "src/index.js"]
