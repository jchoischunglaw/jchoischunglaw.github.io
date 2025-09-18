// Define the possible user roles in the system
export type UserRole = 'clinic' | 'lab' | 'admin';

// User interface defining the structure of a user object
export interface User {
  id: string;        // Unique identifier for the user
  email: string;     // User's email address (used for login)
  role: UserRole;    // User's role in the system
  name: string;      // Display name for the user
}

// Authentication state interface for managing user session
export interface AuthState {
  user: User | null;           // Current logged-in user (null if not authenticated)
  isAuthenticated: boolean;    // Boolean flag indicating if user is logged in
}