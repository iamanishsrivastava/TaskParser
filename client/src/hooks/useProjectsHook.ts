// src/hooks/useProjectsHook.ts

import { useState, useEffect } from "react";
import type { Project } from "@/types/models";
import { useAuthFetch } from "./useAuthFetch";

export const useProjectsHook = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuthFetch();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await authFetch("/api/projects");
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        if (Array.isArray(data)) setProjects(data);
        else throw new Error("Expected array, got: " + JSON.stringify(data));
      } catch (err) {
        console.error(err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const addProject = async (title: string) => {
    const newProjectPayload = {
      title: capitalize(title),
    };

    const res = await authFetch("/api/projects", {
      method: "POST",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjectPayload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to add project", errorText);
      throw new Error("Failed to add project");
    }

    const newProject = await res.json();
    setProjects((prev) => [...prev, newProject]);
    return newProject.id;
  };

  const removeProject = async (id: string) => {
    const res = await authFetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } else {
      const errorText = await res.text();
      console.error("Failed to delete project", errorText);
    }
  };

  const updateProject = async (id: string, title: string) => {
    const updatedPayload = { title: capitalize(title) };

    const res = await authFetch(`/api/projects/${id}`, {
      method: "PUT",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPayload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to update project", errorText);
      throw new Error("Failed to update project");
    }

    const updatedProject = await res.json();
    setProjects((prev) =>
      prev.map((project) => (project.id === id ? updatedProject : project))
    );
  };

  return {
    projects,
    loading,
    addProject,
    removeProject,
    updateProject,
  };
};
