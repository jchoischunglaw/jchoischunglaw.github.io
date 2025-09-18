'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import OrderProgressBar from './OrderProgressBar';
import OrderDetailsModal from './OrderDetailsModal';

interface OrderTrackingInterfaceProps {
  orders: Order[];
  onUpdateTracking?: (orderId: string, trackingNumber: string) => void;
}

export default function OrderTrackingInterface({ orders, onUpdateTracking }: OrderTrackingInterfaceProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumbers, setTrackingNumbers] = useState<{ [key: string]: string }>({});
  const [editingTracking, setEditingTracking] = useState<string | null>(null);

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

  const handleTrackingSubmit = (orderId: string) => {
    const trackingNumber = trackingNumbers[orderId];
    if (trackingNumber && onUpdateTracking) {
      onUpdateTracking(orderId, trackingNumber);
      setEditingTracking(null);
    }
  };

  const handleTrackingChange = (orderId: string, value: string) => {
    setTrackingNumbers(prev => ({ ...prev, [orderId]: value }));
  };

  const getTrackingUrl = (trackingNumber: string) => {
    // Generic tracking URL - in real app, would determine carrier
    return `https://www.track-trace.com/trace?tracking=${trackingNumber}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedOrders = orders.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Order Tracking
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Track all your orders with real-time status updates
        </p>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {sortedOrders.map((order) => (
          <li key={order.id} className="px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    >
                      {order.orderNumber}
                    </button>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Updated: {formatDate(order.updatedAt)}
                  </div>
                </div>

                <div className="mb-4">
                  <OrderProgressBar currentStatus={order.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Patient:</span>
                    <span className="ml-1 text-gray-600">{order.patientName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Type:</span>
                    <span className="ml-1 text-gray-600">{order.prostheticType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Due:</span>
                    <span className="ml-1 text-gray-600">{new Date(order.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {order.status === 'Shipped' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">Tracking Information</span>
                      {!editingTracking || editingTracking !== order.id ? (
                        <button
                          onClick={() => setEditingTracking(order.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          {order.trackingNumber ? 'Edit' : 'Add Tracking'}
                        </button>
                      ) : null}
                    </div>
                    
                    {editingTracking === order.id ? (
                      <div className="mt-2 flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Enter tracking number"
                          value={trackingNumbers[order.id] || order.trackingNumber || ''}
                          onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleTrackingSubmit(order.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTracking(null)}
                          className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : order.trackingNumber ? (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-blue-800 font-mono">{order.trackingNumber}</span>
                        <a
                          href={getTrackingUrl(order.trackingNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Track Package →
                        </a>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-blue-600">Click &quot;Add Tracking&quot; to enter tracking number</p>
                    )}
                  </div>
                )}

                {order.specialInstructions && (
                  <div className="mt-3 text-sm text-gray-600 italic">
                    <span className="font-medium text-gray-900">Instructions:</span> {order.specialInstructions}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
        
        {sortedOrders.length === 0 && (
          <li>
            <div className="px-4 py-8 text-center text-gray-500">
              No orders to track yet.
            </div>
          </li>
        )}
      </ul>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}