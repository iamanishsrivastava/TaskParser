import { motion } from "framer-motion";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Phone, Video, MoreVertical, Send } from "lucide-react";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const messages = [
  {
    user: "Anish",
    role: "Maker of Chaos",
    align: "left",
    color: "green",
    content:
      "Okay so TaskParser is basically one text field. No dropdowns. You just type like 'Submit report by Friday 5pm, high priority'.",
  },
  {
    user: "Abhishek",
    role: "Pixel Police",
    align: "right",
    color: "blue",
    content:
      "UI is pretty slick bhai. Light colors are giving clarity. Maybe show parse results while typing?",
  },
  {
    user: "Sandeep",
    role: "Parser Sidekick",
    align: "right",
    color: "yellow",
    content:
      "Parser is working decently... but it doesn't catch 'Friday 5pm' as dueDate in that example.",
  },
  {
    user: "Anish",
    role: "Maker of Chaos",
    align: "left",
    color: "green",
    content:
      "Haan I noticed. It's missing some common date formats. Will need to add better regex + fallback logic.",
  },
  {
    user: "Anish",
    role: "Maker of Chaos",
    align: "left",
    color: "green",
    content:
      "Right now, it extracts title, due date (if it can), and priority. That's it. Simple and local.",
  },
  {
    user: "Abhishek",
    role: "Pixel Police",
    align: "right",
    color: "blue",
    content: "Still neat. Framer Motion animations make it feel responsive.",
  },
  {
    user: "Sandeep",
    role: "Parser Sidekick",
    align: "right",
    color: "yellow",
    content:
      "Yeah. Once it handles things like 'next Thursday 4pm', it'll feel pro.",
  },
  {
    user: "Anish",
    role: "Maker of Chaos",
    align: "left",
    color: "green",
    content:
      "That's the plan. Will iterate on rules soon and clean up parsing edge cases.",
  },
  {
    user: "Abhishek",
    role: "Pixel Police",
    align: "right",
    color: "blue",
    content:
      "This is already fun. Let me know if you want help with empty state UX or error prompts.",
  },
  {
    user: "Sandeep",
    role: "Parser Sidekick",
    align: "right",
    color: "yellow",
    content: "Even I'd love to pitch in. Got time on weekends.",
  },
  {
    user: "Anish",
    role: "Maker of Chaos",
    align: "left",
    color: "green",
    content: "Awesome.",
  },
];

export default function Features() {
  const [showHint, setShowHint] = useState(true);

  return (
    <section
      id="features"
      className="flex items-center justify-center py-16 min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 px-4 sm:px-6 md:px-8"
    >
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-8 text-pink-900">
          Features, as they discussed it.
        </h2>

        <Card className="relative h-[600px] flex flex-col bg-white/90 border border-pink-200 shadow-xl rounded-xl">
          <CardHeader className="flex h-16 justify-between items-center border-b border-pink-100 px-4">
            <div>
              <div className="text-pink-900 font-semibold text-base sm:text-lg">
                TaskParser Chat
              </div>
              <div className="text-xs text-pink-600 italic">
                #features-discussion
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-pink-700 text-xs sm:text-sm font-medium px-2 py-0.5 rounded bg-pink-100">
                Group Chat
              </span>
              <Video className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-pink-800" />
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-pink-800" />
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-pink-800" />
            </div>
          </CardHeader>

          <div className="flex-1 overflow-auto px-4 py-2 scrollbar-hide">
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "max-w-[80%] px-4 py-3 rounded-xl text-sm shadow break-words",
                    msg.color === "blue"
                      ? "bg-gradient-to-br from-blue-50 to-sky-100 text-blue-600 self-start rounded-bl-none"
                      : msg.color === "yellow"
                      ? "bg-gradient-to-br from-yellow-50 to-orange-100 text-yellow-700 self-start rounded-bl-none"
                      : "bg-gradient-to-br from-green-50 to-emerald-100 text-emerald-600 self-end rounded-br-none"
                  )}
                >
                  <div className="font-semibold text-xs mb-1 opacity-70">
                    {msg.user} —{" "}
                    <span className="italic text-muted-foreground">
                      {msg.role}
                    </span>
                  </div>
                  <div>{msg.content}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <CardFooter className="border-t border-pink-100 px-4 flex items-center gap-3">
            <Input
              value="Before that, let me show you how this whole thing's structured under the hood..."
              readOnly
              className="text-sm text-pink-900 bg-white border-pink-200"
            />
            <TooltipProvider>
              <Tooltip open={showHint}>
                <TooltipTrigger asChild>
                  <Send
                    className="text-pink-400 w-5 h-5 cursor-pointer hover:text-pink-600"
                    onClick={() => {
                      const target = document.getElementById("under-the-hood");
                      if (target) target.scrollIntoView({ behavior: "smooth" });
                      setShowHint(false);
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  className="bg-pink-100 text-pink-800 text-xs font-medium shadow rounded px-3 py-1 animate-pulse"
                >
                  Peek under the hood
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
