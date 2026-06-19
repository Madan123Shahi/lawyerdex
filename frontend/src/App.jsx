// frontend/src/App.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LawyerSearchPage from "./pages/LawyerSearchPage";
import LawyerDetailPage from "./pages/LawyerDetailPage";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* ── Public Routes ── */}
          <Route index element={<HomePage />} />
          <Route path="lawyer-search" element={<LawyerSearchPage />} />
          <Route
            path="lawyer-search/:category"
            element={<LawyerSearchPage />}
          />
          <Route path="lawyers/:id" element={<LawyerDetailPage />} />
          <Route path="legal-resources" element={<ResourcesPage />} />
          <Route
            path="legal-resources/:slug"
            element={<ResourceDetailPage />}
          />
          <Route path="contact-us" element={<ContactPage />} />

          {/* ── Auth Routes (redirect to home if already logged in) ── */}
          <Route
            path="login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* ── Protected Routes (must be logged in) ── */}
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Redirects logged-in users away from /login and /register
function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}
