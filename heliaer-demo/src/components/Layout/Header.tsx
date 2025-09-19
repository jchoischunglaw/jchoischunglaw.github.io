import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, LogOut, Settings, Plane } from 'lucide-react';
import type { User as UserType } from '../../types';

interface HeaderProps {
  user?: UserType | null;
  onLogout?: () => void;
  onAuthClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onAuthClick }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'pilot':
        return <Plane className="w-4 h-4" />;
      case 'operator':
        return <Settings className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'pilot':
        return 'Pilot';
      case 'operator':
        return 'Operator';
      default:
        return 'Customer';
    }
  };

  return (
    <motion.header
      className="bg-white shadow-sm px-6 py-4 border-b sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src="/images/logos/HeliaerLogo_wFont.png"
            alt="HeliAer - AI Helicopter Matching"
            className="h-8 md:h-10 w-auto"
          />
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#services"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Services
          </a>
          <a
            href="#about"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                      {getUserTypeIcon(user.userType)}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-gray-500">{getUserTypeLabel(user.userType)}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`} />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onLogout) {
                          onLogout();
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={onAuthClick}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={onAuthClick}
                className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;