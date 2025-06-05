# 公式Nodeイメージからビルド
FROM node:24-slim

# opensslをインストール
RUN apt-get update && apt-get install -y openssl libssl-dev

# ワークディレクトリを設定
WORKDIR /app

# 依存ファイルのみ先にコピー&インストール
COPY package.json package-lock.json ./
RUN npm ci

# アプリ本体をコピー
COPY . .

# Prismaクライアントを生成
RUN npx prisma generate

# SvelteKitを本番ビルド
RUN npm run build

# ポートを公開
EXPOSE 4173

# コンテナ起動時に実行するコマンド
CMD ["npm", "run", "preview"]
