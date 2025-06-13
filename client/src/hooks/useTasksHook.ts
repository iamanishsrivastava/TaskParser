// src/hooks/useTasksHook.ts

import { useState, useEffect } from "react";
import type { Task } from "@/types/models";
import { useAuthFetch } from "./useAuthFetch";

export const useTasksHook = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuthFetch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await authFetch("/api/tasks");

        if (!res.ok) throw new Error("Unauthorized or API failed");

        const data = await res.json();
        setTasks(data);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Fetching tasks failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (partialTask: {
    title: string;
    project_id: string;
  }) => {
    //TODO: Add userId to the payload
    const newTaskPayload = {
      title: partialTask.title,
      project_id: partialTask.project_id,
    };

    console.log("Payload being sent:", newTaskPayload);

    const res = await authFetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTaskPayload),
    });

    // DEBUG
    // await authFetch("/api/debug-task", {
    //   method: "POST",
    //   body: JSON.stringify({ title: "Test", projectId: "abc" }),
    // });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to add task", errorText);
      throw new Error("Failed to add task");
    }

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
  };

  const removeTask = async (id: string) => {
    const res = await authFetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } else {
      const errorText = await res.text();
      console.error("Failed to delete task", errorText);
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    const res = await authFetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to update task", errorText);
      throw new Error("Failed to update task");
    }

    const updatedTask = await res.json();
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    removeTask,
    updateTask,
  };
};
