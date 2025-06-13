// src/services/ragParseTask.ts

export interface ParsedTask {
    title: string;
    dueDate: Date | null;
    priority: "low" | "medium" | "high" | null;
}

export async function parseTask(input: string): Promise<ParsedTask> {
    // TODO: implement RAG parsing logic
    return { title: "", dueDate: null, priority: null };
}