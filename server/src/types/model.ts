export interface User {
  id: string;
  email?: string;
  name?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string | null;
  taskLabel?: string;
  taskStatus?: "todo" | "in-progress" | "done";
  taskPriority?: "low" | "medium" | "high" | "urgent";
  description?: string;
}
