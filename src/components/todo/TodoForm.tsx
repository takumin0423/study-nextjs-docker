"use client";

import { useActionState } from "react";
import { createTodo } from "@/lib/todo-actions";
import { useEffect, useRef } from "react";

interface TodoFormProps {
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

// Server Actionをラップする関数
async function createTodoAction(prevState: any, formData: FormData) {
  return await createTodo(formData);
}

export default function TodoForm({ onMessage }: TodoFormProps) {
  const [state, formAction, isPending] = useActionState(createTodoAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Server Actionの結果に基づいてメッセージを表示
  useEffect(() => {
    if (state) {
      onMessage({
        type: state.success ? "success" : "error",
        text: state.message,
      });

      // 成功時にフォームをリセット
      if (state.success && formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state, onMessage]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        新しいToDoを作成
      </h2>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="タイトル（必須）"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="説明（任意）"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isPending
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isPending ? "作成中..." : "ToDoを作成"}
        </button>
      </form>
    </div>
  );
}
