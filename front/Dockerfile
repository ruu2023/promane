# ビルドステージ
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 実行ステージ
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

ENV PORT=8080
CMD ["npm", "run", "start", "--", "-p", "8080"]