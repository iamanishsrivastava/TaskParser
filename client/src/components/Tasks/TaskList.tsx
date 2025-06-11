import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import type { Project } from "@/types/models";
import { format } from "date-fns";
import { TaskActions } from "./TaskActions";
import { useTasks } from "@/context/TasksProvider";
import { useEffect } from "react";

export default function TaskList({ project }: { project: Project }) {
  const { tasks, removeTask } = useTasks();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const projectTasks = tasks.filter(
    (task) => task.project_id === project.id || task.project_id === project.id
  );

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => removeTask(id)));
      clearSelection();
      setShowDialog(false);
    } catch (err) {
      console.error("Failed to delete selected tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("tasks updated in TaskList:", tasks);
  }, [tasks]);

  if (!project) {
    return <div className="p-4">No project selected</div>;
  }

  if (projectTasks.length === 0) {
    return (
      <div className="border rounded p-4 text-center text-muted-foreground">
        Project <strong>{project.title}</strong> has no tasks.
      </div>
    );
  }

  return (
    <div className="rounded-md border mb-8">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                selectedIds.length === projectTasks.length &&
                projectTasks.length > 0
              }
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedIds(projectTasks.map((task) => task.id));
                } else {
                  clearSelection();
                }
              }}
            />
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`text-red-600 hover:text-red-800 transition-opacity ${
                  selectedIds.length > 0
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </div>
          <h2 className="text-lg font-medium">{project.title}</h2>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Tasks</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{selectedIds.length}</strong> task
              {selectedIds.length > 1 && "s"}? This action cannot be undone.
            </p>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-20 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="w-8 text-center">
                <Checkbox
                  checked={selectedIds.includes(task.id)}
                  onCheckedChange={() => toggleSelection(task.id)}
                />
              </TableCell>
              <TableCell className="font-medium w-100">
                {task.title}
                <Badge variant="secondary" className="mx-4 bg-blue-100 text-xs">
                  {task.task_label}
                </Badge>
              </TableCell>
              <TableCell className="w-32">
                <Badge variant="outline">{task.task_status}</Badge>
              </TableCell>
              <TableCell className="w-32">
                <Badge
                  variant={
                    task.task_priority === "urgent"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {task.task_priority}
                </Badge>
              </TableCell>
              <TableCell className="w-32">
                {task.due_date
                  ? format(new Date(task.due_date), "PPP")
                  : "No due date"}
              </TableCell>
              <TableCell className="w-20 flex justify-end items-center">
                <TaskActions task={{ id: task.id, title: task.title }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
