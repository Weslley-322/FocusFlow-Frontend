import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useThemeStore } from '@/store/useThemeStore';
import { Login, Register, Dashboard, Subjects, SubjectDetails, Pomodoro, Flashcards, FlashcardReview, Goals, MindMaps, VerifyEmail } from '@/pages';
import { Layout } from '@/components';

function App() {
  const { loadUserFromStorage, isAuthenticated } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => { loadUserFromStorage(); }, [loadUserFromStorage]);
  useEffect(() => {

    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/subjects" element={isAuthenticated ? <Layout><Subjects /></Layout> : <Navigate to="/login" />} />
        <Route path="/subjects/:id" element={isAuthenticated ? <Layout><SubjectDetails /></Layout> : <Navigate to="/login" />} />
        <Route path="/pomodoro" element={isAuthenticated ? <Layout><Pomodoro /></Layout> : <Navigate to="/login" />} />
        <Route path="/flashcards" element={isAuthenticated ? <Layout><Flashcards /></Layout> : <Navigate to="/login" />} />
        <Route path="/flashcards/review" element={isAuthenticated ? <Layout><FlashcardReview /></Layout> : <Navigate to="/login" />} />
        <Route path="/goals" element={isAuthenticated ? <Layout><Goals /></Layout> : <Navigate to="/login" />} />
        <Route path="/mindmaps" element={isAuthenticated ? <Layout><MindMaps /></Layout> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;