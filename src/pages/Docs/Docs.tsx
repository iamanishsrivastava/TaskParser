import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Docs() {
  return (
    <section
      id="docs"
      className="py-24 min-h-screen bg-gradient-to-tr from-yellow-50 via-purple-50 to-blue-50 px-4 sm:px-6"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-pink-900 mb-6">
          TaskParser Docs
        </h1>

        <p className="text-gray-700 text-sm sm:text-base mb-8">
          This section is under construction — check the GitHub repo for the
          latest updates on parser internals, optimizations, and contributions.
        </p>

        <Card className="bg-white/90 border border-pink-200 shadow-md">
          <CardHeader className="text-lg sm:text-xl font-semibold text-purple-800">
            Contribution Info
          </CardHeader>
          <CardContent className="text-sm text-gray-800 space-y-4 px-4 pb-6">
            <p>
              Fork the repo, raise issues, or contribute to the parser logic
              directly. Documentation here will grow with the project.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
              <a
                href="https://github.com/iamanishsrivastava/taskparser"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="flex gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </Button>
              </a>
              <Link to="/">
                <Button variant="outline" className="flex gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
