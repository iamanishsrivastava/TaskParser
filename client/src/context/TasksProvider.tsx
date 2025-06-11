import { createContext, type ReactNode, useContext } from "react";
import { useTasksHook } from "@/hooks/useTasksHook";
import { Loader2 } from "lucide-react";

const TasksContext = createContext<ReturnType<typeof useTasksHook> | null>(
  null
);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const value = useTasksHook();

  return (
    <TasksContext.Provider value={value}>
      {value.loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </TasksContext.Provider>
  );
};

// Custom hook to use Tasks context
export const useTasks = () => {
  const context = useContext(TasksContext);
  // console.log(context);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
