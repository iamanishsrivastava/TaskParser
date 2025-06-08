import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useTasks } from "@/context/TasksProvider";

export function DeleteTaskButton({
  taskId,
  open,
  setOpen,
}: {
  taskId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { removeTask } = useTasks();

  const handleDelete = async () => {
    setLoading(true);
    try {
      removeTask(taskId);
      setOpen(false);
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-red-500">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
