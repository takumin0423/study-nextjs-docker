import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/lib/schema";
import { eq } from "drizzle-orm";

// ToDoを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, completed } = body;
    const todoId = parseInt(params.id);

    if (isNaN(todoId)) {
      return NextResponse.json(
        {
          success: false,
          message: "無効なIDです",
        },
        { status: 400 }
      );
    }

    // 更新するフィールドを準備
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title.trim();
    }
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updatedTodo = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, todoId))
      .returning();

    if (updatedTodo.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "指定されたToDoが見つかりません",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTodo[0],
      message: "ToDoが更新されました",
    });
  } catch (error) {
    console.error("ToDo更新エラー:", error);
    return NextResponse.json(
      {
        success: false,
        message: "ToDoの更新に失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ToDoを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoId = parseInt(params.id);

    if (isNaN(todoId)) {
      return NextResponse.json(
        {
          success: false,
          message: "無効なIDです",
        },
        { status: 400 }
      );
    }

    const deletedTodo = await db
      .delete(todos)
      .where(eq(todos.id, todoId))
      .returning();

    if (deletedTodo.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "指定されたToDoが見つかりません",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedTodo[0],
      message: "ToDoが削除されました",
    });
  } catch (error) {
    console.error("ToDo削除エラー:", error);
    return NextResponse.json(
      {
        success: false,
        message: "ToDoの削除に失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
