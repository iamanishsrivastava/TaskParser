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
import { Input } from "@/components/ui/input";
import { Loader2, Pencil } from "lucide-react";
import { useTasks } from "@/context/TasksProvider";

export function ModifyTaskButton({
  task,
  open,
  setOpen,
}: {
  task: { id: string; title: string };
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [value, setValue] = useState(task.title);
  const [loading, setLoading] = useState(false);
  const { updateTask } = useTasks();

  const handleUpdate = async () => {
    if (!value.trim() || value === task.title) return;
    setLoading(true);
    try {
      updateTask(task.id, { title: value.trim() });
      setOpen(false);
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Task</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading || !value.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
