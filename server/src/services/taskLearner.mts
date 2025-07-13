// src/services/taskLearner.mts
import type { ParsedTask } from "../types/ParsedTask.ts";
import { db } from "../utils/db.mts";

export async function learnPattern(task: ParsedTask) {
  const base = task.title.toLowerCase();
  if (!task.due_date && !task.task_priority) return;

  const existing = await db.query(
    "SELECT * FROM task_pattern WHERE pattern = $1 LIMIT 1",
    [base]
  );

  const payload = {
    pattern: base,
    default_due_time: task.due_date?.toISOString().split("T")[1] || "18:00:00",
    default_priority: task.task_priority || "medium",
  };

  if (existing.rows.length > 0) {
    await db.query(
      `UPDATE task_pattern SET default_due_time = $1, default_priority = $2 WHERE pattern = $3`,
      [payload.default_due_time, payload.default_priority, base]
    );
  } else {
    await db.query(
      `INSERT INTO task_pattern (pattern, default_due_time, default_priority) VALUES ($1, $2, $3)`,
      [payload.pattern, payload.default_due_time, payload.default_priority]
    );
  }
}