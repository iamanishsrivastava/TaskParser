import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParserShowcase from "@/components/Landing/ParserShowcase";
import Navbar from "@/components/Landing/Navbar";
import FloatingProblemBanner from "@/components/Landing/FloatingProblemBanner";
import Features from "@/components/Landing/Features";
import UnderTheHood from "@/components/Landing/UnderTheHood";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, ease: "easeOut" },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <FloatingProblemBanner />

      <ParserShowcase />

      <Features />

      <UnderTheHood />

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-yellow-100 via-purple-50 to-blue-100 px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={5}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold mb-4">Start parsing like a pro</h2>
        <p className="text-muted-foreground mb-6">
          Turn unstructured input into productivity.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button size="lg">Get Started</Button>
            </motion.div>
          </Link>
          <motion.a
            href="https://github.com/iamanishsrivastava/taskparser"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button variant="outline" size="lg" className="flex items-center">
              <Github className="mr-2 h-4 w-4" /> Star on GitHub
            </Button>
          </motion.a>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="w-full transition-all backdrop-blur bg-gradient-to-bl from-blue-100 via-purple-50 to-pink-100 px-6 text-center py-2 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/iamanishsrivastava/taskparser"
            className="underline"
          >
            GitHub Repo
          </a>{" "}
          • Built by{" "}
          <a href="https://linkedin.com/in/iamanishsrivastava" target="_blank">
            Anish Srivastava
          </a>
        </p>
      </motion.footer>
    </div>
  );
}
