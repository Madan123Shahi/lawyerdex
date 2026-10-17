import { createContext, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return (await api("/auth/me")).user;
      } catch (e) {
        if (e.status === 401) return null;
        throw e;
      }
    },
    staleTime: 5 * 60_000,
  });

  const value = useMemo(
    () => ({
      user: data ?? null,
      loading: isLoading,
      async login(email, password) {
        const { user } = await api("/auth/login", { method: "POST", body: { email, password } });
        qc.setQueryData(["me"], user);
        return user;
      },
      async register(payload) {
        const { user } = await api("/auth/register", { method: "POST", body: payload });
        qc.setQueryData(["me"], user);
        return user;
      },
      async logout() {
        await api("/auth/logout", { method: "POST" });
        qc.setQueryData(["me"], null);
        qc.removeQueries({ predicate: (q) => q.queryKey[0] !== "me" });
      },
    }),
    [data, isLoading, qc],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
