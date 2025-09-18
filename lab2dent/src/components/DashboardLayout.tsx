'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Props interface for the DashboardLayout component
interface DashboardLayoutProps {
  children: React.ReactNode;  // Dashboard content to render
  title: string;              // Page title to display
}

/**
 * DashboardLayout Component
 * Provides a consistent layout structure for all dashboard pages
 * Includes navigation bar with user info and logout functionality
 * 
 * @param children - Dashboard content components
 * @param title - Page title to display in the header
 */
export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Handle user logout and redirect to login page
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/Logo.png"
                alt="LAB2DENT Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-xl font-semibold text-gray-900">LAB2DENT</h1>
            </div>
            
            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          
          {/* Dashboard Content */}
          {children}
        </div>
      </div>
    </div>
  );
}