import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Task, Project } from "@/types/models";
import { format } from "date-fns";
import { TaskActions } from "./TaskActions";

export default function TaskList({
  project,
  tasks,
}: {
  project: Project;
  tasks: Task[];
}) {
  if (!project) {
    return <div className="p-4">No project selected</div>;
  }
  if (!tasks || tasks.length === 0) {
    return (
      <div className="border rounded p-4 text-center text-muted-foreground">
        Project <strong>{project.title}</strong> has no tasks.
      </div>
    );
  }
  return (
    <div className="rounded-md border mb-8">
      <h2 className="text-lg font-medium p-4 border-b">{project.title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-20 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: Task) => (
            <TableRow key={task.id}>
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
