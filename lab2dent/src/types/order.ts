export type OrderStatus = 
  | 'Preparation'
  | 'In Production'
  | 'Post-Production Processing'
  | 'Ready for Shipping'
  | 'Shipped'
  | 'Delivered';

export type ProstheticType = 
  | 'Dentures'
  | 'Crown'
  | 'Bridge'
  | 'Veneer'
  | 'Implant'
  | 'Partial Denture'
  | 'Night Guard';

export type OrderPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type Carrier = 'UPS' | 'FedEx' | 'DHL' | 'USPS' | 'Local Delivery';

export interface ProductionPhoto {
  id: string;
  stage: OrderStatus;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  notes?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  patientName: string;
  prostheticType: ProstheticType;
  specialInstructions: string;
  status: OrderStatus;
  clinicName: string;
  assignedLab?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  trackingNumber?: string;
  carrier?: Carrier;
  statusHistory: StatusUpdate[];
  priority: OrderPriority;
  estimatedCompletionTime?: Date;
  productionPhotos: ProductionPhoto[];
  labNotes?: string;
  adminNotes?: string;
  lastModifiedBy?: string;
}

export interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}