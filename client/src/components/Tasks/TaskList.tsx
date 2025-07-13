import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Trash2 } from "lucide-react";
import type { Project } from "@/types/models";
import { format, setMinutes, setHours } from "date-fns";
import { useTasks } from "@/context/TasksProvider";
import { useEffect } from "react";
import { EditableText } from "../EditableText";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
// import type { Task } from "@/types/models";

export default function TaskList({ project }: { project: Project }) {
  const {
    tasks,
    removeTask,
    updateTaskTitle,
    updateTaskDueDate,
    updateTaskLabel,
    updateTaskPriority,
    updateTaskStatus,
  } = useTasks();
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
            <TableHead className="w-70 border-x">Title</TableHead>
            <TableHead className="w-32 border-r">Label</TableHead>
            <TableHead className="w-30 border-r">Status</TableHead>
            <TableHead className="w-30 border-r">Priority</TableHead>
            <TableHead className="w-30 border-r">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="w-8 text-center border-r">
                <Checkbox
                  checked={selectedIds.includes(task.id)}
                  onCheckedChange={() => toggleSelection(task.id)}
                />
              </TableCell>

              <TableCell className="font-medium w-70 gap-2 border-r">
                <EditableText
                  value={task.title}
                  onSave={(val) => updateTaskTitle(task.id, val)}
                />
              </TableCell>
              <TableCell className="w-32 border-r">
                <EditableText
                  value={task.task_label || "Not Specified"}
                  onSave={(val) => updateTaskLabel(task.id, val)}
                />
              </TableCell>

              <TableCell className="border-r">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-center w-full">
                      {task.task_status === "todo" && "To Do"}
                      {task.task_status === "in-progress" && "In Progress"}
                      {task.task_status === "done" && "Done"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="text-center w-full">
                    <DropdownMenuItem
                      onClick={() => updateTaskStatus(task.id, "todo")}
                    >
                      To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTaskStatus(task.id, "in-progress")}
                    >
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTaskStatus(task.id, "done")}
                    >
                      Done
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="border-r">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        task.task_priority === "urgent"
                          ? "destructive"
                          : "ghost"
                      }
                      className="text-center w-full"
                    >
                      {task.task_priority === "low" && "Low"}
                      {task.task_priority === "medium" && "Medium"}
                      {task.task_priority === "high" && "High"}
                      {task.task_priority === "urgent" && "Urgent"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="text-center w-full">
                    <DropdownMenuItem
                      onClick={() => updateTaskPriority(task.id, "low")}
                    >
                      Low
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTaskPriority(task.id, "medium")}
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTaskPriority(task.id, "high")}
                    >
                      High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTaskPriority(task.id, "urgent")}
                    >
                      Urgent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              {/* // "low" | "medium" | "high" | "urgent"; */}
              <TableCell className="w-32 border-r">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-2"
                    >
                      {task.due_date
                        ? format(new Date(task.due_date), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        task.due_date ? new Date(task.due_date) : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const fixed = setMinutes(setHours(date, 12), 0);
                          updateTaskDueDate(task.id, fixed.toISOString());
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
