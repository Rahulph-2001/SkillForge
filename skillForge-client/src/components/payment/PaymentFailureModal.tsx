import { AlertCircle, RefreshCw } from 'lucide-react';

interface PaymentFailureModalProps {
    isOpen: boolean;
    onClose: () => void;
    error?: string;
    onRetry: () => void;
}

export default function PaymentFailureModal({
    isOpen,
    onClose,
    error,
    onRetry
}: PaymentFailureModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-border">

                {/* Header Background Pattern */}
                <div className="bg-destructive/10 h-32 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="text-destructive" />
                        </svg>
                    </div>
                    <div className="bg-card p-3 rounded-full shadow-lg relative z-10 animate-in zoom-in duration-300 delay-150">
                        <AlertCircle className="w-12 h-12 text-destructive" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="px-8 pb-8 pt-4 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Payment Failed</h2>
                    <p className="text-muted-foreground mb-8">
                        We couldn't process your payment. Please check your card details or try a different payment method.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl mb-8 border border-destructive/20 flex items-start text-left gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={onRetry}
                            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3.5 rounded-xl font-semibold transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full bg-card text-foreground hover:bg-muted py-3.5 rounded-xl font-semibold transition-colors border border-border"
                        >
                            Cancel and Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
