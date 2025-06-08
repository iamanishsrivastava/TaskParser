const priorityWords: Record<"low" | "medium" | "high", string[]> = {
  low: ["low", "not urgent", "minor"],
  medium: ["medium", "normal", "moderate"],
  high: ["high", "urgent", "asap", "critical"],
};

export function extractPriority(input: string): {
  level: "low" | "medium" | "high" | null;
  phrase: string | null;
} {
  if (!input || typeof input !== "string") {
    return { level: null, phrase: null };
  }
  const lower = input.toLowerCase();

  for (const level of Object.keys(priorityWords) as Array<
    "low" | "medium" | "high"
  >) {
    for (const word of priorityWords[level]) {
      if (lower.includes(word)) {
        return { level, phrase: word };
      }
    }
  }

  return { level: null, phrase: null };
}
