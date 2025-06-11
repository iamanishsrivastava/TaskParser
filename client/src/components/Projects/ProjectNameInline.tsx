import { useState } from "react";

export default function ProjectNameInline({
  name,
  project_id,
  updateProject,
}: {
  name: string;
  project_id: string;
  updateProject: (id: string, newName: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleBlur = async () => {
    setEditing(false);
    if (value.trim() && value !== name) {
      await updateProject(project_id, value.trim());
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
