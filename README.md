# Next.js Docker Study Project

Next.js v15をpnpm + Dockerで管理する学習プロジェクトです。

## 🚀 特徴

- **Next.js 15** - 最新のApp Routerを使用
- **TypeScript** - 型安全な開発
- **TailwindCSS v4** - モダンなスタイリング
- **Drizzle ORM** - PostgreSQLとの連携
- **Docker** - 本番・開発環境の両方に対応
- **pnpm** - 高速なパッケージマネージャー

## 🛠️ セットアップ

### 1. 環境変数の設定

```bash
cp env.example .env
```

`.env`ファイルを編集して、データベース設定を調整してください：

```bash
# データベース設定
DB_NAME=nextjs_app
DB_USER=postgres
DB_PASS=your_secure_password

# Next.js設定
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development

# データベース接続URL
DATABASE_URL=postgresql://postgres:password@db:5432/nextjs_app
```

### 2. 開発環境での起動

```bash
# 開発環境でコンテナを起動
pnpm run docker:dev

# または直接Docker Composeを使用
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

### 3. 本番環境での起動

```bash
# 本番環境でコンテナを起動
pnpm run docker:prod

# または直接Docker Composeを使用
docker compose up --build
```

## 📋 利用可能なスクリプト

### 開発用
- `pnpm dev` - ローカル開発サーバーを起動
- `pnpm run docker:dev` - Docker開発環境を起動
- `pnpm run docker:dev:down` - Docker開発環境を停止

### 本番用
- `pnpm build` - アプリケーションをビルド
- `pnpm start` - 本番サーバーを起動
- `pnpm run docker:prod` - Docker本番環境を起動
- `pnpm run docker:prod:down` - Docker本番環境を停止

### ユーティリティ
- `pnpm lint` - ESLintでコードをチェック
- `pnpm run docker:clean` - 未使用のDockerリソースを削除
- `pnpm run docker:logs` - 本番環境のログを表示
- `pnpm run docker:logs:dev` - 開発環境のログを表示

## 🏗️ アーキテクチャ

### Docker構成

#### 本番環境 (`Dockerfile`)
- **マルチステージビルド** - 効率的なイメージサイズ
- **Alpine Linux** - セキュアで軽量なベースイメージ
- **非rootユーザー** - セキュリティ強化
- **ヘルスチェック** - コンテナの健全性監視
- **読み取り専用ファイルシステム** - セキュリティ向上

#### 開発環境 (`Dockerfile.dev`)
- **ホットリロード** - ソースコード変更の即座反映
- **ボリュームマウント** - 開発効率の向上
- **開発ツール** - デバッグとテストに必要なツール
- **書き込み可能ファイルシステム** - Next.jsの動的ファイル生成に対応

### セキュリティ機能

- 非rootユーザーでの実行
- 読み取り専用ファイルシステム（本番環境）
- セキュリティオプション（`no-new-privileges`）
- 最小限の権限でのコンテナ実行

### 監視・ヘルスチェック

- アプリケーションレベルのヘルスチェック（`/api/health`）
- データベース接続の監視
- コンテナの自動復旧

## 🔧 開発

### ローカル開発（Docker不使用）

```bash
# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### データベース

PostgreSQL 15がDockerコンテナで実行されます：
- ホスト: `db` (Docker環境内) / `localhost` (ローカル環境)
- ポート: `5432`
- データベース名: `.env`ファイルで設定

## 📊 ヘルスチェック

アプリケーションのヘルスチェックは以下のエンドポイントで確認できます：

```
GET /api/health
```

レスポンス例：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "0.1.0"
}
```

## 🚀 デプロイ

本番環境へのデプロイ時は、以下の環境変数を適切に設定してください：

- `DATABASE_URL` - 本番データベースの接続文字列
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`

## 🛠️ トラブルシューティング

### 開発環境でファイル変更が反映されない
- ボリュームマウントが正しく設定されているか確認
- `docker compose -f compose.yaml -f compose.dev.yaml down -v` でボリュームを削除して再起動

### データベース接続エラー
- `.env`ファイルの`DATABASE_URL`でホスト名が`db`になっているか確認
- データベースコンテナが起動完了してからアプリケーションが起動するか確認

### パフォーマンスの問題
- Docker Desktopのリソース設定を確認
- `pnpm run docker:clean`で不要なリソースを削除

## 📚 技術スタック

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **スタイリング**: TailwindCSS v4
- **データベース**: PostgreSQL 15
- **ORM**: Drizzle ORM
- **コンテナ**: Docker & Docker Compose
- **パッケージマネージャー**: pnpm

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
