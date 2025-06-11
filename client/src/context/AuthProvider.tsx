import { createContext, useContext, useEffect, useState } from "react";
import magic from "@/lib/magic";

type AuthContextType = {
  token: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    magic.user
      .getIdToken()
      .then((t) => setToken(t))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
