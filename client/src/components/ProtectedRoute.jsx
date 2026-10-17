import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../lib/auth.jsx";
import Spinner from "./Spinner.jsx";

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
