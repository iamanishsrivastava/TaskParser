import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import magic from "@/lib/magic";
import { Loader2 } from "lucide-react";

export default function PrivateRoute({ children }) {
  const [auth, setAuth] = useState<boolean | null>(null);

  console.log("PrivateRoute mounted");

  useEffect(() => {
    /**
     * Checks if the user is logged in using the Magic SDK.
     * Updates the auth state based on the login status.
     * Logs the authentication status to the console.
     */
    async function checkAuth() {
      const loggedIn = await magic.user.isLoggedIn();
      console.log("Private Route:", loggedIn);
      setAuth(loggedIn);
    }
    checkAuth();
  }, []);

  if (auth === null)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );

  return auth ? children : <Navigate to="/login" replace />;
}
