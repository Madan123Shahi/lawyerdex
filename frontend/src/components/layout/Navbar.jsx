// frontend/src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Scale, Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { authAPI } from "../../api/apiClient";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Logout — must hit the API to clear the HTTP-only cookie ──────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authAPI.logout(); // tells backend to clear cookie + bump tokenVersion
    } catch {
      // Even if API fails, clear local state so user isn't stuck
    } finally {
      logout(); // clear Zustand
      setOpen(false);
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const navLinks = [
    { to: "/lawyer-search", label: "Find a Lawyer" },
    { to: "/legal-resources", label: "Legal Resources" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-primary-700">
              Lawyer<span className="text-gold">Dex</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${isActive ? "text-primary-600" : "text-gray-600 hover:text-primary-600"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User name */}
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user?.name}
                </span>

                {/* Settings link */}
                <Link
                  to="/settings"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 animate-fade-in">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-semibold ${isActive ? "text-primary-600" : "text-gray-700"}`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <>
                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 text-sm text-gray-700 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-1.5 text-red-500 font-medium text-sm disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn-secondary py-2 text-sm flex-1 text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn-primary  py-2 text-sm flex-1 text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
