import { NextRequest, NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("データベース接続テストAPIが呼び出されました");

    // データベース接続テストを実行
    const result = await testDatabaseConnection();

    // 結果に応じてレスポンスを返す
    if (result.success) {
      console.log("✅ データベース接続テスト成功:", result.message);
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          data: result.data,
          tableName: result.tableName,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      console.error("❌ データベース接続テスト失敗:", result.message);
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ API エンドポイントでエラーが発生しました:", error);
    return NextResponse.json(
      {
        success: false,
        message: "API エンドポイントでエラーが発生しました",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
