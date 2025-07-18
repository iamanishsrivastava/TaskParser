import { useAuth } from "../context/AuthProvider";
import magic from "@/lib/magic";

const API_BASE =
  typeof window !== "undefined" && process.env.NODE_ENV === "production"
    ? "https://taskparser.onrender.com"
    : "";

export const useAuthFetch = () => {
  const { loading } = useAuth();

  const authFetch = async (
    input: RequestInfo | URL,
    init: RequestInit = {}
  ): Promise<Response> => {
    const didToken = await magic.user.getIdToken();
    if (!didToken) {
      throw new Error("User is not authenticated");
    }

    // Handle relative URLs
    const url =
      typeof input === "string" && input.startsWith("/")
        ? `${API_BASE}${input}`
        : input;

    return fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${didToken}`,
        ...(init.headers || {}),
      },
      credentials: "include",
    });
  };

  return { authFetch, loading };
};
