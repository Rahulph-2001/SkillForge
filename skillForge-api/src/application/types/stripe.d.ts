/**
 * Stripe Webhook Event Types
 * These types represent the structure of Stripe webhook payloads
 */

export interface StripePaymentIntent {
  id: string;
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  client_secret?: string;
}

export interface StripeCharge {
  id: string;
  payment_intent?: string;
  amount: number;
  currency: string;
  refunded: boolean;
  metadata?: Record<string, string>;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: StripePaymentIntent | StripeCharge;
  };
}

