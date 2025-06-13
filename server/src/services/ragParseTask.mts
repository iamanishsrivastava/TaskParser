// src/services/ragParseTask.ts

import { extractDate } from "../utils/extractDate.mts";
import { extractPriority } from "../utils/extractPriority.mts";

export interface ParsedTask {
  title: string;
  due_date: Date | null;
  task_priority: "low" | "medium" | "high" | null;
}

export async function ragParseTask(input: string): Promise<ParsedTask> {
  // TODO: implement RAG parsing logic

  if (!input || typeof input !== "string") {
    return { title: "", due_date: null, task_priority: null };
  }

  const { date, phrase: datePhrase } = extractDate(input);
  const { level, phrase: priorityPhrase } = extractPriority(input);

  let title = input;
  if (datePhrase) title = title.replace(datePhrase, "");
  if (priorityPhrase) title = title.replace(priorityPhrase, "");
  title = title
    .replace(/by/, "")
    .replace(/priority/, "")
    .trim();

  return { title, due_date: date, task_priority: level };
}
