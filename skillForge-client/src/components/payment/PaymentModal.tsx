import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';
import paymentService from '@/services/paymentService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientSecret: string;
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onError: (errorMessage: string) => void;
}

function CheckoutForm({ amount, onSuccess, onError, onClose }: {
    amount: number;
    onSuccess: (id: string) => void;
    onError: (msg: string) => void;
    onClose: () => void
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                const errorMessage = error.message || 'Payment failed due to an unknown error';
                console.error('Payment Error:', errorMessage);
                onError(errorMessage);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment successful with Stripe, now confirm with backend
                console.log('[PaymentModal] Stripe payment succeeded, confirming with backend...');
                try {
                    await paymentService.confirmPayment(paymentIntent.id);
                    console.log('[PaymentModal] Backend confirmation successful');
                    onSuccess(paymentIntent.id);
                } catch (backendError: any) {
                    console.error('[PaymentModal] Backend confirmation failed:', backendError);
                    onError(backendError.message || 'Payment succeeded but subscription assignment failed');
                }
            } else {
                onError('Payment did not complete. Status: ' + (paymentIntent?.status || 'unknown'));
            }
        } catch (err: any) {
            onError(err.message || 'An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        `Pay ₹${amount}`
                    )}
                </button>
            </div>
        </form>
    );
}

export default function PaymentModal({ isOpen, onClose, clientSecret, amount, onSuccess, onError }: PaymentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* 
                  Key prop forces re-render if clientSecret changes, 
                  ensuring Elements updates correctly.
                */}
                <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
}