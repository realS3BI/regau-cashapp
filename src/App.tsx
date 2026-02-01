import { ConvexProvider } from 'convex/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { convex } from './lib/convex';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHowItWorksPage from './pages/admin/AdminHowItWorksPage';
import AdminLogin from './pages/admin/AdminLogin';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import TeamPage from './pages/TeamPage';

const App = () => {
  return (
    <ErrorBoundary>
      <ConvexProvider client={convex}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/help" element={<HowItWorksPage />} />
            <Route path="/help/admin" element={<AdminHowItWorksPage />} />
            <Route path="/team/:slug" element={<TeamPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Toaster position="bottom-center" />
        </BrowserRouter>
      </ConvexProvider>
    </ErrorBoundary>
  );
};

export default App;
