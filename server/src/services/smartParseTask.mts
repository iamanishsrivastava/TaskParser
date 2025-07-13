// src/services/smartParseTask.mts
import type { ParsedTask } from "../types/ParsedTask.ts";
import { parseTask } from "./parseTask.mts";
import { matchFromKB } from "./kbMatcher.mts";
import { ragParseTask } from "./rag/ragParseTask.mts"
import { learnPattern } from "./taskLearner.mts";

export async function smartParseTask(input: string): Promise<ParsedTask> {
  let parsed = await parseTask(input);

  // 1. Try rule-based fallback if title exists but others missing
  if ((!parsed.due_date || !parsed.task_priority) && parsed.title) {
    const kbMatch = await matchFromKB(parsed.title);
    if (kbMatch) {
      parsed = {
        ...parsed,
        due_date:
          parsed.due_date ||
          new Date(
            `${new Date().toISOString().split("T")[0]}T${
              kbMatch.default_due_time
            }`
          ),
        task_priority: parsed.task_priority || kbMatch.default_priority,
      };
    }
  }

  // 2. If still missing → use RAG fallback
  const needsRAG = !parsed.due_date || !parsed.task_priority;
  if (needsRAG) {
    try {
      const ragParsed = await ragParseTask(input);
      parsed = {
        title: ragParsed.title || parsed.title,
        due_date: parsed.due_date || ragParsed.due_date,
        task_priority: parsed.task_priority || ragParsed.task_priority,
      };

      // 3. Save pattern to DB
      if (ragParsed.due_date || ragParsed.task_priority) {
        await learnPattern(ragParsed);
      }
    } catch (err) {
      console.error("RAG failed:", err);
    }
  }

  return parsed;
}
