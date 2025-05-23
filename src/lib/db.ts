import { Pool } from "pg";

// データベース接続用のPoolインスタンスを作成
let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // 接続プールの設定
      max: 20, // 最大接続数
      idleTimeoutMillis: 30000, // アイドル接続のタイムアウト
      connectionTimeoutMillis: 2000, // 接続タイムアウト
    });

    // 接続エラーのハンドリング
    pool.on("error", (err) => {
      console.error("データベース接続プールでエラーが発生しました:", err);
    });
  }

  return pool;
}

// テスト用のテーブルが存在するかチェックし、なければ作成
export async function ensureTestTable(): Promise<void> {
  const pool = getDbPool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // テストデータを1件挿入（既存チェック付き）
    const result = await pool.query("SELECT COUNT(*) FROM test_connection");
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      await pool.query("INSERT INTO test_connection (message) VALUES ($1)", [
        "データベース接続テスト用のメッセージです",
      ]);
    }
  } catch (error) {
    console.error("テーブル作成中にエラーが発生しました:", error);
    throw error;
  }
}

// データベース接続をテストする関数
export async function testDatabaseConnection(): Promise<{
  success: boolean;
  message: string;
  data?: any[];
  tableName?: string;
}> {
  try {
    const pool = getDbPool();

    // 基本的な接続テスト
    const result = await pool.query("SELECT NOW() as current_time");
    console.log("データベース接続成功:", result.rows[0]);

    // テーブルの存在確認と作成
    await ensureTestTable();

    // テストデータの取得
    const testData = await pool.query(
      "SELECT * FROM test_connection ORDER BY created_at DESC LIMIT 5"
    );

    return {
      success: true,
      message: "データベース接続成功！データを正常に取得できました。",
      data: testData.rows,
      tableName: "test_connection",
    };
  } catch (error) {
    console.error("データベース接続エラー:", error);
    return {
      success: false,
      message: `データベース接続エラー: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
