import { extractDate } from "@/utils/extractDate";
import { extractPriority } from "@/utils/extractPriority";

export interface ParsedTask {
  title: string;
  dueDate: Date | null;
  priority: "low" | "medium" | "high" | null;
}

export function parseTask(input: string): ParsedTask {
  if (!input || typeof input !== "string") {
    return { title: "", dueDate: null, priority: null };
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

  return { title, dueDate: date, priority: level };
}
