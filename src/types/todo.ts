export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  data?: Todo | Todo[];
  message?: string;
  error?: string;
}

export interface NewTodo {
  title: string;
  description: string;
}
