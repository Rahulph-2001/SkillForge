
import api from './api';

export interface CreatePaymentIntentRequest {
    amount: number;
    currency?: string;
    purpose: 'SUBSCRIPTION' | 'CREDITS' | 'PROJECT_POST';
    metadata?: Record<string, any>;
}

export interface CreatePaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
    paymentId: string;
}

const paymentService = {
    createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
        const response = await api.post('/payments/create-intent', data);
        return response.data.data;
    },

    confirmPayment: async (paymentIntentId: string) => {
        const response = await api.post('/payments/confirm', { paymentIntentId });
        return response.data.data;
    },
};

export default paymentService;