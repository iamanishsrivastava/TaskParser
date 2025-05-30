import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Code2, Server } from "lucide-react";

const sections = [
  {
    icon: <Brain className="w-5 h-5 mr-2 text-purple-600" />,
    title: "Logic Layer",
    color: "bg-purple-50",
    cards: [
      {
        title: "Parsing",
        desc: "Regex-based, client-side logic. Moving to serverless with NLP enhancements soon.",
      },
      {
        title: "State & Persistence",
        desc: "Uses React hooks and localStorage. DB and sync-ready for later scale.",
      },
    ],
  },
  {
    icon: <Code2 className="w-5 h-5 mr-2 text-blue-600" />,
    title: "Platform Layer",
    color: "bg-blue-50",
    cards: [
      {
        title: "Frontend",
        desc: "React + TypeScript + Tailwind. Clean UI with ShadCN and Framer Motion.",
      },
      {
        title: "DevOps & CI/CD",
        desc: "GitHub Actions + Vercel. Zero infra maintenance, all deploy previews in place.",
      },
    ],
  },
  {
    icon: <Server className="w-5 h-5 mr-2 text-green-600" />,
    title: "Infrastructure",
    color: "bg-green-50",
    cards: [
      {
        title: "Auth & Security",
        desc: "Magic Link auth using Clerk. No token juggling. Backend auth expansion planned.",
      },
      {
        title: "Monitoring",
        desc: "To be integrated: Sentry (FE), Grafana/Prometheus (API logs).",
      },
      {
        title: "Testing",
        desc: "Manual for now. Planning unit tests using Jest, and possibly Playwright for E2E down the line.",
      },
    ],
  },
];

export default function UnderTheHood() {
  return (
    <section
      id="under-the-hood"
      className="pt-24 min-h-screen bg-gradient-to-bl from-green-100 via-purple-50 to-yellow-100 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-purple-900">
          Let me walk you through how TaskParser is built.
        </h2>
        <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          A dev-first playground that scales with you. Each layer has its
          job—clean, modular, and flexible.
        </p>

        {sections.map((section, i) => (
          <Card
            key={i}
            className={`mb-10 shadow-md border border-pink-200 ${section.color}`}
          >
            <CardHeader className="flex items-center gap-2 text-lg font-semibold text-purple-800">
              {section.icon}
              {section.title}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-6 justify-center">
              {section.cards.map((card, j) => (
                <Card
                  key={j}
                  className="w-70 gap-2 shadow-sm border border-gray-200"
                >
                  <CardHeader>
                    <CardTitle className="text-base text-purple-700">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700">
                    {card.desc}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="text-center mt-16 max-w-2xl mx-auto text-purple-900">
          <p className="text-lg font-semibold mb-3">
            TaskParser isn’t bloated. Just smart, fast, and flexible.
          </p>
          <p className="text-sm mb-6">
            We're keeping it local-first until scale demands more — but the
            system is future-proof for serverless, RSC, and edge pipelines.
          </p>
        </div>
      </div>
    </section>
  );
}
