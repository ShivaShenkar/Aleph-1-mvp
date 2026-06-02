import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/about/page';
import BecomeTutorPage from './pages/become-tutor/page';
import StudentPage from './pages/student/page';
import TutorPage from './pages/tutor/page';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import SubjectPageRoute from './pages/SubjectPageRoute';
import AuthLayout from './pages/AuthLayout';
import './styles/fonts.css';
import './styles/globals.scss';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/become-tutor" element={<BecomeTutorPage />} />
        <Route path="/subjects/:slug" element={<SubjectPageRoute />} />
        
        {/* Auth routes with layout */}
        <Route element={<AuthLayout><LoginPage /></AuthLayout>} path="/login" />
        <Route element={<AuthLayout><SignupPage /></AuthLayout>} path="/signup" />
        <Route element={<AuthLayout><VerifyPage /></AuthLayout>} path="/verify" />
        
        {/* Dashboard routes (protected in practice) */}
        <Route path="/student" element={<StudentPage />} />
        <Route path="/tutor" element={<TutorPage />} />
      </Routes>
    </BrowserRouter>
  );
}