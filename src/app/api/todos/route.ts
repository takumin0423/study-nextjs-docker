import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/lib/schema";
import { desc } from "drizzle-orm";

// すべてのToDoを取得
export async function GET() {
  try {
    const allTodos = await db
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt));

    return NextResponse.json({
      success: true,
      data: allTodos,
    });
  } catch (error) {
    console.error("ToDo取得エラー:", error);
    return NextResponse.json(
      {
        success: false,
        message: "ToDoの取得に失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 新しいToDoを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "タイトルは必須です",
        },
        { status: 400 }
      );
    }

    const newTodo = await db
      .insert(todos)
      .values({
        title: title.trim(),
        description: description?.trim() || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newTodo[0],
      message: "ToDoが作成されました",
    });
  } catch (error) {
    console.error("ToDo作成エラー:", error);
    return NextResponse.json(
      {
        success: false,
        message: "ToDoの作成に失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
