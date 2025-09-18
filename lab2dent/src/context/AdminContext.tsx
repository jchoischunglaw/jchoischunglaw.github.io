'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserState, Analytics } from '@/types/user';
import { Order, OrderStatus } from '@/types/order';

interface AdminContextType extends UserState {
  analytics: Analytics;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  overrideOrderStatus: (orderId: string, status: OrderStatus, adminNotes: string) => void;
  assignOrderToLab: (orderId: string, labName: string) => void;
  generateAnalytics: (orders: Order[]) => Analytics;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const generateSampleUsers = (): User[] => [
  {
    id: '1',
    email: 'admin@lab2dent.com',
    name: 'System Administrator',
    role: 'admin',
    organizationName: 'LAB2DENT System',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-12-30'),
    permissions: ['view_orders', 'create_orders', 'edit_orders', 'delete_orders', 'manage_users', 'view_analytics', 'system_admin']
  },
  {
    id: '2',
    email: 'contact@downtown-dental.com',
    name: 'Dr. Sarah Johnson',
    role: 'clinic',
    organizationName: 'Downtown Dental',
    isActive: true,
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date('2024-12-29'),
    permissions: ['view_orders', 'create_orders', 'edit_orders']
  },
  {
    id: '3',
    email: 'lab@westside-family.com',
    name: 'Dr. Michael Chen',
    role: 'clinic',
    organizationName: 'Westside Family Dental',
    isActive: true,
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2024-12-28'),
    permissions: ['view_orders', 'create_orders', 'edit_orders']
  },
  {
    id: '4',
    email: 'production@premium-lab.com',
    name: 'Premium Dental Lab',
    role: 'lab',
    organizationName: 'Premium Dental Lab',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date('2024-12-30'),
    permissions: ['view_orders', 'edit_orders']
  },
  {
    id: '5',
    email: 'info@techlab-solutions.com',
    name: 'TechLab Solutions',
    role: 'lab',
    organizationName: 'TechLab Solutions',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-12-29'),
    permissions: ['view_orders', 'edit_orders']
  },
  {
    id: '6',
    email: 'contact@smile-center.com',
    name: 'Dr. Emily Davis',
    role: 'clinic',
    organizationName: 'Smile Center',
    isActive: true,
    createdAt: new Date('2024-04-05'),
    lastLogin: new Date('2024-12-27'),
    permissions: ['view_orders', 'create_orders']
  },
  {
    id: '7',
    email: 'orders@elite-dental.com',
    name: 'Dr. Robert Wilson',
    role: 'clinic',
    organizationName: 'Elite Dental Care',
    isActive: false,
    createdAt: new Date('2024-05-12'),
    lastLogin: new Date('2024-11-15'),
    permissions: ['view_orders', 'create_orders']
  },
  {
    id: '8',
    email: 'lab@healthy-smiles.com',
    name: 'Dr. Lisa Anderson',
    role: 'clinic',
    organizationName: 'Healthy Smiles Clinic',
    isActive: true,
    createdAt: new Date('2024-06-18'),
    lastLogin: new Date('2024-12-26'),
    permissions: ['view_orders', 'create_orders', 'edit_orders']
  }
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>({
    users: [],
    isLoading: false,
    error: null
  });

  const [analytics, setAnalytics] = useState<Analytics>({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageCompletionTime: 0,
    ordersByStatus: {},
    ordersByPriority: {},
    ordersByLab: {},
    ordersByClinic: {},
    monthlyOrderVolume: [],
    revenueByMonth: []
  });

  useEffect(() => {
    setUserState(prev => ({
      ...prev,
      users: generateSampleUsers()
    }));
  }, []);

  const generateAnalytics = (orders: Order[]): Analytics => {
    const now = new Date();
    const activeStatuses = ['Preparation', 'In Production', 'Post-Production Processing', 'Ready for Shipping', 'Shipped'];
    
    const activeOrders = orders.filter(order => activeStatuses.includes(order.status));
    const completedOrders = orders.filter(order => order.status === 'Delivered');
    
    // Calculate average completion time
    const avgCompletionTime = completedOrders.length > 0
      ? completedOrders.reduce((sum, order) => {
          const timeDiff = new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime();
          return sum + (timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
        }, 0) / completedOrders.length
      : 0;

    // Group by status
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Group by priority
    const ordersByPriority = orders.reduce((acc, order) => {
      acc[order.priority] = (acc[order.priority] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Group by lab
    const ordersByLab = orders.reduce((acc, order) => {
      if (order.assignedLab) {
        acc[order.assignedLab] = (acc[order.assignedLab] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Group by clinic
    const ordersByClinic = orders.reduce((acc, order) => {
      acc[order.clinicName] = (acc[order.clinicName] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Monthly order volume (last 12 months)
    const monthlyOrderVolume = [];
    const revenueByMonth = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
      });
      
      monthlyOrderVolume.push({
        month: monthKey,
        count: monthOrders.length
      });
      
      // Simulate revenue (would be calculated from actual pricing)
      const revenue = monthOrders.length * 450; // Average $450 per order
      revenueByMonth.push({
        month: monthKey,
        revenue
      });
    }

    const totalRevenue = revenueByMonth.reduce((sum, month) => sum + month.revenue, 0);

    const newAnalytics: Analytics = {
      totalOrders: orders.length,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      averageCompletionTime: avgCompletionTime,
      ordersByStatus,
      ordersByPriority,
      ordersByLab,
      ordersByClinic,
      monthlyOrderVolume,
      revenueByMonth
    };

    setAnalytics(newAnalytics);
    return newAnalytics;
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastLogin: undefined
    };

    setUserState(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUserState(prev => ({
      ...prev,
      users: prev.users.map(user =>
        user.id === userId
          ? { ...user, ...updates }
          : user
      )
    }));
  };

  const deleteUser = (userId: string) => {
    setUserState(prev => ({
      ...prev,
      users: prev.users.filter(user => user.id !== userId)
    }));
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    // This would typically update orders through the OrderContext
    // For now, we'll just log the action
    console.log('Admin updating order:', orderId, updates);
  };

  const overrideOrderStatus = (orderId: string, status: OrderStatus, adminNotes: string) => {
    // This would typically override order status through the OrderContext
    console.log('Admin overriding order status:', orderId, status, adminNotes);
  };

  const assignOrderToLab = (orderId: string, labName: string) => {
    // This would typically assign orders through the OrderContext
    console.log('Admin assigning order to lab:', orderId, labName);
  };

  const contextValue: AdminContextType = {
    ...userState,
    analytics,
    createUser,
    updateUser,
    deleteUser,
    updateOrder,
    overrideOrderStatus,
    assignOrderToLab,
    generateAnalytics
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}