/**
 * Main application component with routing.
 * Sets up React Router routes and provides authentication context.
 */
import { type JSX } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext.jsx';
import ErrorBoundary from './shared/components/ErrorBoundary.jsx';
import MainAppLayout from './shared/components/MainAppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import ChangePasswordPage from './pages/ChangePasswordPage.jsx';
import WatchlistPage from './features/watchlist/WatchlistPage.jsx';
import DiscoveredPage from './features/discovered/DiscoveredPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * Root application component.
 * Configures routes and wraps app in authentication provider and error boundary.
 *
 * @returns {JSX.Element} Application with routing
 */
function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<MainAppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/discovered" element={<DiscoveredPage />} />
            <Route path="/profile" element={<ChangePasswordPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
