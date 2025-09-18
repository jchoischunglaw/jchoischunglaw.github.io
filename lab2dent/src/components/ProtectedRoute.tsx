'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

// Props interface for the ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;      // Child components to render if authorized
  allowedRoles?: UserRole[];      // Optional array of roles allowed to access this route
}

/**
 * ProtectedRoute Component
 * Wrapper component that restricts access based on authentication and user roles
 * Redirects unauthenticated users to login and unauthorized users to error page
 * 
 * @param children - Components to render if user has access
 * @param allowedRoles - Array of user roles allowed to access this route
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Handle authentication and authorization checks
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user's role is allowed for this route
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Show unauthorized message if user doesn't have required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div className="min-h-screen flex items-center justify-center">Unauthorized</div>;
  }

  // Render protected content if user is authorized
  return <>{children}</>;
}