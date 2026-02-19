import { CheckCircle, ArrowRight } from 'lucide-react';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    amount: number;
    transactionId?: string;
    onContinue: () => void;
}

export default function PaymentSuccessModal({
    isOpen,
    planName,
    amount,
    transactionId,
    onContinue
}: PaymentSuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-border">

                {/* Header Background Pattern */}
                <div className="bg-green-500/10 h-32 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="text-green-500" />
                        </svg>
                    </div>
                    <div className="bg-card p-3 rounded-full shadow-lg relative z-10 animate-in zoom-in duration-300 delay-150">
                        <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="px-8 pb-8 pt-4 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
                    <p className="text-muted-foreground mb-8">
                        You have successfully subscribed to the <span className="font-semibold text-foreground">{planName}</span> plan.
                    </p>

                    {/* Receipt Card */}
                    <div className="bg-muted/30 rounded-xl p-4 mb-8 border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Amount Paid</span>
                            <span className="text-lg font-bold text-foreground">₹{amount}</span>
                        </div>
                        {transactionId && (
                            <div className="flex justify-between items-start pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">Transaction ID</span>
                                <span className="text-xs text-foreground font-mono text-right break-all ml-4">
                                    {transactionId}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onContinue}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-semibold transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                    >
                        Continue to Dashboard
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
