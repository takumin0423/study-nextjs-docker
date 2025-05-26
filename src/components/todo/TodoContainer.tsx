"use client";

import { useState } from "react";
import type { Todo } from "@/types/todo";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import Message from "./Message";

interface TodoContainerProps {
  todos: Todo[];
}

export default function TodoContainer({ todos }: TodoContainerProps) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          ToDoリスト
        </h1>

        {/* メッセージ表示 */}
        <Message message={message} />

        {/* 新しいToDo作成フォーム */}
        <TodoForm onMessage={setMessage} />

        {/* ToDoリスト */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">
                まだToDoがありません。上のフォームから作成してください。
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onMessage={setMessage} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
