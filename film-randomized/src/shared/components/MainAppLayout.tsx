/**
 * Layout for authenticated main app routes.
 */
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

function MainAppLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default MainAppLayout;
