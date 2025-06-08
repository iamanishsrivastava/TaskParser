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

export function DeleteAllProjectsButton() {
  const { projects, removeProject } = useProjects();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // controls dialog

  const handleDeleteAll = async () => {
    setLoading(true);
    for (const project of projects) {
      await removeProject(project.id);
    }
    setInput("");
    setLoading(false);
    setOpen(false); // closes dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete All Projects</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            This will permanently delete all projects. Type{" "}
            <strong className="text-red-500">Delete All Projects</strong> to
            confirm.
          </p>
        </DialogHeader>
        <input
          className="border p-2 w-full mt-4"
          placeholder="Type to confirm..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={input.trim().toLowerCase() !== "delete all projects"}
            onClick={handleDeleteAll}
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
