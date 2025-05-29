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
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (partialTask: { title: string; projectId: string }) => {
    const parsed = parseTask(partialTask.title);
    const newTask: Task = {
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
    setTasks((prev) => [...prev, newTask]);
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };
  return {
    tasks,
    addTask,
    removeTask,
    updateTask,
  };
};
