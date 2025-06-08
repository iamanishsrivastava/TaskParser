import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TerminalSquare,
  BotMessageSquare,
  Loader,
  AlertTriangle,
  Frown,
  MousePointer,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const problems = [
  {
    icon: FileText,
    title: "Manual Data Entry",
    desc: "Manually splitting every task kills your flow.",
    bg: "from-pink-50 to-red-100",
    fg: "text-red-600",
  },
  {
    icon: TerminalSquare,
    title: "Rigid Forms",
    desc: "Dropdowns for everything? Not smart input.",
    bg: "from-blue-50 to-sky-100",
    fg: "text-blue-600",
  },
  {
    icon: BotMessageSquare,
    title: "Poor Language Support",
    desc: "Natural phrases should just work. Here they don’t.",
    bg: "from-yellow-50 to-orange-100",
    fg: "text-yellow-700",
  },
  {
    icon: Loader,
    title: "Overloaded UIs",
    desc: "Tabs, filters, views—productivity gets lost.",
    bg: "from-gray-100 to-gray-300",
    fg: "text-gray-700",
  },
  {
    icon: AlertTriangle,
    title: "No Smart Parsing",
    desc: "Other apps don’t understand your intent.",
    bg: "from-red-50 to-rose-100",
    fg: "text-rose-600",
  },
  {
    icon: Frown,
    title: "Kills Flow",
    desc: "Breaking your thinking into form fields is jarring.",
    bg: "from-purple-50 to-violet-100",
    fg: "text-purple-600",
  },
  {
    icon: MousePointer,
    title: "No Instant Capture",
    desc: "You can’t just type or speak your thought and be done.",
    bg: "from-green-50 to-emerald-100",
    fg: "text-emerald-600",
  },
];

export default function FloatingProblemBanner() {
  const [hovered, setHovered] = useState<number | null>(null);
  const current = hovered !== null ? problems[hovered] : null;

  const floatingPositions = Array.from({ length: 7 }, (_, i) => {
    const angle = (i / 7) * 2 * Math.PI;
    const radius = 35;
    const centerX = 45;
    const centerY = 45;

    const left = centerX + radius * Math.cos(angle);
    const top = centerY + radius * Math.sin(angle);

    return {
      top: `${top}%`,
      left: `${left}%`,
    };
  });

  return (
    <section
      className={`relative min-h-[40vh] flex flex-col justify-center items-center overflow-hidden text-center px-6
        bg-gradient-to-br ${
          current?.bg ?? "from-blue-50 via-purple-50 to-pink-100"
        } transition-all duration-700 ease-in-out`}
    >
      {/* Floating Titles */}
      {problems.map((p, i) => (
        <motion.div
          key={p.title}
          className={`absolute text-sm sm:text-md md:text-xl font-semibold opacity-50 hover:opacity-100 transition cursor-pointer ${
            i === hovered ? "text-black" : "text-black/20"
          }`}
          style={{
            top: floatingPositions[i].top,
            left: floatingPositions[i].left,
            zIndex: 1,
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          animate={{
            y: [0, -5 + i * 2, 5 - i * 2, 0],
            x: [0, 3 - i, -3 + i, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: i - 2,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        >
          {p.title}
        </motion.div>
      ))}

      {/* Foreground */}
      <div className="z-20 max-w-2xl relative transition-all duration-500">
        <h2 className="text-3xl sm:text-3xl font-bold mb-4">
          To simplify noting tasks, I built TaskParser.
        </h2>

        <div className="flex justify-center gap-4 mt-4">
          <Link to="/login">
            <Button size="lg">Try it now</Button>
          </Link>
          <Link to="#demo">
            <Button variant="outline" size="lg">
              View Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <motion.p
          key={current?.title ?? "default"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`mt-8 text-lg min-h-[48px] transition-colors duration-500 ${
            current?.fg ?? "text-muted-foreground"
          }`}
        >
          {current?.desc ??
            "Hover over the floating words to see what problems TaskParser solves."}
        </motion.p>
      </div>
    </section>
  );
}
