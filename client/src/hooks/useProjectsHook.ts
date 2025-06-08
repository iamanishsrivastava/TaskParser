import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import type { Project } from "@/types/models";

export const useProjectsHook = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem("projects");
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
    setLoading(false);
  }, [projects]);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const addProject = (title: string) => {
    const newProject: Project = {
      id: nanoid(),
      title: capitalize(title),
      createdAt: new Date().toISOString(),
      tasks: [],
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject.id;
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const updateProject = async (id: string, title: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, title: capitalize(title) } : project
      )
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
