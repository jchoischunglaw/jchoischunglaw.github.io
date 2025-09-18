'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import LabOrderManagement from '@/components/LabOrderManagement';
import { useOrder } from '@/context/OrderContext';
import { OrderStatus, OrderPriority, Carrier } from '@/types/order';

export default function LabDashboard() {
  const { 
    orders, 
    updateOrderStatus, 
    updateTrackingNumber,
    updateOrderPriority,
    updateEstimatedCompletion,
    uploadProductionPhoto,
    getOrdersByStatus 
  } = useOrder();

  const getStatusCounts = () => {
    return {
      preparation: getOrdersByStatus('Preparation').length,
      inProduction: getOrdersByStatus('In Production').length,
      postProduction: getOrdersByStatus('Post-Production Processing').length,
      readyForShipping: getOrdersByStatus('Ready for Shipping').length,
      shipped: getOrdersByStatus('Shipped').length,
      delivered: getOrdersByStatus('Delivered').length
    };
  };

  const statusCounts = getStatusCounts();
  
  const handleStatusUpdate = (orderId: string, status: OrderStatus, notes?: string) => {
    updateOrderStatus(orderId, status, notes);
  };

  const handleTrackingUpdate = (orderId: string, trackingNumber: string, carrier: Carrier) => {
    updateTrackingNumber(orderId, trackingNumber, carrier);
  };

  const handlePriorityUpdate = (orderId: string, priority: OrderPriority) => {
    updateOrderPriority(orderId, priority);
  };

  const handleEstimatedCompletionUpdate = (orderId: string, date: Date) => {
    updateEstimatedCompletion(orderId, date);
  };

  const handlePhotoUpload = (orderId: string, file: File, stage: OrderStatus, caption?: string) => {
    uploadProductionPhoto(orderId, file, stage, caption);
  };

  return (
    <ProtectedRoute allowedRoles={['lab']}>
      <DashboardLayout title="Lab Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Preparation
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.preparation}</dd>
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
                    <span className="text-white font-semibold">I</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      In Production
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.inProduction}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Post-Production
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.postProduction}</dd>
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
                    <span className="text-white font-semibold">R</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Ready for Shipping
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.readyForShipping}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <LabOrderManagement
            orders={orders}
            onUpdateStatus={handleStatusUpdate}
            onUpdateTracking={handleTrackingUpdate}
            onUpdatePriority={handlePriorityUpdate}
            onUpdateEstimatedCompletion={handleEstimatedCompletionUpdate}
            onUploadPhoto={handlePhotoUpload}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}