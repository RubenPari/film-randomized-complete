/**
 * Layout for authenticated main app: keeps FilterProvider mounted across
 * home, watchlist, and discovered so generator state (e.g. current title) survives navigation.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { FilterProvider } from '../../features/media/context/FilterContext.jsx';

function MainAppLayout() {
  return (
    <ProtectedRoute>
      <FilterProvider>
        <Outlet />
      </FilterProvider>
    </ProtectedRoute>
  );
}

export default MainAppLayout;
