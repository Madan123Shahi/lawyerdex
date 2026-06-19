// frontend/src/pages/SettingsPage.jsx
import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useChangePassword } from "../hooks/useAuth";

// ─── Reusable Password Field ──────────────────────────────────────────────────
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-colors
            ${
              error
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-gray-300 bg-white focus:border-primary-500"
            }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ─── Password Strength Indicator ──────────────────────────────────────────────
const strengthConfig = [
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
];

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  return (
    <ul className="mt-2 space-y-1">
      {strengthConfig.map(({ label, test }) => (
        <li
          key={label}
          className={`flex items-center gap-1.5 text-xs ${
            test(password) ? "text-green-600" : "text-gray-400"
          }`}
        >
          <CheckCircle
            className={`w-3.5 h-3.5 ${
              test(password) ? "text-green-500" : "text-gray-300"
            }`}
          />
          {label}
        </li>
      ))}
    </ul>
  );
};

// ─── Profile Section ──────────────────────────────────────────────────────────
const ProfileSection = ({ user }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6">
    <div className="flex items-center gap-2 mb-6">
      <User className="w-5 h-5 text-primary-600" />
      <h2 className="text-lg font-semibold text-gray-800">
        Profile Information
      </h2>
    </div>
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
        {user?.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <span
          className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
            user?.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {user?.role ?? "user"}
        </span>
      </div>
    </div>
    <p className="text-xs text-gray-400">
      To update your name or email, please contact support.
    </p>
  </div>
);

// ─── Security Section ─────────────────────────────────────────────────────────
const INITIAL = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const SecuritySection = () => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const {
    mutate: changePassword,
    isPending,
    error: mutationError,
    reset: resetMutation,
  } = useChangePassword();

  // Pull field-level and top-level errors from normalized error
  const backendFieldErrors = mutationError?.normalized?.errors
    ? Object.fromEntries(
        mutationError.normalized.errors.map(({ field, message }) => [
          field,
          message,
        ]),
      )
    : {};

  const apiError =
    mutationError && !mutationError.normalized?.errors
      ? (mutationError.normalized?.message ??
        "Something went wrong. Please try again.")
      : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(false);
    if (mutationError) resetMutation(); // clear React Query error on new input
  };

  const validate = () => {
    const errs = {};
    if (!form.currentPassword)
      errs.currentPassword = "Current password is required.";
    if (!form.newPassword) errs.newPassword = "New password is required.";
    else if (form.newPassword.length < 8)
      errs.newPassword = "At least 8 characters.";
    else if (!/[A-Z]/.test(form.newPassword))
      errs.newPassword = "Add an uppercase letter.";
    else if (!/[a-z]/.test(form.newPassword))
      errs.newPassword = "Add a lowercase letter.";
    else if (!/[0-9]/.test(form.newPassword))
      errs.newPassword = "Add a number.";
    else if (!/[^A-Za-z0-9]/.test(form.newPassword))
      errs.newPassword = "Add a special character.";
    if (form.newPassword && form.newPassword === form.currentPassword)
      errs.newPassword = "Must differ from current password.";
    if (!form.confirmNewPassword)
      errs.confirmNewPassword = "Please confirm your new password.";
    else if (form.newPassword !== form.confirmNewPassword)
      errs.confirmNewPassword = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    changePassword(form, {
      onSuccess: () => {
        setSuccess(true);
        setForm(INITIAL);
        setErrors({});
      },
    });
  };

  // Merge client-side + backend field errors (backend wins on conflicts)
  const fieldErrors = { ...errors, ...backendFieldErrors };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-800">Security</h2>
      </div>

      {success && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Password changed successfully. All other sessions have been logged
          out.
        </div>
      )}

      {apiError && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          error={fieldErrors.currentPassword}
          placeholder="Enter your current password"
        />
        <div>
          <PasswordField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            error={fieldErrors.newPassword}
            placeholder="Enter your new password"
          />
          <PasswordStrength password={form.newPassword} />
        </div>
        <PasswordField
          label="Confirm New Password"
          name="confirmNewPassword"
          value={form.confirmNewPassword}
          onChange={handleChange}
          error={fieldErrors.confirmNewPassword}
          placeholder="Re-enter your new password"
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="btn-gold rounded-xl flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const user = useAuthStore((s) => s.user); // ← Zustand, not Redux

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your profile and security preferences.
          </p>
        </div>
        <div className="space-y-6">
          <ProfileSection user={user} />
          <SecuritySection />
        </div>
      </div>
    </div>
  );
}
