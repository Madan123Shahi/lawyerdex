import { Routes, Route } from "react-router";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import LawyerSearch from "./pages/LawyerSearch.jsx";
import LawyerProfile from "./pages/LawyerProfile.jsx";
import Resources from "./pages/Resources.jsx";
import Article from "./pages/Article.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lawyer-search" element={<LawyerSearch />} />
        <Route path="lawyer-search/:area" element={<LawyerSearch />} />
        <Route path="lawyers/:slug" element={<LawyerProfile />} />
        <Route path="legal-resources" element={<Resources />} />
        <Route path="legal-resources/:slug" element={<Article />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute roles={["lawyer"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
