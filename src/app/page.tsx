"use client";

import { useState } from "react";

interface DbTestResult {
  success: boolean;
  message: string;
  data?: any[];
  tableName?: string;
  timestamp?: string;
  error?: string;
}

export default function Home() {
  const [testResult, setTestResult] = useState<DbTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log("データベース接続テストを開始します...");

      const response = await fetch("/api/test-db", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result: DbTestResult = await response.json();
      setTestResult(result);

      if (result.success) {
        console.log("✅ データベース接続テスト成功:", result.message);
        console.log("取得したデータ:", result.data);
      } else {
        console.error("❌ データベース接続テスト失敗:", result.message);
      }
    } catch (error) {
      console.error("❌ APIエンドポイント呼び出しエラー:", error);
      setTestResult({
        success: false,
        message: "APIエンドポイントの呼び出しに失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div></div>

      <main className="flex flex-col items-center gap-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-center">
          DockerでNext.jsアプリケーションをコンテナ化する
        </h1>

        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-600">
            別コンテナで動作するPostgreSQLデータベースへの接続テストを実行します
          </p>

          <button
            onClick={testDatabaseConnection}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "テスト実行中..." : "データベース接続テスト"}
          </button>
        </div>

        {testResult && (
          <div
            className={`p-6 rounded-lg border-2 w-full max-w-lg ${
              testResult.success
                ? "border-green-500 bg-green-50 text-green-800"
                : "border-red-500 bg-red-50 text-red-800"
            }`}
          >
            <h3 className="font-semibold mb-2">
              {testResult.success ? "✅ 接続成功" : "❌ 接続失敗"}
            </h3>
            <p className="mb-3">{testResult.message}</p>

            {testResult.timestamp && (
              <p className="text-sm opacity-75 mb-2">
                実行時刻:{" "}
                {new Date(testResult.timestamp).toLocaleString("ja-JP")}
              </p>
            )}

            {testResult.data && testResult.data.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">
                  取得したデータ
                  {testResult.tableName &&
                    ` (テーブル: ${testResult.tableName})`}
                  :
                </h4>
                <div className="bg-white/50 p-3 rounded border text-sm">
                  {testResult.data.map((row, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <span className="font-medium">ID:</span> {row.id},
                      <span className="font-medium"> メッセージ:</span>{" "}
                      {row.message}
                      {row.created_at && (
                        <>
                          , <span className="font-medium">作成日時:</span>{" "}
                          {new Date(row.created_at).toLocaleString("ja-JP")}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testResult.error && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">エラー詳細:</h4>
                <div className="bg-white/50 p-3 rounded border text-sm font-mono">
                  {testResult.error}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <div></div>
    </div>
  );
}
