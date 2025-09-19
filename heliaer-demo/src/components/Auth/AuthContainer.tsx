import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './Login';
import SignUp from './SignUp';
import type { AuthScreen, LoginFormData, SignUpFormData } from '../../types';

interface AuthContainerProps {
  onAuthenticated: (user: any) => void;
}

export default function AuthContainer({ onAuthenticated }: AuthContainerProps) {
  const [currentAuthScreen, setCurrentAuthScreen] = useState<AuthScreen>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset to login screen when component mounts (e.g., after logout)
  useEffect(() => {
    setCurrentAuthScreen('login');
    setError(null);
  }, []);

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo authentication logic
      if (formData.email === 'demo@heliaer.com' && formData.password === 'DemoPass123') {
        const demoUser = {
          id: 'demo-user-1',
          email: formData.email,
          firstName: 'Demo',
          lastName: 'User',
          userType: 'customer',
          avatar: '',
          createdAt: new Date().toISOString(),
        };
        
        // Store in localStorage for demo persistence
        localStorage.setItem('heliaer_user', JSON.stringify(demoUser));
        localStorage.setItem('heliaer_auth_token', 'demo-auth-token');
        
        onAuthenticated(demoUser);
      } else {
        throw new Error('Invalid email or password. Use demo@heliaer.com / DemoPass123 for demo access.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create new user (demo logic)
      const newUser = {
        id: `user-${Date.now()}`,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
        phone: formData.phone,
        avatar: '',
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for demo persistence
      localStorage.setItem('heliaer_user', JSON.stringify(newUser));
      localStorage.setItem('heliaer_auth_token', `auth-token-${Date.now()}`);

      onAuthenticated(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality would be implemented here. For the demo, use: demo@heliaer.com / DemoPass123');
  };

  const switchToLogin = () => {
    setCurrentAuthScreen('login');
    setError(null);
  };

  const switchToSignUp = () => {
    setCurrentAuthScreen('signup');
    setError(null);
  };

  return (
    <AnimatePresence mode="wait">
      {currentAuthScreen === 'login' ? (
        <Login
          key="login"
          onLogin={handleLogin}
          onSwitchToSignUp={switchToSignUp}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <SignUp
          key="signup"
          onSignUp={handleSignUp}
          onSwitchToLogin={switchToLogin}
          isLoading={isLoading}
          error={error}
        />
      )}
    </AnimatePresence>
  );
}