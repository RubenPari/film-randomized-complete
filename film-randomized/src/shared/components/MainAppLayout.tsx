/**
 * Layout for authenticated main app routes.
 * Wraps every protected page in the shared AppShell (top bar + bottom nav).
 */
import ProtectedRoute from './ProtectedRoute.jsx';
import AppShell from './AppShell.jsx';

function MainAppLayout() {
  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  );
}

export default MainAppLayout;
