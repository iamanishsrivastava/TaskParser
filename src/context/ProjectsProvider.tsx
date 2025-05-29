// context/ProjectsProvider.tsx

import { createContext, useContext } from "react";
import { useProjectsHook } from "@/hooks/useProjectsHook";

const ProjectsContext = createContext<ReturnType<
  typeof useProjectsHook
> | null>(null);

export const ProjectsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useProjectsHook();
  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
