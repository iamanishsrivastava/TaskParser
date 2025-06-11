import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import magic from "../lib/magic";
import { Loader2 } from "lucide-react";

export default function MagicCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  console.log("Magic callback loaded");
  useEffect(() => {
    async function finishLogin() {
      try {
        await magic.auth.loginWithCredential();

        const didToken = await magic.user.getIdToken();
        await fetch("/api/session", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${didToken}`,
          },
          credentials: "include",
        });

                console.log("User session created");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Magic login error:", err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    finishLogin();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {loading ? "Verifying magic link..." : "Redirecting..."}
    </div>
  );
}
