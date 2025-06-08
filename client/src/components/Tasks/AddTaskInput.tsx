// AddTaskInput.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/context/TasksProvider";

console.log("AddTaskInput loaded");

export default function AddTaskInput({ projectId }: { projectId: string }) {
  const [input, setInput] = useState("");
  const { addTask } = useTasks();

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addTask({ title: trimmed, projectId });
    setInput("");
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Type your task (e.g. Submit report by Monday, urgent)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <Button onClick={handleAdd}>Add Task</Button>
    </div>
  );
}
