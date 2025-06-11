# Dockerfile for Production Environment

# マルチプラットフォーム対応のための変数定義
ARG NODE_VERSION=20
ARG PNPM_VERSION=10.11.0

# ---------- base AS base ----------
# Node.js 20-alpine をベースイメージとして使用（slimよりもセキュアで軽量）
# マルチプラットフォームビルドをサポート
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS base

# セキュリティ向上のため非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なシステムパッケージをインストール
RUN apk add --no-cache libc6-compat curl

# セキュリティアップデートを別レイヤーで実行（キャッシュ効率向上）
RUN apk upgrade --no-cache --available

# 環境変数 PNPM_HOME を設定 (pnpm のインストール先)
ENV PNPM_HOME="/pnpm"
# Next.js のテレメトリを無効化
ENV NEXT_TELEMETRY_DISABLED=1
# 環境変数 PATH に PNPM_HOME を追加
ENV PATH="${PNPM_HOME}:${PATH}"
# corepack を有効化し、pnpmバージョンを固定
RUN corepack enable
RUN corepack prepare pnpm@${PNPM_VERSION} --activate

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

# 不要なファイルを削除してイメージサイズを削減
RUN rm -rf /pnpm/store

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

# ビルド時の環境変数を設定
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js アプリケーションをビルド
# ビルド出力を最適化
RUN pnpm build && \
    # 不要なキャッシュファイルを削除
    rm -rf .next/cache && \
    # 開発用依存関係を削除
    pnpm prune --prod

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
RUN mkdir -p .next/static /tmp /var/cache/nextjs && \
    chown -R nextjs:nodejs /app /tmp /var/cache/nextjs

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

# ヘルスチェックを追加（より詳細な設定）
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Graceful shutdownのための設定
STOPSIGNAL SIGTERM

# コンテナ起動時に実行するコマンド (Next.js standalone サーバーを起動)
CMD ["node", "server.js"]
