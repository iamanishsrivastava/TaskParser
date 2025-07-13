export interface User {
  id: string;
  email?: string;
  name?: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  due_date?: string | null;
  task_label?: string;
  task_status?: "todo" | "in-progress" | "done";
  task_priority?: "low" | "medium" | "high" | "urgent";
  description?: string;
}

export interface TaskPattern {
  id: number;
  pattern: string;
  default_due_time: string;
  default_priority: "low" | "medium" | "high" | "urgent";
}

