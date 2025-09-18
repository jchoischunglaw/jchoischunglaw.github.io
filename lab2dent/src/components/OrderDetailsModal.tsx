'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types/order';
import OrderProgressBar from './OrderProgressBar';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const isOverdue = new Date(order.dueDate) < new Date() && order.status !== 'Delivered';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h4>
                <p className="text-gray-600">Patient: {order.patientName}</p>
                <p className="text-gray-600">Clinic: {order.clinicName}</p>
              </div>
              <div className="text-right md:text-left">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                {isOverdue && (
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Overdue
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white border rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 mb-4">Production Progress</h5>
            <OrderProgressBar currentStatus={order.status} />
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Order Information</h5>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-gray-500">Prosthetic Type</dt>
                  <dd className="text-sm text-gray-900">{order.prostheticType}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Due Date</dt>
                  <dd className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {formatDate(order.dueDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{formatDate(order.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Special Instructions</h5>
              {order.specialInstructions ? (
                <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded">
                  {order.specialInstructions}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No special instructions provided</p>
              )}

              {order.trackingNumber && (
                <div className="mt-4">
                  <h6 className="text-xs font-medium text-gray-500 mb-2">Tracking Information</h6>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-mono text-blue-800">{order.trackingNumber}</p>
                    <a
                      href={`https://www.track-trace.com/trace?tracking=${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                    >
                      Track Package →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white border rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 mb-4">Status History</h5>
            <div className="space-y-3">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((update, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                      <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(update.status).replace('text-', 'bg-').split(' ')[0]}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{update.status}</span>
                          <span className="text-xs text-gray-500">{formatDate(update.timestamp)}</span>
                        </div>
                        {update.notes && (
                          <p className="text-xs text-gray-600 mt-1">{update.notes}</p>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No status history available</p>
                  <p className="text-xs text-gray-400 mt-1">Status updates will appear here as the order progresses</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}