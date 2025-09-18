'use client';

import React, { useState } from 'react';
import { Order, OrderStatus, OrderPriority, Carrier } from '@/types/order';

interface LabOrderManagementProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  onUpdateTracking: (orderId: string, trackingNumber: string, carrier: Carrier) => void;
  onUpdatePriority: (orderId: string, priority: OrderPriority) => void;
  onUpdateEstimatedCompletion: (orderId: string, date: Date) => void;
  onUploadPhoto: (orderId: string, file: File, stage: OrderStatus, caption?: string) => void;
}

export default function LabOrderManagement({
  orders,
  onUpdateStatus,
  onUpdateTracking,
  onUpdatePriority,
  onUpdateEstimatedCompletion,
  onUploadPhoto
}: LabOrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState<{
    [key: string]: {
      status: OrderStatus;
      notes: string;
      trackingNumber: string;
      carrier: Carrier;
      priority: OrderPriority;
      estimatedCompletion: string;
    };
  }>({});

  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<OrderPriority | 'All'>('All');

  const statusOptions: OrderStatus[] = [
    'Preparation',
    'In Production',
    'Post-Production Processing',
    'Ready for Shipping',
    'Shipped',
    'Delivered'
  ];

  const priorityOptions: OrderPriority[] = ['Low', 'Normal', 'High', 'Urgent'];
  const carrierOptions: Carrier[] = ['UPS', 'FedEx', 'DHL', 'USPS', 'Local Delivery'];

  const getOrderUpdateData = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return updateData[orderId] || {
      status: order?.status || 'Preparation',
      notes: '',
      trackingNumber: order?.trackingNumber || '',
      carrier: order?.carrier || 'UPS',
      priority: order?.priority || 'Normal',
      estimatedCompletion: order?.estimatedCompletionTime 
        ? new Date(order.estimatedCompletionTime).toISOString().split('T')[0]
        : ''
    };
  };

  const updateOrderData = (orderId: string, field: string, value: string) => {
    setUpdateData(prev => ({
      ...prev,
      [orderId]: {
        ...getOrderUpdateData(orderId),
        [field]: value
      }
    }));
  };

  const handleStatusUpdate = (orderId: string) => {
    const data = getOrderUpdateData(orderId);
    onUpdateStatus(orderId, data.status, data.notes);
    setSelectedOrder(null);
    setUpdateData(prev => ({ ...prev, [orderId]: { ...data, notes: '' } }));
  };

  const handleTrackingUpdate = (orderId: string) => {
    const data = getOrderUpdateData(orderId);
    if (data.trackingNumber) {
      onUpdateTracking(orderId, data.trackingNumber, data.carrier);
    }
  };

  const handlePriorityUpdate = (orderId: string, priority: OrderPriority) => {
    onUpdatePriority(orderId, priority);
    updateOrderData(orderId, 'priority', priority);
  };

  const handleEstimatedCompletionUpdate = (orderId: string) => {
    const data = getOrderUpdateData(orderId);
    if (data.estimatedCompletion) {
      onUpdateEstimatedCompletion(orderId, new Date(data.estimatedCompletion));
    }
  };

  const handlePhotoUpload = (orderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const order = orders.find(o => o.id === orderId);
    if (file && order) {
      onUploadPhoto(orderId, file, order.status);
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const statusMatch = filterStatus === 'All' || order.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || order.priority === filterPriority;
    return statusMatch && priorityMatch;
  }).sort((a, b) => {
    // Sort by priority first (Urgent > High > Normal > Low), then by due date
    const priorityOrder = { 'Urgent': 4, 'High': 3, 'Normal': 2, 'Low': 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'All')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as OrderPriority | 'All')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map((order) => {
            const data = getOrderUpdateData(order.id);
            const isExpanded = selectedOrder === order.id;
            
            return (
              <li key={order.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        {order.orderNumber}
                      </button>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                      {isOverdue(order) && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {formatDate(order.dueDate)}
                    </div>
                  </div>

                  {/* Order Basic Info */}
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Patient:</span>
                      <span className="ml-1 text-gray-600">{order.patientName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Type:</span>
                      <span className="ml-1 text-gray-600">{order.prostheticType}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Clinic:</span>
                      <span className="ml-1 text-gray-600">{order.clinicName}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 border-t pt-4 space-y-4">
                      {/* Status Update Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">Update Status</h4>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">New Status</label>
                            <select
                              value={data.status}
                              onChange={(e) => updateOrderData(order.id, 'status', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Update Notes</label>
                            <textarea
                              value={data.notes}
                              onChange={(e) => updateOrderData(order.id, 'notes', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Add notes about this status update..."
                            />
                          </div>

                          <button
                            onClick={() => handleStatusUpdate(order.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            Update Status
                          </button>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">Order Management</h4>
                          
                          {/* Priority Update */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                            <select
                              value={data.priority}
                              onChange={(e) => handlePriorityUpdate(order.id, e.target.value as OrderPriority)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {priorityOptions.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                              ))}
                            </select>
                          </div>

                          {/* Estimated Completion */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Completion</label>
                            <div className="flex space-x-2">
                              <input
                                type="date"
                                value={data.estimatedCompletion}
                                onChange={(e) => updateOrderData(order.id, 'estimatedCompletion', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => handleEstimatedCompletionUpdate(order.id)}
                                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                              >
                                Save
                              </button>
                            </div>
                          </div>

                          {/* Photo Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Upload Production Photo</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(order.id, e)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Information (only for Shipped status) */}
                      {(data.status === 'Shipped' || order.status === 'Shipped') && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Shipping Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Tracking Number</label>
                              <input
                                type="text"
                                value={data.trackingNumber}
                                onChange={(e) => updateOrderData(order.id, 'trackingNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter tracking number"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Carrier</label>
                              <div className="flex space-x-2">
                                <select
                                  value={data.carrier}
                                  onChange={(e) => updateOrderData(order.id, 'carrier', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  {carrierOptions.map(carrier => (
                                    <option key={carrier} value={carrier}>{carrier}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleTrackingUpdate(order.id)}
                                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Production Photos */}
                      {order.productionPhotos && order.productionPhotos.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Production Photos</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {order.productionPhotos.map((photo) => (
                              <div key={photo.id} className="relative">
                                <div
                                  className="w-full h-20 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500"
                                >
                                  {photo.caption || `${photo.stage} stage`}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-md">
                                  {photo.stage}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special Instructions */}
                      {order.specialInstructions && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Special Instructions</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md italic">
                            {order.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}

          {filteredOrders.length === 0 && (
            <li>
              <div className="px-4 py-8 text-center text-gray-500">
                No orders match the current filters.
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}