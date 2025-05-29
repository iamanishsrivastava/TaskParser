import { createContext, type ReactNode, useContext } from "react";
import { useTasksHook } from "@/hooks/useTasksHook";

const TasksContext = createContext<ReturnType<typeof useTasksHook> | null>(
  null
);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const value = useTasksHook();
  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

// Custom hook to use Tasks context
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
