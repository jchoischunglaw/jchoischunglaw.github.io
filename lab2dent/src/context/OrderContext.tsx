'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderState, OrderStatus, OrderPriority, Carrier, ProductionPhoto } from '@/types/order';

interface OrderContextType extends OrderState {
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'productionPhotos'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  updateTrackingNumber: (orderId: string, trackingNumber: string, carrier?: Carrier) => void;
  updateOrderPriority: (orderId: string, priority: OrderPriority) => void;
  updateEstimatedCompletion: (orderId: string, date: Date) => void;
  uploadProductionPhoto: (orderId: string, file: File, stage: OrderStatus, caption?: string) => void;
  adminUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  adminOverrideStatus: (orderId: string, status: OrderStatus, adminNotes: string) => void;
  assignToLab: (orderId: string, labName: string) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  generateOrderNumber: () => string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const generateSampleOrders = (): Order[] => [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    patientName: 'John Smith',
    prostheticType: 'Crown',
    specialInstructions: 'Patient prefers natural shade A2, high bite strength required',
    status: 'In Production',
    clinicName: 'Downtown Dental',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-02'),
    dueDate: new Date('2025-09-05'),
    priority: 'Normal',
    productionPhotos: [],
    statusHistory: [
      {
        status: 'Preparation',
        timestamp: new Date('2025-06-03'),
        notes: 'Order received and preparation started'
      },
      {
        status: 'In Production',
        timestamp: new Date('2025-06-08'),
        notes: 'Crown fabrication in progress'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    patientName: 'Sarah Johnson',
    prostheticType: 'Dentures',
    specialInstructions: 'Complete upper denture, patient has sensitive gums',
    status: 'Preparation',
    clinicName: 'Westside Family Dental',
    createdAt: new Date('2025-06-06'),
    updatedAt: new Date('2025-06-06'),
    dueDate: new Date('2025-08-08'),
    priority: 'High',
    productionPhotos: [],
    statusHistory: [
      {
        status: 'Preparation',
        timestamp: new Date('2025-06-10'),
        notes: 'Order received, reviewing requirements'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    patientName: 'Michael Brown',
    prostheticType: 'Bridge',
    specialInstructions: '3-unit bridge, molars 14-16, shade B3',
    status: 'Post-Production Processing',
    clinicName: 'Smile Center',
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2025-06-11'),
    dueDate: new Date('2025-12-02'),
    priority: 'Normal',
    estimatedCompletionTime: new Date('2025-08-02'),
    productionPhotos: [],
    statusHistory: [
      {
        status: 'Preparation',
        timestamp: new Date('2025-06-13'),
        notes: 'Order received and preparation started'
      },
      {
        status: 'In Production',
        timestamp: new Date('2025-06-14'),
        notes: 'Bridge fabrication in progress'
      },
      {
        status: 'Post-Production Processing',
        timestamp: new Date('2025-06-18'),
        notes: 'Final polishing and quality control'
      }
    ]
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    patientName: 'Emily Davis',
    prostheticType: 'Veneer',
    specialInstructions: 'Upper anterior 6 veneers, Hollywood white preferred',
    status: 'Ready for Shipping',
    clinicName: 'Elite Dental Care',
    createdAt: new Date('2025-06-18'),
    updatedAt: new Date('2025-06-18'),
    dueDate: new Date('2025-12-31'),
    priority: 'Urgent',
    estimatedCompletionTime: new Date('2025-12-31'),
    productionPhotos: [],
    statusHistory: [
      {
        status: 'Preparation',
        timestamp: new Date('2025-06-18'),
        notes: 'Order received and preparation started'
      },
      {
        status: 'In Production',
        timestamp: new Date('2025-06-20'),
        notes: 'Veneer fabrication in progress'
      },
      {
        status: 'Post-Production Processing',
        timestamp: new Date('2025-06-28'),
        notes: 'Final shaping and color matching'
      },
      {
        status: 'Ready for Shipping',
        timestamp: new Date('2025-06-30'),
        notes: 'Quality control passed, ready for shipping'
      }
    ]
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    patientName: 'Robert Wilson',
    prostheticType: 'Implant',
    specialInstructions: 'Single implant crown, titanium base, tooth #30',
    status: 'Shipped',
    clinicName: 'Downtown Dental',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-29'),
    dueDate: new Date('2025-06-28'),
    trackingNumber: '1Z999AA1234567890',
    carrier: 'UPS',
    priority: 'Normal',
    estimatedCompletionTime: new Date('2025-12-28'),
    productionPhotos: [
      {
        id: '1',
        stage: 'In Production',
        url: '/api/placeholder-image',
        caption: 'Implant crown progress',
        uploadedAt: new Date('2025-06-18')
      }
    ],
    statusHistory: [
      {
        status: 'Preparation',
        timestamp: new Date('2025-06-20'),
        notes: 'Order received and preparation started'
      },
      {
        status: 'In Production',
        timestamp: new Date('2025-06-27'),
        notes: 'Implant crown fabrication in progress'
      },
      {
        status: 'Post-Production Processing',
        timestamp: new Date('2025-06-26'),
        notes: 'Final fitting and quality control'
      },
      {
        status: 'Ready for Shipping',
        timestamp: new Date('2025-06-28'),
        notes: 'Packaged and ready for shipping'
      },
      {
        status: 'Shipped',
        timestamp: new Date('2025-06-30'),
        notes: 'Package shipped via UPS'
      }
    ]
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    patientName: 'Lisa Anderson',
    prostheticType: 'Partial Denture',
    specialInstructions: 'Lower partial, flexible base material requested',
    status: 'Delivered',
    clinicName: 'Healthy Smiles Clinic',
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2025-06-27'),
    dueDate: new Date('2025-12-25'),
    trackingNumber: '1Z999AA0987654321',
    carrier: 'UPS',
    priority: 'Low',
    estimatedCompletionTime: new Date('2025-12-25'),
    productionPhotos: [
      {
        id: '2',
        stage: 'Post-Production Processing',
        url: '/api/placeholder-image',
        caption: 'Final polishing complete',
        uploadedAt: new Date('2025-06-20')
      }
    ],
    statusHistory: [
      {
        status: 'Preparation',
        timestamp: new Date('2025-06-22'),
        notes: 'Order received and preparation started'
      },
      {
        status: 'In Production',
        timestamp: new Date('2025-06-23'),
        notes: 'Partial denture fabrication in progress'
      },
      {
        status: 'Post-Production Processing',
        timestamp: new Date('2025-06-25'),
        notes: 'Final adjustments and polishing'
      },
      {
        status: 'Ready for Shipping',
        timestamp: new Date('2025-06-30'),
        notes: 'Quality control passed, ready for shipping'
      },
      {
        status: 'Shipped',
        timestamp: new Date('2025-07-02'),
        notes: 'Package shipped via UPS'
      },
      {
        status: 'Delivered',
        timestamp: new Date('2025-07-05'),
        notes: 'Package delivered successfully'
      }
    ]
  }
];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orderState, setOrderState] = useState<OrderState>({
    orders: [],
    isLoading: false,
    error: null
  });

  useEffect(() => {
    setOrderState(prev => ({
      ...prev,
      orders: generateSampleOrders()
    }));
  }, []);

  const generateOrderNumber = (): string => {
    const year = new Date().getFullYear();
    const existingOrders = orderState.orders.filter(order => 
      order.orderNumber.startsWith(`ORD-${year}-`)
    );
    const nextNumber = existingOrders.length + 1;
    return `ORD-${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'productionPhotos'>) => {
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: generateOrderNumber(),
      createdAt: now,
      updatedAt: now,
      priority: orderData.priority || 'Normal',
      productionPhotos: [],
      statusHistory: [
        {
          status: orderData.status,
          timestamp: now,
          notes: 'Order created'
        }
      ]
    };

    setOrderState(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder]
    }));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    const now = new Date();
    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status, 
              updatedAt: now,
              statusHistory: [
                ...order.statusHistory,
                {
                  status,
                  timestamp: now,
                  notes: notes || `Status updated to ${status}`
                }
              ]
            }
          : order
      )
    }));
  };

  const updateTrackingNumber = (orderId: string, trackingNumber: string, carrier?: Carrier) => {
    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { ...order, trackingNumber, carrier, updatedAt: new Date() }
          : order
      )
    }));
  };

  const updateOrderPriority = (orderId: string, priority: OrderPriority) => {
    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { ...order, priority, updatedAt: new Date() }
          : order
      )
    }));
  };

  const updateEstimatedCompletion = (orderId: string, date: Date) => {
    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { ...order, estimatedCompletionTime: date, updatedAt: new Date() }
          : order
      )
    }));
  };

  const uploadProductionPhoto = (orderId: string, file: File, stage: OrderStatus, caption?: string) => {
    // In a real app, this would upload to a file storage service
    const photoUrl = URL.createObjectURL(file);
    const newPhoto: ProductionPhoto = {
      id: Date.now().toString(),
      stage,
      url: photoUrl,
      caption,
      uploadedAt: new Date()
    };

    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              productionPhotos: [...order.productionPhotos, newPhoto],
              updatedAt: new Date() 
            }
          : order
      )
    }));
  };

  const getOrdersByStatus = (status: OrderStatus): Order[] => {
    return orderState.orders.filter(order => order.status === status);
  };

  const adminUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { ...order, ...updates, lastModifiedBy: 'Admin', updatedAt: new Date() }
          : order
      )
    }));
  };

  const adminOverrideStatus = (orderId: string, status: OrderStatus, adminNotes: string) => {
    const now = new Date();
    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status, 
              adminNotes,
              lastModifiedBy: 'Admin',
              updatedAt: now,
              statusHistory: [
                ...order.statusHistory,
                {
                  status,
                  timestamp: now,
                  notes: `Admin override: ${adminNotes}`,
                  updatedBy: 'Admin'
                }
              ]
            }
          : order
      )
    }));
  };

  const assignToLab = (orderId: string, labName: string) => {
    setOrderState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { ...order, assignedLab: labName, lastModifiedBy: 'Admin', updatedAt: new Date() }
          : order
      )
    }));
  };

  const contextValue: OrderContextType = {
    ...orderState,
    createOrder,
    updateOrderStatus,
    updateTrackingNumber,
    updateOrderPriority,
    updateEstimatedCompletion,
    uploadProductionPhoto,
    adminUpdateOrder,
    adminOverrideStatus,
    assignToLab,
    getOrdersByStatus,
    generateOrderNumber
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}