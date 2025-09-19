import React from 'react';
import Header from './Header';
import Footer from './Footer';
import type { User } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  user?: User | null;
  onLogout?: () => void;
  onAuthClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showFooter = true,
  user,
  onLogout,
  onAuthClick
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        user={user}
        onLogout={onLogout}
        onAuthClick={onAuthClick}
      />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;