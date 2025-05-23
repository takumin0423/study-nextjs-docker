# Dockerfile for Production Environment

# ---------- base AS base ----------
# Node.js 20-alpine をベースイメージとして使用（slimよりもセキュアで軽量）
FROM node:20-alpine AS base

# セキュリティ向上のため非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なシステムパッケージをインストール（セキュリティアップデート含む）
RUN apk add --no-cache libc6-compat curl \
    && apk upgrade --no-cache

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

# package.json と pnpm-lock.yaml を先にコピー（レイヤーキャッシュ最適化）
COPY package.json pnpm-lock.yaml ./

# pnpm のキャッシュを利用して依存関係をフェッチ（本番用のみ）
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch --prod

# 本番用依存関係をインストール
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --offline --prod --frozen-lockfile

# ---------- builder AS builder ----------
# アプリケーションのビルドを行うステージ
FROM base AS builder

# package.json と pnpm-lock.yaml をコピー
COPY package.json pnpm-lock.yaml ./

# 開発依存関係も含めて全ての依存関係をインストール（ビルドに必要）
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm fetch

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# プロジェクト全体のファイルをコピー
COPY . .

# Next.js アプリケーションをビルド
RUN pnpm build

# ---------- runner AS runner ----------
# アプリケーションの実行を行うステージ
FROM base AS runner

# 本番環境の設定
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 作業ディレクトリを /app に設定
WORKDIR /app

# 必要なディレクトリを作成し、適切な権限を設定
RUN mkdir -p .next/static && \
    chown -R nextjs:nodejs /app

# 非rootユーザーに切り替え（セキュリティ向上）
USER nextjs

# builder ステージからビルドされた standalone な Next.js アプリケーションをコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# builder ステージから static ファイルをコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# builder ステージから public ディレクトリをコピー
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# package.jsonをコピー（バージョン情報取得のため）
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# アプリケーションがリッスンするポートを指定
EXPOSE 3000

# ヘルスチェックを追加
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# コンテナ起動時に実行するコマンド (Next.js standalone サーバーを起動)
CMD ["node", "server.js"]
