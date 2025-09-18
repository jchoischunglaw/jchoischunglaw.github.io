import { User, UserRole } from '@/types/auth';

// Pre-defined test users for demonstration purposes
const TEST_USERS = [
  {
    id: '1',
    email: 'clinic@test.com',
    password: 'test123',
    role: 'clinic' as UserRole,
    name: 'Clinic User'
  },
  {
    id: '2',
    email: 'lab@test.com',
    password: 'test123',
    role: 'lab' as UserRole,
    name: 'Lab User'
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: 'test123',
    role: 'admin' as UserRole,
    name: 'Admin User'
  }
];

/**
 * Authenticate user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns User object if authentication successful, null otherwise
 */
export function authenticateUser(email: string, password: string): User | null {
  // Find user with matching email and password
  const user = TEST_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    // Remove password from user object before returning for security
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

/**
 * Save user data to localStorage for persistent authentication
 * @param user - User object to save
 */
export function saveUserToStorage(user: User): void {
  localStorage.setItem('lab2dent_user', JSON.stringify(user));
}

/**
 * Retrieve user data from localStorage
 * @returns User object if found, null otherwise
 */
export function getUserFromStorage(): User | null {
  // Check if running on client-side (not server-side rendering)
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('lab2dent_user');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Remove user data from localStorage (logout)
 */
export function removeUserFromStorage(): void {
  localStorage.removeItem('lab2dent_user');
}

/**
 * Get the appropriate dashboard path based on user role
 * @param role - User's role
 * @returns Dashboard path for the given role
 */
export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case 'clinic':
      return '/clinic/dashboard';
    case 'lab':
      return '/lab/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}