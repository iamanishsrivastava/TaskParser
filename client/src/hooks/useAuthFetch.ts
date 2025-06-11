import { useAuth } from "../context/AuthProvider";
import magic from "@/lib/magic";

export const useAuthFetch = () => {
  const { loading } = useAuth();

  const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
    const didToken = await magic.user.getIdToken();
    if (!didToken) {
      throw new Error("User is not authenticated");
    }
    return fetch(input, {
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
