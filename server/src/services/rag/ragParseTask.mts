// src/services/rag/ragParseTask.ts
import type { ParsedTask } from "../../types/ParsedTask";
import fetch from "node-fetch";

const text = [
  "Call John after meeting",
  "Book a meeting with client",
  "Design dashboard and wireframes",
  "Solve 5 DSA questions by tomorrow",
  "Meet jai tomorrow 5pm",
];

async function runBatch() {
  for (const sentence of text) {
    const task = await ragParseTask(sentence);
    console.log(task);
  }
}

// runBatch(); // trigger top-level

export async function ragParseTask(input: string): Promise<ParsedTask> {
  const OPEN_ROUTER_API = process.env.OPEN_ROUTER_API;
  const model = process.env.MODEL_ID;

  const prompt = `
You are a smart assistant that extracts structured task data.

Respond with ONLY a JSON object in this format:
{
  "title": string,
  "due_date": string (ISO 8601 format) or null,
  "task_priority": "low" | "medium" | "high" | "urgent"
}

RULES:
- Use today's date as context: ${new Date().toISOString().split("T")[0]}.
- Guess the "due_date" based on hints in the sentence. Avoid null if you can logically infer a date.
- Prioritize based on urgency implied by time and task nature.
- Title should be a concise action name (not full sentence).
- DO NOT include markdown, backticks, or explanation.

Input: "${input}"
Output:
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPEN_ROUTER_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 80,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`OpenRouter error:`, err);
    throw new Error(`Failed to parse task: ${err}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };

  const raw = data.choices[0]?.message?.content?.trim() || "";

  console.log("Model Raw Output:", raw);

  const match = raw.match(/{[\s\S]+}/);
  if (!match) {
    console.warn("No JSON block found");
    return {
      title: input,
      due_date: null,
      task_priority: null,
    };
  }

  try {
    const parsed = JSON.parse(match[0]);
    return {
      title: parsed.title || input,
      due_date: parsed.due_date || null,
      task_priority: parsed.task_priority || null,
    };
  } catch (err) {
    console.error("JSON parsing error:", err);
    return {
      title: input,
      due_date: null,
      task_priority: null,
    };
  }
}
