// src/types/ParsedTask.ts
export interface ParsedTask {
  title: string;
  due_date: Date | null;
  task_priority: "low" | "medium" | "high" | null;
}
