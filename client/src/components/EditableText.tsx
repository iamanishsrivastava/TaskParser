import { useState, useEffect, useRef } from "react";

export function EditableText({
  value,
  onSave,
  className = "",
}: {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) setTemp(value);
  }, [editing, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setEditing(false);
        setTemp(value);
      }
    };

    if (editing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing, value]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (temp.trim() !== value) onSave(temp.trim());
      setEditing(false);
    } else if (e.key === "Escape") {
      setEditing(false);
      setTemp(value);
    }
  };

  return editing ? (
    <input
      ref={inputRef}
      className={`w-full bg-transparent border-b outline-none ${className}`}
      value={temp}
      autoFocus
      onChange={(e) => setTemp(e.target.value)}
      onKeyDown={handleKey}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      className={`cursor-pointer hover:underline ${className}`}
    >
      {value}
    </span>
  );
}
