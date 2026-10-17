import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { Scale, Menu, X } from "lucide-react";
import { useAuth } from "../lib/auth.jsx";

const link = ({ isActive }) =>
  `text-sm font-medium transition hover:text-gold-500 ${isActive ? "text-gold-500" : "text-slate-700"}`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const home = user?.role === "admin" ? "/admin" : user?.role === "lawyer" ? "/dashboard" : null;

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  const items = (
    <>
      <NavLink to="/lawyer-search" className={link} onClick={() => setOpen(false)}>Find a lawyer</NavLink>
      <NavLink to="/legal-resources" className={link} onClick={() => setOpen(false)}>Legal resources</NavLink>
      {home && <NavLink to={home} className={link} onClick={() => setOpen(false)}>{user.role === "admin" ? "Admin" : "Dashboard"}</NavLink>}
      {user ? (
        <button onClick={handleLogout} className="btn-outline !py-1.5">Log out</button>
      ) : (
        <>
          <NavLink to="/login" className={link} onClick={() => setOpen(false)}>Log in</NavLink>
          <Link to="/register" className="btn-primary !py-1.5" onClick={() => setOpen(false)}>Join as a lawyer</Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
          <Scale className="h-6 w-6 text-gold-500" aria-hidden /> {import.meta.env.VITE_APP_NAME ?? "LawyerDex"}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">{items}</nav>
        <button className="md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && <nav className="flex flex-col items-start gap-4 border-t border-slate-200 bg-white px-4 py-4 md:hidden">{items}</nav>}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold text-white">{import.meta.env.VITE_APP_NAME ?? "LawyerDex"}</p>
          <p className="mt-2 text-sm text-navy-200">Search, compare and contact verified lawyers in a few clicks.</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-white">Explore</p>
          <ul className="space-y-1.5">
            <li><Link to="/lawyer-search" className="hover:text-gold-400">Find a lawyer</Link></li>
            <li><Link to="/legal-resources" className="hover:text-gold-400">Legal resources</Link></li>
            <li><Link to="/register" className="hover:text-gold-400">List your practice</Link></li>
          </ul>
        </div>
        <p className="text-xs text-navy-200">
          This directory provides general information and does not constitute legal advice. Contacting a lawyer
          through this site does not create an attorney–client relationship.
        </p>
      </div>
      <p className="border-t border-navy-700 py-4 text-center text-xs text-navy-200">© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
