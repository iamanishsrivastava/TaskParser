import { ProjectsProvider } from "./ProjectsProvider";
import { TasksProvider } from "./TasksProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProjectsProvider>
      <TasksProvider>{children}</TasksProvider>
    </ProjectsProvider>
  );
};
