"use client";

import { useState } from "react";
import { useActionState } from "react";
import { toggleTodo, updateTodo, deleteTodo } from "@/lib/todo-actions";
import type { Todo } from "@/types/todo";
import DateDisplay from "./DateDisplay";

interface TodoItemProps {
  todo: Todo;
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

// Server Actionをラップする関数
async function updateTodoAction(prevState: any, formData: FormData) {
  const todoId = Number(formData.get("todoId"));
  return await updateTodo(todoId, formData);
}

export default function TodoItem({ todo, onMessage }: TodoItemProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [, updateAction, isUpdating] = useActionState(updateTodoAction, null);

  // ToDoの完了状態を切り替え
  const handleToggleTodo = async () => {
    const result = await toggleTodo(todo.id);
    onMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  };

  // ToDoを削除
  const handleDeleteTodo = async () => {
    if (!confirm("このToDoを削除しますか？")) return;

    const result = await deleteTodo(todo.id);
    onMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${
        todo.completed ? "opacity-75" : ""
      }`}
    >
      {editingTodo?.id === todo.id ? (
        // 編集モード
        <form action={updateAction} className="space-y-4">
          <input type="hidden" name="todoId" value={todo.id} />
          <input
            type="text"
            name="title"
            defaultValue={editingTodo.title}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isUpdating}
          />
          <textarea
            name="description"
            defaultValue={editingTodo.description || ""}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
            disabled={isUpdating}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg font-medium ${
                isUpdating
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isUpdating ? "保存中..." : "保存"}
            </button>
            <button
              type="button"
              onClick={() => setEditingTodo(null)}
              disabled={isUpdating}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium disabled:bg-gray-400"
            >
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        // 表示モード
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`text-lg font-semibold ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`mt-2 ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {todo.description}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                作成日: <DateDisplay dateString={todo.createdAt} />
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleToggleTodo}
                className={`px-3 py-1 rounded-lg font-medium ${
                  todo.completed
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                    : "bg-green-100 hover:bg-green-200 text-green-800"
                }`}
              >
                {todo.completed ? "未完了" : "完了"}
              </button>
              <button
                onClick={() => setEditingTodo(todo)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium"
              >
                編集
              </button>
              <button
                onClick={handleDeleteTodo}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-medium"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
