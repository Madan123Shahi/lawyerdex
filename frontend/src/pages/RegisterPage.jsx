import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scale, Eye, EyeOff, CheckCircle } from "lucide-react";
import { registerSchema } from "../../../shared/schemas/authValidators";
import { authAPI } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";
import { Alert } from "../components/common";

const passwordRules = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const res = await authAPI.register(data);
      setAuth({ user: res.data.user, token: res.token });
      navigate("/");
    } catch (err) {
      setApiError(
        err.normalized?.message || "Registration failed. Please try again.",
      );
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
            Create your account
          </h1>
          <p className="text-gray-500 text-sm">
            Join thousands finding the right legal help
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
                Full Name
              </label>
              <input
                {...register("name")}
                placeholder="John Doe"
                className={`input-field ${errors.name ? "border-red-400" : ""}`}
              />
              {errors.name && (
                <p className="error-text">{errors.name.message}</p>
              )}
            </div>

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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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

              {/* Password strength indicators */}
              {passwordValue && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map(({ label, test }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 text-xs ${test(passwordValue) ? "text-green-600" : "text-gray-400"}`}
                    >
                      <CheckCircle
                        className={`w-3.5 h-3.5 ${test(passwordValue) ? "text-green-500" : "text-gray-300"}`}
                      />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm your password"
                className={`input-field ${errors.confirmPassword ? "border-red-400" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            By registering, you agree to our{" "}
            <Link to="/terms-of-use" className="underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
