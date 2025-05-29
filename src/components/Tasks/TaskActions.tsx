import { useState } from "react";
import { ModifyTaskButton } from "./ModifyTaskButton";
import { DeleteTaskButton } from "./DeleteTaskButton";

export function TaskActions({ task }: { task: { id: string; title: string } }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <ModifyTaskButton task={task} open={editOpen} setOpen={setEditOpen} />
      <DeleteTaskButton
        taskId={task.id}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </div>
  );
}
