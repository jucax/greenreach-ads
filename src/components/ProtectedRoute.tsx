import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ Protected route check:', {
    user: user ? user.name : 'null',
    loading,
    path: location.pathname
  });

  // Show loading spinner while auth is being checked
  if (loading) {
    console.log('⏳ Auth still loading, showing spinner...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
          <p className="text-sm text-slate-500 mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only redirect to login if we're sure there's no user (after loading is complete)
  if (!user) {
    console.log('❌ No user found after auth check, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log('✅ User authenticated, rendering protected content');
  return <>{children}</>;
};
