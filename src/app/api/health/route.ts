import { NextResponse } from "next/server";

export async function GET() {
  try {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown",
      version: process.env.npm_package_version || "0.1.0",
    };

    console.log("ヘルスチェック完了:", healthData);

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error("ヘルスチェックエラー:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
