import { getTodos } from "@/lib/todo-actions";
import TodoContainer from "@/components/todo/TodoContainer";

export default async function Home() {
  // サーバーサイドで初期データを取得
  const todos = await getTodos();

  return <TodoContainer todos={todos} />;
}
