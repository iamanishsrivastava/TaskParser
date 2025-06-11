import { AuthProvider } from "./AuthProvider";
import { ProjectsProvider } from "./ProjectsProvider";
import { TasksProvider } from "./TasksProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <TasksProvider>{children}</TasksProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
};
