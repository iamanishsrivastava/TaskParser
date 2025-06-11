import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  project_id: z.string().uuid(),
  due_date: z.string().datetime().optional().nullable(),

  task_label: z.string().default("Feature"),
  task_status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  task_priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  description: z.string().default(""),
  completed: z.boolean().default(false),
});
