# Dockerfile for Production Environment

# ---------- base AS base ----------
# Node.js 20-slim をベースイメージとして使用
FROM node:20-slim AS base
# 環境変数 PNPM_HOME を設定 (pnpm のインストール先)
ENV PNPM_HOME="/pnpm"
# Next.js のテレメトリを無効化
ENV NEXT_TELEMETRY_DISABLED=1
# 環境変数 PATH に PNPM_HOME を追加
ENV PATH="${PNPM_HOME}:${PATH}"
# corepack を有効化 (Node.js に同梱されている pnpm を使用可能にする)
RUN corepack enable

# 作業ディレクトリを /app に設定
WORKDIR /app

# ---------- deps AS deps ----------
# 依存関係の解決とフェッチを行うステージ
FROM base AS deps
# pnpm-lock.yaml をコピー (依存関係のバージョンを固定するため)
COPY pnpm-lock.yaml ./
# pnpm のキャッシュを利用して依存関係をフェッチ (本番用のみ)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch --prod

# ---------- builder AS builder ----------
# アプリケーションのビルドを行うステージ
FROM base AS builder
# deps ステージから /pnpm ディレクトリをコピー (キャッシュされた依存関係を利用)
COPY --from=deps /pnpm /pnpm
# プロジェクト全体のファイルをコピー
COPY . .
# pnpm のキャッシュを利用して依存関係をインストール (オフライン、本番用、lockfile に基づく)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --offline --prod --frozen-lockfile
# Next.js アプリケーションをビルド
RUN pnpm build

# ---------- runner AS runner ----------
# アプリケーションの実行を行うステージ
FROM base AS runner
# 作業ディレクトリを /app に設定
WORKDIR /app
# builder ステージからビルドされた standalone な Next.js アプリケーションをコピー
COPY --from=builder /app/.next/standalone ./
# builder ステージから public ディレクトリをコピー
COPY --from=builder /app/public ./public
# builder ステージから next.config.ts をコピー (standalone モードで必要な場合がある)
COPY --from=builder /app/next.config.ts ./

# アプリケーションがリッスンするポートを指定
EXPOSE 3000
# コンテナ起動時に実行するコマンド (Next.js standalone サーバーを起動)
CMD ["node", "server.js"]
