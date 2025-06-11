# Next.js Docker ToDoアプリケーション

Next.js 15とDockerを使用した、モダンなToDoリストアプリケーションです。

## 🚀 特徴

- **Next.js 15** - 最新のApp Routerとサーバーコンポーネント
- **TypeScript** - 完全な型安全性
- **TailwindCSS v4** - 最新のユーティリティファーストCSS
- **PostgreSQL 15** - 信頼性の高いデータベース
- **Drizzle ORM** - 型安全なデータベース操作
- **Docker対応** - 開発・本番環境の完全なコンテナ化
- **pnpm** - 高速で効率的なパッケージ管理
- **セキュリティ強化** - CSP、HSTS等のセキュリティヘッダー実装

## 📋 前提条件

- Docker Desktop（最新版）
- Node.js 20以上（ローカル開発の場合）
- pnpm 10.11.0以上（ローカル開発の場合）

## 🛠️ クイックスタート

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd study-nextjs-docker
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集して、必要に応じてデータベースのパスワードを変更してください。

### 3. Docker開発環境の起動

```bash
# 開発環境をDocker Composeで起動（推奨）
pnpm run docker:dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) でアクセスできます。

## 📦 利用可能なスクリプト

### Docker環境

#### 開発環境
```bash
pnpm run docker:dev           # 開発コンテナ起動（ホットリロード付き）
pnpm run docker:dev:down      # 開発コンテナ停止
pnpm run docker:dev:rebuild   # 開発環境を完全リビルド
pnpm run docker:dev:migrate   # 開発環境でマイグレーション実行
```

#### 本番環境
```bash
pnpm run docker:prod          # 本番コンテナ起動
pnpm run docker:prod:down     # 本番コンテナ停止
pnpm run docker:prod:rebuild  # 本番環境を完全リビルド
```

#### データベース
```bash
pnpm run docker:migrate       # 独立したマイグレーションサービス実行
```

### ローカル開発

```bash
pnpm install                  # 依存関係インストール
pnpm dev                      # 開発サーバー起動（Turbopack使用）
pnpm build                    # 本番ビルド
pnpm start                    # 本番サーバー起動
pnpm lint                     # ESLintでコード品質チェック
```

### データベース管理

```bash
pnpm db:generate              # スキーマからマイグレーション生成
pnpm db:migrate               # マイグレーション適用
pnpm db:push                  # スキーマを直接プッシュ（開発用）
pnpm db:studio                # Drizzle Studio起動（GUIツール）
pnpm db:studio:local          # ローカル設定でStudio起動
```

## 🏗️ アーキテクチャ

### Docker構成

#### 本番環境（`Dockerfile`）
- **マルチステージビルド** - 最小限のイメージサイズ
- **Alpine Linux** - 軽量でセキュアなベースイメージ
- **非rootユーザー実行** - セキュリティ強化
- **読み取り専用ファイルシステム** - 改ざん防止
- **ヘルスチェック** - 自動復旧機能
- **マルチプラットフォーム対応** - ARM64/x64両対応

#### 開発環境（`Dockerfile.dev`）
- **ホットリロード** - コード変更の即座反映
- **デバッグポート公開** - Node.jsデバッガー接続可能（ポート9229）
- **ボリュームマウント** - 効率的な開発フロー
- **開発ツール同梱** - git等の必要ツール含む

### セキュリティ機能

- **Content Security Policy (CSP)** - XSS攻撃防止
- **セキュリティヘッダー** - HSTS、X-Frame-Options等
- **非rootユーザー実行** - 最小権限の原則
- **Graceful Shutdown** - データ整合性の保証
- **リソース制限** - DoS攻撃対策

### プロジェクト構造

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # APIルート
│   │   ├── health/          # ヘルスチェックエンドポイント
│   │   └── todos/           # ToDo CRUD API
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # ホームページ
├── components/              # Reactコンポーネント
│   ├── todo/               # ToDo関連コンポーネント
│   └── ui/                 # UI共通コンポーネント
├── lib/                    # ユーティリティ
│   ├── db.ts              # データベース接続
│   ├── schema.ts          # Drizzleスキーマ定義
│   └── todo-actions.ts    # Server Actions
├── types/                  # TypeScript型定義
└── middleware.ts           # Next.jsミドルウェア
```

## 🗄️ データベース

### PostgreSQL設定
- バージョン: 15 Alpine
- ポート: 5432
- ヘルスチェック: 自動設定済み
- データ永続化: Dockerボリューム使用

### todosテーブルスキーマ
```typescript
{
  id: number;              // 自動採番の主キー
  title: string;           // ToDoのタイトル（必須）
  description?: string;    // ToDoの説明（任意）
  completed: boolean;      // 完了状態
  createdAt: Date;         // 作成日時
  updatedAt: Date;         // 更新日時
}
```

## 🔍 API エンドポイント

### ヘルスチェック
```
GET /api/health
```

レスポンス例：
```json
{
  "status": "ok",
  "timestamp": "2024-12-11T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "0.1.0"
}
```

### ToDo API
```
GET    /api/todos          # ToDo一覧取得
POST   /api/todos          # ToDo作成
PATCH  /api/todos/:id      # ToDo更新
DELETE /api/todos/:id      # ToDo削除
```

## 🚀 デプロイ

### 環境変数の設定

本番環境では以下の環境変数を設定してください：

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Dockerイメージのビルドとプッシュ

```bash
# イメージのビルド
docker build -t your-registry/nextjs-app:latest .

# レジストリへプッシュ
docker push your-registry/nextjs-app:latest
```

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### ホットリロードが効かない
```bash
# ボリュームを削除して再起動
pnpm run docker:dev:rebuild
```

#### データベース接続エラー
```bash
# データベースの状態確認
docker compose ps
docker compose logs db

# マイグレーションの再実行
pnpm run docker:migrate
```

#### ポート競合エラー
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :5432

# 必要に応じてプロセスを終了
kill -9 <PID>
```

#### ビルドエラー
```bash
# Dockerのクリーンアップ
docker system prune -a
docker volume prune
```

## 🧪 開発のヒント

### デバッグ
1. VS Codeのデバッガーを使用可能（ポート9229）
2. Chrome DevToolsでNode.jsデバッグ: `chrome://inspect`

### パフォーマンス最適化
- Turbopackを使用した高速な開発体験
- マルチステージビルドによる最小イメージサイズ
- BuildKitキャッシュの活用

### ベストプラクティス
- コミット前に必ず`pnpm lint`を実行
- スキーマ変更後はマイグレーション生成
- 環境変数は`.env.example`を更新

## 📚 技術スタック詳細

- **フレームワーク**: [Next.js 15](https://nextjs.org/)
- **言語**: [TypeScript 5](https://www.typescriptlang.org/)
- **スタイリング**: [TailwindCSS v4](https://tailwindcss.com/)
- **データベース**: [PostgreSQL 15](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **コンテナ**: [Docker](https://www.docker.com/) & Docker Compose
- **パッケージマネージャー**: [pnpm](https://pnpm.io/)
- **UI通知**: [Sonner](https://sonner.emilkowal.ski/)

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずイシューを作成して変更内容を議論してください。

1. フォークする
2. フィーチャーブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'feat: 素晴らしい機能を追加'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

このプロジェクトは以下の素晴らしいオープンソースプロジェクトを使用しています：
- Next.js チーム
- Vercel
- PostgreSQL コミュニティ
- Drizzle ORM チーム
- その他すべての依存関係の作者たち