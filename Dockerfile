# 公式Nodeイメージからビルド
FROM node:24-slim

WORKDIR /app

# 依存ファイルのみ先にコピー&インストール
COPY package.json package-lock.json ./
RUN npm ci

# Prisma用
COPY prisma ./prisma
RUN npx prisma generate

# アプリ本体
COPY . .

# SvelteKitを本番ビルド
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
