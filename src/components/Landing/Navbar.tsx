"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Github,
  PlayCircle,
  Sparkles,
  Workflow,
  BookText,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Live Demo",
      href: "#demo",
      icon: PlayCircle,
      color: "hover:text-blue-600",
    },
    {
      name: "Features",
      href: "#features",
      icon: Sparkles,
      color: "hover:text-purple-600",
    },
    {
      name: "How It Works",
      href: "#under-the-hood",
      icon: Workflow,
      color: "hover:text-green-600",
    },
    {
      name: "Docs",
      href: "/docs",
      icon: BookText,
      color: "hover:text-orange-600",
    },
  ];

  return (
    <motion.nav
      className={`sticky top-0 z-50 w-full transition-all border-b backdrop-blur bg-white/70 ${
        scrolled ? "shadow-sm" : ""
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-foreground">
          TaskParser
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center text-sm text-muted-foreground">
          {navItems.map(({ name, href, icon: Icon, color }) => (
            <a
              key={name}
              href={href}
              className={`flex items-center gap-2 ${color}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-4 h-4" /> {name}
            </a>
          ))}
          <a
            href="https://github.com/iamanishsrivastava/taskparser"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black flex items-center gap-1"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/login">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3 text-sm text-muted-foreground"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map(({ name, href, icon: Icon, color }) => (
              <a
                key={name}
                href={href}
                className={`flex items-center gap-2 ${color}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-4 h-4" /> {name}
              </a>
            ))}
            <a
              href="https://github.com/iamanishsrivastava/taskparser"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-black"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2" size="sm">
                Get Started
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
