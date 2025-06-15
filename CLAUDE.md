# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリのコードを扱う際のガイダンスを提供します。

## プロジェクト概要

Docker対応のNext.js 15アプリケーションで、PostgreSQLデータベースとDrizzle ORMを使用したToDoリスト機能を実装しています。

## 必須コマンド

### 開発
```bash
# ローカル開発
pnpm dev

# Docker開発（推奨）
pnpm run docker:dev           # ホットリロード付きでコンテナ起動
pnpm run docker:dev:down      # コンテナ停止
pnpm run docker:dev:rebuild   # クリーンリビルド
pnpm run docker:dev:migrate   # データベースマイグレーション実行
```

### 本番
```bash
# Docker本番
pnpm run docker:prod          # 本番コンテナ起動
pnpm run docker:prod:down     # コンテナ停止
pnpm run docker:prod:rebuild  # クリーンリビルド
```

### データベース操作
```bash
pnpm db:generate    # スキーマ変更から新しいマイグレーション生成
pnpm db:migrate     # マイグレーション適用
pnpm db:push        # スキーマを直接プッシュ（開発のみ）
pnpm db:studio      # Drizzle Studio GUI起動
pnpm docker:migrate # 独立したマイグレーションサービス実行
```

### コード品質
```bash
pnpm lint           # ESLint実行
```

### Dockerコンテナ操作
```bash
# アプリケーションコンテナに入る
docker exec -it next-app-dev sh

# データベースコンテナに入る
docker exec -it local-pg bash

# PostgreSQLに接続
docker exec -it local-pg psql -U myuser -d mydb

# コンテナのログを確認
docker logs next-app-dev
docker logs local-pg

# リアルタイムでログを確認
docker logs -f next-app-dev
```

## アーキテクチャ概要

### 主要技術
- **Next.js 15** App Router使用
- **PostgreSQL 15** と **Drizzle ORM**
- **Docker** によるコンテナ化
- **TailwindCSS v4** スタイリング
- **Server Actions** データ変更
- **Sonner** トースト通知

### プロジェクト構造
- `src/app/` - Next.js App RouterページとAPIルート
- `src/components/` - Reactコンポーネント（todo/、ui/）
- `src/lib/` - コアユーティリティ：データベース接続（db.ts）、スキーマ（schema.ts）、サーバーアクション（todo-actions.ts）
- `src/types/` - TypeScript型定義
- `src/middleware.ts` - セキュリティヘッダーとCSP設定
- `drizzle/` - データベースマイグレーション

### データベーススキーマ
todosテーブル（src/lib/schema.ts）：
- id（serial主キー）
- title（text、必須）
- description（text、任意）
- completed（boolean、デフォルトfalse）
- createdAt/updatedAt（タイムスタンプ）

### 重要な設定
- **2つのDocker環境**：開発（Dockerfile.dev）はホットリロード付き、本番（Dockerfile）は最適化ビルド
- **環境変数**：`.env`ファイルで設定、DATABASE_URL含む
- **データベース接続**：Drizzle ORMとPostgreSQLアダプター使用（src/lib/db.ts）
- **マルチプラットフォーム対応**：ARM64とx64アーキテクチャ両対応

### セキュリティ機能
- 非rootユーザー（nextjs:nodejs）での実行
- 読み取り専用ファイルシステム（本番環境）
- セキュリティヘッダー（CSP、HSTS、X-Frame-Options等）
- Graceful shutdown設定
- リソース制限設定

### 開発環境の特徴
- ホットリロード対応
- Node.jsデバッガーポート（9229）公開
- ソースコードのボリュームマウント
- 開発ツール（git等）含む

### 最近の改善点
- `.env.example`ファイル追加
- Dockerfileのマルチプラットフォーム対応
- compose.yamlにGraceful shutdown設定
- デバッグポート設定
- 独立したマイグレーションサービス（compose.migrate.yaml）
- ビルドプロセスの最適化
- セキュリティヘッダーの強化
- ヘルスチェックスクリプト追加

### 開発上の注意点
- Server Actionsを使用してデータ変更（src/lib/todo-actions.ts）
- APIルートは/api/todosでCRUD操作可能
- UIテキストは日本語
- スキーマ変更後は必ずマイグレーション実行
- Docker開発環境はソースコードをマウントしてホットリロード対応
- ESLintエラーは必ず修正してからコミット
