'use client';

import React from 'react';
import { Order } from '@/types/order';
import { Analytics } from '@/types/user';

interface AdminAnalyticsProps {
  orders: Order[];
  analytics: Analytics;
}

export default function AdminAnalytics({ orders, analytics }: AdminAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparation': return 'bg-blue-500';
      case 'In Production': return 'bg-yellow-500';
      case 'Post-Production Processing': return 'bg-orange-500';
      case 'Ready for Shipping': return 'bg-purple-500';
      case 'Shipped': return 'bg-indigo-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-gray-400';
      case 'Normal': return 'bg-blue-400';
      case 'High': return 'bg-orange-400';
      case 'Urgent': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Orders
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(analytics.totalOrders)}
                  </dd>
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
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Orders
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(analytics.activeOrders)}
                  </dd>
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
                  <span className="text-white font-semibold text-sm">C</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(analytics.completedOrders)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">$</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(analytics.totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-3`}></div>
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Priority */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Priority</h3>
          <div className="space-y-3">
            {Object.entries(analytics.ordersByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)} mr-3`}></div>
                  <span className="text-sm text-gray-700">{priority}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Labs */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Lab</h3>
          <div className="space-y-3">
            {Object.entries(analytics.ordersByLab).slice(0, 5).map(([lab, count]) => (
              <div key={lab} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate">{lab}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clinics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Clinic</h3>
          <div className="space-y-3">
            {Object.entries(analytics.ordersByClinic).slice(0, 5).map(([clinic, count]) => (
              <div key={clinic} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate">{clinic}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.averageCompletionTime.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Avg. Completion Time (days)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {((analytics.completedOrders / analytics.totalOrders) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Completion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(analytics.totalRevenue / analytics.totalOrders)}
            </div>
            <div className="text-sm text-gray-500">Avg. Order Value</div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Order Volume</h3>
          <div className="space-y-3">
            {analytics.monthlyOrderVolume.slice(-6).map((data) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{data.month}</span>
                <span className="text-sm font-medium text-gray-900">{data.count} orders</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {analytics.revenueByMonth.slice(-6).map((data) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{data.month}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(data.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Order Activity</h3>
        <div className="space-y-4">
          {orders
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
            .map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)} text-white`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                  <span className="text-sm text-gray-500">{order.clinicName}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(order.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}