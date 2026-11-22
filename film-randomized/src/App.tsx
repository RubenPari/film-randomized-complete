/**
 * Main application component with routing.
 * Sets up React Router routes and provides authentication context.
 */
import { type JSX, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/context/AuthContext.jsx';
import ErrorBoundary from './shared/components/ErrorBoundary.jsx';
import MainAppLayout from './shared/components/MainAppLayout.jsx';
import { FilterProvider } from './features/media/context/FilterContext.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ChangePasswordPage from './pages/ChangePasswordPage.jsx';
import WatchlistPage from './features/watchlist/WatchlistPage.jsx';
import SearchPage from './features/search/SearchPage.jsx';
import DiscoveredPage from './features/discovered/DiscoveredPage.jsx';
import SimilarPage from './pages/SimilarPage.jsx';
import PersonPage from './pages/PersonPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/** Keeps filters and the last result alive across routes; resets them when the user changes. */
function UserScopedFilters({ children }: { children: ReactNode }): JSX.Element {
  const { user } = useAuth();
  return <FilterProvider key={user?.id ?? 'anon'}>{children}</FilterProvider>;
}

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
        <UserScopedFilters>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<MainAppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/discovered" element={<DiscoveredPage />} />
              <Route path="/similar/:mediaType/:mediaId" element={<SimilarPage />} />
              <Route path="/person/:personId" element={<PersonPage />} />
              <Route path="/profile" element={<ChangePasswordPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </UserScopedFilters>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
