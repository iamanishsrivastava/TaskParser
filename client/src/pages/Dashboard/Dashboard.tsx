import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import magic from "@/lib/magic";
import { Button } from "@/components/ui/button";
import TaskList from "@/components/Tasks/TaskList";
import { useProjects } from "@/context/ProjectsProvider";
import type { Project } from "@/types/models";
import { Loader2 } from "lucide-react";
import CreateProjectButton from "@/components/Projects/CreateProjectButton";
import ProjectNameInline from "@/components/Projects/ProjectNameInline";
import { DeleteAllProjectsButton } from "@/components/Projects/DeleteAllProjectsButton";
import { DeleteProjectInline } from "@/components/Projects/DeleteProjectInline";
import { Card } from "@/components/ui/card";
import AddTaskInput from "@/components/Tasks/AddTaskInput";
import { useTasks } from "@/context/TasksProvider";

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, loading, updateProject } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const handleLogout = async () => {
    await magic.user.logout();

    await fetch("/api/logout", { method: "POST", credentials: "include" });

    navigate("/login");
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  useEffect(() => {
    if (!activeProjectId && projects.length > 0) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  const { error } = useTasks();

  // console.log("Projects loaded in dashboard:", projects);
  // console.log("Tasks in Dashboard:", tasks);
  // console.log("Filtered Tasks:", tasksForProject);
  // console.log("Project ID:", activeProject?.id);
  // console.log("Task projectIds:", tasks.map((t) => t.projectId));
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-4">
        <p className="text-lg font-medium text-red-600">
          Failed to load tasks.{" "}
          {typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : typeof error === "string"
            ? error
            : "Please login again."}
        </p>
        <Button
          variant="outline"
          onClick={async () => {
            await magic.user.logout();
            await fetch("/api/logout", {
              method: "POST",
              credentials: "include",
            });
            navigate("/login");
          }}
        >
          Logout & Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4 flex flex-col justify-between overflow-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {[...projects]
            // .sort(
            //   (a, b) =>
            //     new Date(a.createdAt).getTime() -
            //     new Date(b.createdAt).getTime()
            // )
            .map((project: Project) => (
              <div
                key={project.id}
                className={`mb-1 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 ${
                  activeProjectId === project.id
                    ? "bg-gray-300 font-semibold"
                    : ""
                }`}
                onClick={() => setActiveProjectId(project.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <ProjectNameInline
                      name={project.title}
                      project_id={project.id}
                      updateProject={updateProject}
                    />
                  </div>
                  <DeleteProjectInline
                    project_name={project.title}
                    project_id={project.id}
                  />
                </div>
              </div>
            ))}
        </div>
        {projects.length === 0 ? null : (
          <div className="flex flex-col mt-4 space-y-2">
            <CreateProjectButton setActiveProjectId={setActiveProjectId} />
            <DeleteAllProjectsButton />
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center p-4 border-b">
          <h1 className="text-lg font-medium">Dashboard</h1>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </header>
        {/* Main Content */}
        <main className="p-6 overflow-auto">
          {projects.length === 0 ? (
            <div className="flex items-center justify-center h-150">
              <Card className="w-[400px] p-6 text-center space-y-4">
                <h2 className="text-lg font-semibold">No projects yet</h2>
                <CreateProjectButton setActiveProjectId={setActiveProjectId} />
              </Card>
            </div>
          ) : activeProject ? (
            <>
              <AddTaskInput project_id={activeProject.id} />
              <TaskList project={activeProject} />
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Select a project to view tasks
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
