import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../lib/auth.jsx";

const schema = z.object({ email: z.email("Enter a valid email"), password: z.string().min(1, "Enter your password") });
export const homeFor = (role) => (role === "admin" ? "/admin" : role === "lawyer" ? "/dashboard" : "/");

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  async function onSubmit(values) {
    setError("");
    try {
      const u = await login(values.email, values.password);
      navigate(location.state?.from ?? homeFor(u.role), { replace: true });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6" noValidate>
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" className="input" {...register("email")} />{errors.email && <p className="field-error">{errors.email.message}</p>}</div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" className="input" {...register("password")} />{errors.password && <p className="field-error">{errors.password.message}</p>}</div>
        {error && <p role="alert" className="field-error">{error}</p>}
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Log in"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">New here? <Link to="/register" className="font-medium text-navy-600 hover:underline">Create an account</Link></p>
    </div>
  );
}
