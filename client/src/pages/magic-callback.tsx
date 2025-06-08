import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import magic from "../lib/magic";
import { Loader2 } from "lucide-react";

export default function MagicCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function finishLogin() {
      try {
        const search = new URLSearchParams(window.location.search);
        const credential = search.get("magic_credential");

        if (credential) {
          await magic.auth.loginWithCredential(); // consume token
          console.log("User session created");
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("Login error", err);
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
