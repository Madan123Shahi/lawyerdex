import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../lib/auth.jsx";
import { homeFor } from "./Login.jsx";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  role: z.enum(["client", "lawyer"]),
});

export default function Register() {
  const { user, register: signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "lawyer" },
  });

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  async function onSubmit(values) {
    setError("");
    try {
      const u = await signUp(values);
      navigate(homeFor(u.role), { replace: true });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6" noValidate>
        <fieldset>
          <legend className="label">I am a…</legend>
          <div className="grid grid-cols-2 gap-3">
            {[["lawyer", "Lawyer"], ["client", "Looking for a lawyer"]].map(([v, l]) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm has-[:checked]:border-navy-600 has-[:checked]:bg-navy-50">
                <input type="radio" value={v} {...register("role")} /> {l}
              </label>
            ))}
          </div>
        </fieldset>
        <div><label className="label" htmlFor="name">Full name</label><input id="name" autoComplete="name" className="input" {...register("name")} />{errors.name && <p className="field-error">{errors.name.message}</p>}</div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" className="input" {...register("email")} />{errors.email && <p className="field-error">{errors.email.message}</p>}</div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" className="input" {...register("password")} />{errors.password && <p className="field-error">{errors.password.message}</p>}</div>
        {error && <p role="alert" className="field-error">{error}</p>}
        <button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create account"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">Already registered? <Link to="/login" className="font-medium text-navy-600 hover:underline">Log in</Link></p>
    </div>
  );
}
