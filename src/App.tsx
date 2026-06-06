import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BecomeTutorPage from './pages/BecomeTutorPage';
import StudentPage from './pages/StudentMainPage';
import StudentSearchPage from './pages/StudentSearchPage/StudentSearchPage';
import StudentSubjectPage from './pages/StudentSubjectPage';
import StudentLessonsPage from './pages/StudentLessonsPage/StudentLessonsPage';
import TutorPage from './pages/TutorMainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import SubjectPageRoute from './pages/SubjectPageRoute';
import AuthLayout from './pages/AuthLayout';
import './styles/fonts.css';
import './styles/globals.scss';
import './lib/amplify-config';
import { ProtectedRoute } from './lib/protectedRoute';

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
        <Route path="/student" element={
          <ProtectedRoute requiredRole="student">
            <StudentPage />
          </ProtectedRoute>
        } />
        <Route path="/student/search" element={
          <ProtectedRoute requiredRole="student">
            <StudentSearchPage />
          </ProtectedRoute>
        } />
        <Route path="/student/subjects/:slug" element={
          <ProtectedRoute requiredRole="student">
            <StudentSubjectPage />
          </ProtectedRoute>
        } />
        <Route path="/student/lessons" element={
          <ProtectedRoute requiredRole="student">
            <StudentLessonsPage />
          </ProtectedRoute>
        } />
        <Route path="/tutor" element={
          <ProtectedRoute requiredRole="tutor">
            <TutorPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}