'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import AdminOrderManagement from '@/components/AdminOrderManagement';
import AdminAnalytics from '@/components/AdminAnalytics';
import AdminUserManagement from '@/components/AdminUserManagement';
import { useOrder } from '@/context/OrderContext';
import { useAdmin } from '@/context/AdminContext';
import React, { useState } from 'react';

export default function AdminDashboard() {
  const { orders, adminUpdateOrder, assignToLab } = useOrder();
  const { 
    users, 
    analytics, 
    createUser, 
    updateUser, 
    deleteUser, 
    generateAnalytics 
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'analytics' | 'users'>('overview');

  // Generate analytics whenever orders change
  React.useEffect(() => {
    generateAnalytics(orders);
  }, [orders, generateAnalytics]);

  const getStatusCounts = () => {
    const activeOrders = orders.filter(order => 
      !['Delivered'].includes(order.status)
    ).length;
    
    const overdueOrders = orders.filter(order => 
      new Date(order.dueDate) < new Date() && order.status !== 'Delivered'
    ).length;

    return {
      totalOrders: orders.length,
      activeOrders,
      overdueOrders,
      totalClinics: new Set(orders.map(o => o.clinicName)).size,
      totalLabs: new Set(orders.map(o => o.assignedLab).filter(Boolean)).size,
      totalUsers: users.length
    };
  };

  const counts = getStatusCounts();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'orders', name: 'Order Management', icon: '📋' },
    { id: 'analytics', name: 'Analytics & Reports', icon: '📈' },
    { id: 'users', name: 'User Management', icon: '👥' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout title="Admin Dashboard">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'orders' | 'analytics' | 'users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">O</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Orders
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">{counts.totalOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">A</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Orders
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">{counts.activeOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">!</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Overdue Orders
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">{counts.overdueOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-semibold">U</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Users
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">{counts.totalUsers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">System Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Clinics</span>
                    <span className="text-sm font-medium text-gray-900">{counts.totalClinics}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Labs</span>
                    <span className="text-sm font-medium text-gray-900">{counts.totalLabs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-medium text-gray-900">
                      {users.filter(u => u.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analytics.totalOrders > 0 
                        ? Math.round((analytics.completedOrders / analytics.totalOrders) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {orders
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                          <span className="text-sm text-gray-500 ml-2">{order.clinicName}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <AdminOrderManagement
            orders={orders}
            onUpdateOrder={adminUpdateOrder}
            onAssignLab={assignToLab}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalytics
            orders={orders}
            analytics={analytics}
          />
        )}

        {activeTab === 'users' && (
          <AdminUserManagement
            users={users}
            onCreateUser={createUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}