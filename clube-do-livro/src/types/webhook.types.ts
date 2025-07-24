/**
 * Webhook Types - Hotmart integration types
 */

// Hotmart webhook event types
export type HotmartEventType = 
  | 'PURCHASE_COMPLETED'
  | 'PURCHASE_CANCELED' 
  | 'PURCHASE_REFUNDED'
  | 'SUBSCRIPTION_CANCELED'
  | 'SUBSCRIPTION_REACTIVATED'
  | 'PURCHASE_DELAYED'
  | 'PURCHASE_APPROVED';

// Hotmart webhook payload structure
export interface HotmartWebhookData {
  event: HotmartEventType;
  data: {
    buyer: {
      name: string;
      email: string;
      phone?: string;
      document?: string;
    };
    product: {
      id: number;
      name: string;
      ucode?: string;
    };
    transaction: {
      transaction_id: string;
      value: number;
      purchase_date: string;
      status?: string;
      payment_method?: string;
    };
    affiliate?: {
      name: string;
      email: string;
    };
    subscription?: {
      subscription_id: string;
      status: string;
      plan: string;
    };
  };
  timestamp: string;
  version: string;
}

// Webhook response interface
export interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  data?: {
    userId?: string;
    userEmail?: string;
    productId?: string;
    transactionId?: string;
    [key: string]: any;
  };
}

// Transaction record for internal tracking
export interface HotmartTransaction {
  id: string;
  hotmartId: string;
  event: HotmartEventType;
  productId: string;
  productName: string;
  buyerEmail: string;
  buyerName: string;
  amount: number;
  currency: string;
  status: 'completed' | 'canceled' | 'refunded' | 'pending';
  affiliateEmail?: string;
  affiliateName?: string;
  subscriptionId?: string;
  paymentMethod?: string;
  createdAt: Date;
  processedAt: Date;
  errorMessage?: string;
  retryCount?: number;
}

// Webhook endpoint configuration
export interface WebhookEndpointConfig {
  url: string;
  secret: string;
  isActive: boolean;
  events: HotmartEventType[];
  retryAttempts: number;
  timeout: number;
}

// Webhook processing result
export interface WebhookProcessingResult {
  transactionId: string;
  success: boolean;
  userCreated: boolean;
  userUpdated: boolean;
  emailSent: boolean;
  tagsAssigned: string[];
  errors: string[];
  processingTime: number;
}

// Webhook statistics
export interface WebhookStats {
  totalProcessed: number;
  successfulProcessed: number;
  failedProcessed: number;
  uniqueUsers: number;
  totalRevenue: number;
  eventCounts: Record<HotmartEventType, number>;
  lastProcessedAt?: Date;
  errorRate: number;
}

// Mock webhook data for testing
export interface MockWebhookData {
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  productId?: number;
  productName?: string;
  transactionValue?: number;
  event?: HotmartEventType;
}