"use client";
import magic from "@/lib/magic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldAlert } from "lucide-react";

import Features from "@/components/Landing/Features";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(1, { message: "Email is required." }),
});

export default function Login() {
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    magic.user.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        navigate("/dashboard");
      } else {
        setAuthChecking(false);
      }
    });
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cleanEmail = values.email.trim();
    setLoading(true);
    try {
      await magic.auth.loginWithMagicLink({
        email: cleanEmail,
        redirectURI: `${window.location.origin}/magic-callback`,
      });
      console.log("Location", window.location.origin);
      setMessage("Magic link sent! Check your email.");
    } catch (err) {
      console.error("Magic login error:", err);
      setMessage("Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  }

  if (authChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking login...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Left Feature Showcase */}
      <div className="hidden md:block overflow-y-auto">
        <Features />
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-tr from-green-100 via-pink-50 to-blue-100">
        <div className="w-full max-w-md">
          {/* Warning */}
          <div className="flex items-center gap-2 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm p-3 rounded">
            <ShieldAlert className="w-4 h-4" />
            <span>
              This is a prototype. No database or encryption — use throwaway
              email if unsure.
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Me a Magic Link"
                )}
              </Button>
              {message && (
                <p className="text-sm text-center text-muted-foreground mt-2">
                  {message}
                </p>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
