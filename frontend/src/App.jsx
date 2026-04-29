import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LawyerSearchPage from './pages/LawyerSearchPage';
import LawyerDetailPage from './pages/LawyerDetailPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="lawyer-search" element={<LawyerSearchPage />} />
          <Route path="lawyer-search/:category" element={<LawyerSearchPage />} />
          <Route path="lawyers/:id" element={<LawyerDetailPage />} />
          <Route path="legal-resources" element={<ResourcesPage />} />
          <Route path="legal-resources/:slug" element={<ResourceDetailPage />} />
          <Route path="contact-us" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
