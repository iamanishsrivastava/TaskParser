import { ParsedTask } from "../types/ParsedTask";
import nlp from "compromise";
import { extractDate } from "../utils/extractDate.mts";
import { extractPriority } from "../utils/extractPriority.mts";
import { matchFromKB } from "./kbMatcher.mts";

export async function parseTask(input: string): Promise<ParsedTask> {
  if (!input || typeof input !== "string") {
    return {
      title: "",
      due_date: null,
      task_priority: null,
    };
  }

  const doc = nlp(input);
  const verbs = doc.verbs().out("text");
  // const adjectives = doc.adjectives().out("text");
  const nouns = doc.nouns().out("text");

  const title = verbs + " " + nouns || input;

  // check KB for patterns
  const match = await matchFromKB(title.toLowerCase());
  if (match) {
    const due_date = new Date();
    const [hours, minutes] = match.default_due_time.split(":").map(Number);
    due_date.setHours(hours, minutes, 0, 0);

    return {
      title,
      due_date: due_date,
      task_priority: match.default_priority,
    };
  }

  // Fallback to rule-based extraction
  const { date, phrase: datePhrase } = extractDate(input);
  const { priority, phrase: priorityPhrase } = extractPriority(input);

  let cleanTitle = input;
  if (datePhrase) cleanTitle = cleanTitle.replace(datePhrase, "");
  if (priorityPhrase) cleanTitle = cleanTitle.replace(priorityPhrase, "");
  cleanTitle = cleanTitle.replace(/by|priority/gi, "").trim();

  return {
    title: cleanTitle,
    due_date: date,
    task_priority: priority,
  };
}
