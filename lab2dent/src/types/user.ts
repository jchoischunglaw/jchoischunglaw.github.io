export type UserRole = 'admin' | 'clinic' | 'lab';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationName: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  permissions: string[];
  contactInfo?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export interface Analytics {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageCompletionTime: number;
  ordersByStatus: { [key: string]: number };
  ordersByPriority: { [key: string]: number };
  ordersByLab: { [key: string]: number };
  ordersByClinic: { [key: string]: number };
  monthlyOrderVolume: { month: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}