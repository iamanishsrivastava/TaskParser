import { useState } from "react";

export default function ProjectNameInline({
  name,
  projectId,
  updateProject,
}: {
  name: string;
  projectId: string;
  updateProject: (id: string, newName: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleBlur = async () => {
    setEditing(false);
    if (value.trim() && value !== name) {
      await updateProject(projectId, value.trim());
    }
  };

  return editing ? (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBlur();
        if (e.key === "Escape") {
          setValue(name);
          setEditing(false);
        }
      }}
      className="bg-transparent w-35 border-b border-gray-300 focus:outline-none"
    />
  ) : (
    <h2
      className="cursor-pointer w-35 truncate whitespace-nowrap overflow-hidden text-ellipsis"
      onDoubleClick={() => setEditing(true)}
    >
      {name}
    </h2>
  );
}
