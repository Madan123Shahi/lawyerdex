// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scale, Eye, EyeOff } from "lucide-react";
import { loginSchema } from "../../../shared/schemas/authValidators";
import { authAPI } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";
import { Alert } from "../components/common";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const res = await authAPI.login(data);

      // token is gone — cookie is set by the backend automatically
      setAuth({ user: res.data.user });

      // Redirect back to where they were trying to go, or home
      const from = location.state?.from?.pathname ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.normalized?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-primary-700">
              Lawyer<span className="text-gold">Dex</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-800 mt-6 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to your LawyerDex account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {apiError && (
            <Alert type="error" message={apiError} className="mb-5" />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`input-field ${errors.email ? "border-red-400" : ""}`}
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className={`input-field pr-10 ${errors.password ? "border-red-400" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
