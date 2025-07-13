// src/utils/extractPriority.mts
const priorityWords: Record<"low" | "medium" | "high", string[]> = {
  low: ["low", "not urgent", "minor"],
  medium: ["medium", "normal", "moderate"],
  high: ["high", "urgent", "asap", "critical"],
};

export function extractPriority(input: string) {
  const lower = input.toLowerCase();
  for (const priority of Object.keys(priorityWords) as Array<
    keyof typeof priorityWords
  >) {
    for (const word of priorityWords[priority]) {
      if (lower.includes(word)) return { priority, phrase: word };
    }
  }
  return { priority: null, phrase: null };
}
