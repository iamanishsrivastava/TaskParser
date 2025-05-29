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
import { Loader2 } from "lucide-react";

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
    console.log("Email", cleanEmail);
    setLoading(true);
    try {
      await magic.auth.loginWithMagicLink({
        email: cleanEmail,
        redirectURI: `${window.location.origin}/magic-callback`,
      });
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
    <div className="flex flex-col justify-center items-center h-screen">
      <Form {...form}>
        <form
          className="flex flex-col justify-center gap-3 w-100 h-100"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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

          <Button className="mt-4" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Me a Magic Link"
            )}
          </Button>
          {message}
        </form>
      </Form>
    </div>
  );
}
