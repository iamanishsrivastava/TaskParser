export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  projectId: string;
  task_label?: string;
  task_status?: "todo" | "in-progress" | "done";
  task_priority?: "low" | "medium" | "high" | "urgent";
  due_date?: Date | null;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  tasks: Task[];
}
