// hooks/useTasksHook.ts
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import type { Task } from "@/types/models";
import { parseTask } from "@/services/parser/parseTask";

export const useTasksHook = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    fetch(`/api/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  async function addTask(partialTask: { title: string; projectId: string }) {
    const parsed = parseTask(partialTask.title);
    const newTaskPayload = {
      id: nanoid(),
      title: parsed.title || partialTask.title,
      projectId: partialTask.projectId,
      completed: false,
      createdAt: new Date().toISOString(),
      due_date: parsed.dueDate || null,
      task_label: "Feature",
      task_status: "todo",
      task_priority: parsed.priority || "medium",
      description: "",
    };

    const res = await fetch(`/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTaskPayload),
    });

    if (!res.ok) throw new Error("Failed to add task");
    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
  }

  const removeTask = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    });
    console.error("Update failed:", await res.text());
    if (!res.ok) throw new Error("Failed to update task");
    const updatedTask = await res.json();

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
  };

  return {
    tasks,
    addTask,
    removeTask,
    updateTask,
  };
};
