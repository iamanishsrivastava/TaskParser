import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useProjects } from "@/context/ProjectsProvider";

export function DeleteProjectInline({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const { removeProject } = useProjects();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    removeProject(projectId);
    setOpen(false);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you certain you want to delete "{projectName}"?
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            This will permanently delete this project. Type{" "}
            <strong className="text-red-500">{projectName}</strong> to confirm.
          </p>
        </DialogHeader>
        <input
          className="border p-2 w-full mt-4"
          placeholder="Type to confirm..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={
              input.trim().toLowerCase() !== (projectName?.toLowerCase() ?? "")
            }
            onClick={handleDelete}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
