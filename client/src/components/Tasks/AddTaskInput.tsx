import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/context/TasksProvider";

export default function AddTaskInput({ project_id }: { project_id: string }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addTask } = useTasks();

  const handleAdd = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    try {
      await addTask({ title: trimmed, project_id });
      setInput("");
    } catch (err) {
      console.error("Error adding task from AddTaskInput:", err);
    } finally {
      setIsLoading(false);
    }
  }, [input, project_id, addTask, isLoading]);

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Type your task (e.g. Submit report by Monday, urgent)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        disabled={isLoading}
      />
      <Button onClick={handleAdd} disabled={isLoading || !input.trim()}>
        {isLoading ? "Adding..." : "Add Task"}
      </Button>
    </div>
  );
}
