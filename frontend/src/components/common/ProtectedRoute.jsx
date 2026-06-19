// frontend/src/components/common/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save where they were trying to go — redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
