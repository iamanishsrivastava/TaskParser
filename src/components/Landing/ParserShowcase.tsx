import { useEffect, useState } from "react";
import { parseTask } from "@/services/parser/parseTask";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, FastForward, SkipForward } from "lucide-react";

const examples = [
  "Submit report by Friday 5pm, high priority",
  "Book venue tomorrow evening",
  "Prepare slides next week, medium priority",
];

type Parsed = ReturnType<typeof parseTask>;

export default function ParserDemoAuto() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [tasks, setTasks] = useState<Parsed[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index >= examples.length) return;

    const current = examples[index];
    let char = 0;
    setTyped("");

    const interval = setInterval(() => {
      if (char < current.length) {
        const nextChar = current.charAt(char);
        setTyped((prev) => prev + nextChar);
        char++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const parsed = parseTask(current);
          setTasks((prev) => [...prev, parsed]);
          setIndex((prev) => prev + 1);
        }, 600);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <section
      id="demo"
      className="min-h-screen py-16 bg-gradient-to-bl from-pink-100 via-purple-50 to-blue-100 px-4 sm:px-6 md:px-8"
    >
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-3 text-pink-900">
          Type Tasks Like a Human, Parsed by AI
        </h1>
        <p className="text-pink-700 max-w-2xl mx-auto">
          Watch how TaskParser transforms natural language into structured tasks
          seamlessly.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center space-y-10">
        {/* Typed Input */}
        <Card className="w-full max-w-2xl p-6 shadow-lg border border-pink-200 bg-white/90">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-pink-900">
              Auto-Typing Input
            </h2>
            <div className="flex gap-3 items-center">
              {/* Skip */}
              <button
                onClick={() => {
                  if (index < examples.length) {
                    const parsed = parseTask(examples[index]);
                    setTyped(examples[index]);
                    setTasks((prev) => [...prev, parsed]);
                    setIndex((prev) => prev + 1);
                  }
                }}
                disabled={index >= examples.length}
                className={`text-pink-600 hover:text-pink-800 transition ${
                  index >= examples.length
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                title="Skip Current"
              >
                <FastForward className="w-5 h-5" />
              </button>

              {/* Complete All */}
              <button
                onClick={() => {
                  const remaining = examples.slice(index);
                  const parsedAll = remaining.map((e) => parseTask(e));
                  setTyped(remaining[remaining.length - 1] || "");
                  setTasks((prev) => [...prev, ...parsedAll]);
                  setIndex(examples.length);
                }}
                disabled={index >= examples.length}
                className={`text-pink-600 hover:text-pink-800 transition ${
                  index >= examples.length
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                title="Finish All"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Restart */}
              <button
                onClick={() => {
                  setTyped("");
                  setTasks([]);
                  setIndex(0);
                }}
                className="text-pink-600 hover:text-pink-800 transition"
                title="Restart Demo"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          <Input
            value={typed}
            readOnly
            className="text-lg font-mono bg-purple-50 text-pink-900"
          />
        </Card>

        {/* Parsed Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl">
          {tasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex flex-col space-y-4"
            >
              <Card className="p-4 border border-pink-300 shadow-sm bg-white">
                <h3 className="text-lg font-semibold text-pink-700 truncate">
                  {task.title || "—"}
                </h3>
                <div className="flex flex-col gap-1 mt-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Due Date:{" "}
                    </span>
                    {task.dueDate ? (
                      <Badge variant="secondary">
                        {new Date(task.dueDate).toLocaleString()}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Priority:{" "}
                    </span>
                    {task.priority ? (
                      <Badge
                        variant={
                          task.priority === "high" ? "destructive" : "secondary"
                        }
                        className={
                          task.priority === "medium"
                            ? "bg-yellow-200 text-yellow-800"
                            : task.priority === "low"
                            ? "bg-green-200 text-green-800"
                            : ""
                        }
                      >
                        {task.priority}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">Not detected</span>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-2 bg-white/90 border border-pink-200 shadow-md rounded text-left font-mono text-sm text-pink-900 w-full overflow-x-auto">
                <div className="flex justify-between items-center p-2 border-b border-pink-100">
                  <span className="font-semibold">Parsed Output</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(task, null, 2)
                      );
                      setCopiedIndex(i);
                      setTimeout(() => setCopiedIndex(null), 1500);
                    }}
                    className="text-pink-600 hover:text-pink-800 transition"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="px-2 py-1 whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify(task, null, 2)}
                </pre>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
