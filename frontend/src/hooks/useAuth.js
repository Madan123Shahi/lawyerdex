// frontend/src/hooks/useAuth.js  ← new file, all auth mutations in one place
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const authKeys = {
  me: ["auth", "me"],
};

// ─── useMe — fetch current user (runs on app load if authenticated) ───────────
export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: authKeys.me,
    queryFn: authAPI.getMe,
    enabled: isAuthenticated, // only runs if Zustand says we're logged in
    retry: false, // don't retry on 401 — interceptor handles refresh
    staleTime: 5 * 60 * 1000, // treat user data as fresh for 5 min
  });
};

// ─── useLogin ─────────────────────────────────────────────────────────────────
export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth({ user: data.data.user });
      queryClient.setQueryData(authKeys.me, data); // seed cache so useMe doesn't refetch
      navigate("/");
    },
  });
};

// ─── useRegister ──────────────────────────────────────────────────────────────
export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      setAuth({ user: data.data.user });
      navigate("/");
    },
  });
};

// ─── useLogout ────────────────────────────────────────────────────────────────
export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.logout,
    onSettled: () => {
      // Clear everything regardless of API success/fail
      logout();
      queryClient.clear();
      navigate("/login");
    },
  });
};

// ─── useChangePassword ────────────────────────────────────────────────────────
export const useChangePassword = () =>
  useMutation({
    mutationFn: authAPI.changePassword,
    // No cache invalidation needed — password change doesn't affect cached data
    // The backend rotates the token via cookie automatically
  });
