"use server";

import { db } from "./db";
import { todos } from "./schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Todo } from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  try {
    const allTodos = await db
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt));

    // Dateオブジェクトをstringに変換
    return allTodos.map((todo) => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("サーバーサイドでのToDo取得エラー:", error);
    return [];
  }
}

// Server Action: ToDoを作成
export async function createTodo(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || title.trim() === "") {
      return {
        success: false,
        message: "タイトルは必須です",
      };
    }

    await db.insert(todos).values({
      title: title.trim(),
      description: description?.trim() || null,
    });

    revalidatePath("/");

    return {
      success: true,
      message: "ToDoが作成されました",
    };
  } catch (error) {
    console.error("ToDo作成エラー:", error);
    return {
      success: false,
      message: "ToDoの作成に失敗しました",
    };
  }
}

// Server Action: ToDoの完了状態を切り替え
export async function toggleTodo(todoId: number) {
  try {
    // 現在のToDoを取得
    const [currentTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, todoId))
      .limit(1);

    if (!currentTodo) {
      return {
        success: false,
        message: "指定されたToDoが見つかりません",
      };
    }

    // 完了状態を切り替え
    await db
      .update(todos)
      .set({
        completed: !currentTodo.completed,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, todoId));

    revalidatePath("/");

    return {
      success: true,
      message: "ToDoが更新されました",
    };
  } catch (error) {
    console.error("ToDo更新エラー:", error);
    return {
      success: false,
      message: "ToDoの更新に失敗しました",
    };
  }
}

// Server Action: ToDoを更新
export async function updateTodo(todoId: number, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || title.trim() === "") {
      return {
        success: false,
        message: "タイトルは必須です",
      };
    }

    const [updatedTodo] = await db
      .update(todos)
      .set({
        title: title.trim(),
        description: description?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, todoId))
      .returning();

    if (!updatedTodo) {
      return {
        success: false,
        message: "指定されたToDoが見つかりません",
      };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "ToDoが更新されました",
    };
  } catch (error) {
    console.error("ToDo更新エラー:", error);
    return {
      success: false,
      message: "ToDoの更新に失敗しました",
    };
  }
}

// Server Action: ToDoを削除
export async function deleteTodo(todoId: number) {
  try {
    const [deletedTodo] = await db
      .delete(todos)
      .where(eq(todos.id, todoId))
      .returning();

    if (!deletedTodo) {
      return {
        success: false,
        message: "指定されたToDoが見つかりません",
      };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "ToDoが削除されました",
    };
  } catch (error) {
    console.error("ToDo削除エラー:", error);
    return {
      success: false,
      message: "ToDoの削除に失敗しました",
    };
  }
}
