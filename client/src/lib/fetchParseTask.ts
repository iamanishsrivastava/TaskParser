// src/lib/fetchParseTask.ts
import type { ParsedTask } from "@/types/ParsedTask";
import magic from "./magic";

export const fetchParseTask = async (title: string): Promise<ParsedTask> => {
  console.log("fetchParseTask called with title:", title);
  const didToken = await magic.user.getIdToken();
  const res = await fetch("/api/parse", {
    method: "POST",
    body: JSON.stringify({ title }),
    headers: {
      Authorization: `Bearer ${didToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to parse task: ${err}`);
  }

  return res.json();
};
