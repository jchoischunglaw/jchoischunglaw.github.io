'use client';

import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, OrderPriority } from '@/types/order';

interface AdminOrderManagementProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onAssignLab: (orderId: string, labName: string) => void;
}

export default function AdminOrderManagement({
  orders,
  onUpdateOrder,
  onAssignLab
}: AdminOrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<OrderPriority | 'All'>('All');
  const [filterLab, setFilterLab] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Order>>({});

  const statusOptions: OrderStatus[] = [
    'Preparation',
    'In Production',
    'Post-Production Processing',
    'Ready for Shipping',
    'Shipped',
    'Delivered'
  ];

  const priorityOptions: OrderPriority[] = ['Low', 'Normal', 'High', 'Urgent'];

  // Get unique labs
  const labs = useMemo(() => {
    const labSet = new Set(orders.map(o => o.assignedLab).filter(Boolean));
    return Array.from(labSet);
  }, [orders]);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = !searchTerm || 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.assignedLab && order.assignedLab.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || order.priority === filterPriority;
      const matchesLab = filterLab === 'All' || order.assignedLab === filterLab;

      return matchesSearch && matchesStatus && matchesPriority && matchesLab;
    }).sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { 'Urgent': 4, 'High': 3, 'Normal': 2, 'Low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [orders, searchTerm, filterStatus, filterPriority, filterLab]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Preparation': return 'bg-blue-100 text-blue-800';
      case 'In Production': return 'bg-yellow-100 text-yellow-800';
      case 'Post-Production Processing': return 'bg-orange-100 text-orange-800';
      case 'Ready for Shipping': return 'bg-purple-100 text-purple-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: OrderPriority) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-600';
      case 'Normal': return 'bg-blue-100 text-blue-600';
      case 'High': return 'bg-orange-100 text-orange-600';
      case 'Urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const isOverdue = (order: Order) => {
    return new Date(order.dueDate) < new Date() && order.status !== 'Delivered';
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order.id);
    setEditData({
      patientName: order.patientName,
      prostheticType: order.prostheticType,
      specialInstructions: order.specialInstructions,
      priority: order.priority,
      dueDate: order.dueDate,
      assignedLab: order.assignedLab || '',
      adminNotes: order.adminNotes || ''
    });
  };

  const handleSaveEdit = () => {
    if (editingOrder && editData) {
      onUpdateOrder(editingOrder, {
        ...editData,
        lastModifiedBy: 'Admin',
        updatedAt: new Date()
      });
      setEditingOrder(null);
      setEditData({});
    }
  };


  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by order number, clinic, patient, or lab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as OrderPriority | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lab</label>
            <select
              value={filterLab}
              onChange={(e) => setFilterLab(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Labs</option>
              {labs.map(lab => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span>{filteredOrders.filter(o => isOverdue(o)).length} overdue orders</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient/Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status/Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clinic/Lab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        {order.orderNumber}
                      </button>
                      {order.trackingNumber && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.patientName}</div>
                    <div className="text-sm text-gray-500">{order.prostheticType}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                    {isOverdue(order) && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.clinicName}</div>
                    <div className="text-sm text-gray-500">
                      {order.assignedLab || 'Unassigned'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Created: {formatDate(order.createdAt)}</div>
                    <div className={isOverdue(order) ? 'text-red-600 font-medium' : ''}>
                      Due: {formatDate(order.dueDate)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders match the current filters.
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            {(() => {
              const order = orders.find(o => o.id === selectedOrder);
              if (!order) return null;

              return (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-medium text-gray-900">Order Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Order Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Order Information</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                            <dd className="text-sm text-gray-900">{order.orderNumber}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Patient</dt>
                            <dd className="text-sm text-gray-900">{order.patientName}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Type</dt>
                            <dd className="text-sm text-gray-900">{order.prostheticType}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Priority</dt>
                            <dd className="text-sm text-gray-900">{order.priority}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Assignment</h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Clinic</dt>
                            <dd className="text-sm text-gray-900">{order.clinicName}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Assigned Lab</dt>
                            <dd className="text-sm text-gray-900">{order.assignedLab || 'Unassigned'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Last Modified By</dt>
                            <dd className="text-sm text-gray-900">{order.lastModifiedBy || 'N/A'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Status History */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Status History</h4>
                      <div className="space-y-3">
                        {order.statusHistory.map((update, index) => (
                          <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                            <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(update.status).replace('text-', 'bg-').split(' ')[0]}`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{update.status}</span>
                                <span className="text-xs text-gray-500">{formatDateTime(update.timestamp)}</span>
                              </div>
                              {update.notes && (
                                <p className="text-xs text-gray-600 mt-1">{update.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-4">Admin Actions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Override Status
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to Lab
                          </label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={(e) => onAssignLab(order.id, e.target.value)}
                            value={order.assignedLab || ''}
                          >
                            <option value="">Select Lab</option>
                            {labs.map(lab => (
                              <option key={lab} value={lab}>{lab}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Order</h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={editData.patientName || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={editData.priority || 'Normal'}
                    onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as OrderPriority }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={editData.dueDate ? new Date(editData.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, dueDate: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  value={editData.specialInstructions || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={editData.adminNotes || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, adminNotes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Admin notes and comments..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}