import { Calendar, Crown, X } from 'lucide-react';
import { UserSubscription } from '../../services/subscriptionService';

interface CurrentSubscriptionCardProps {
    subscription: UserSubscription;
    onCancel: () => void;
    onUpgrade: () => void;
    onReactivate?: () => void; // Optional reactivate handler
    isHighestTier?: boolean;
}

export default function CurrentSubscriptionCard({
    subscription,
    onCancel,
    onUpgrade,
    onReactivate,
    isHighestTier = false
}: CurrentSubscriptionCardProps) {
    // Calculate days remaining
    const now = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get plan color based on status
    const getPlanColor = () => {
        if (subscription.status === 'CANCELED') return 'bg-muted border-border';
        if (subscription.status === 'EXPIRED') return 'bg-destructive/10 border-destructive/30';
        if (subscription.status === 'PAST_DUE') return 'bg-destructive/10 border-destructive/30';
        if (subscription.status === 'TRIALING') return 'bg-primary/10 border-primary/30';
        if (subscription.willCancelAtPeriodEnd) return 'bg-yellow-500/10 border-yellow-500/30';
        return 'bg-gradient-to-br from-accent/10 to-accent/20 border-accent/30';
    };

    const getStatusBadge = () => {
        if (subscription.status === 'PAST_DUE') {
            return (
                <span className="px-3 py-1 bg-destructive/20 text-destructive text-xs font-semibold rounded-full">
                    Past Due
                </span>
            );
        }
        if (subscription.willCancelAtPeriodEnd) {
            return (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 text-xs font-semibold rounded-full">
                    Cancels on {formatDate(subscription.currentPeriodEnd)}
                </span>
            );
        }
        if (subscription.status === 'TRIALING') {
            return (
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                    Trial Period
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-green-500/20 text-green-600 text-xs font-semibold rounded-full">
                Active
            </span>
        );
    };

    const getValidUntilLabel = () => {
        if (subscription.willCancelAtPeriodEnd) return 'Access until:';
        if (subscription.status === 'TRIALING') return 'Trial ends on:';
        if (subscription.status === 'PAST_DUE') return 'Payment failed, retry by:';
        return 'Renews on:';
    };

    return (
        <div className={`rounded-2xl p-6 border-2 ${getPlanColor()} shadow-lg transition-all`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-card rounded-full shadow-sm">
                        <Crown className={`w-6 h-6 ${subscription.status === 'PAST_DUE' ? 'text-destructive' : 'text-primary'}`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">
                            {subscription.planName || 'Current Plan'}
                        </h3>
                        {getStatusBadge()}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">
                        <span className="font-medium">{getValidUntilLabel()}</span> {formatDate(subscription.currentPeriodEnd)}
                    </span>
                </div>

                {daysRemaining > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5" /> {/* Spacer */}
                        <span className="text-sm text-muted-foreground">
                            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                        </span>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                {/* Upgrade Button: Visible if Active/Trialing and NOT canceling */}
                {!isHighestTier && subscription.status === 'ACTIVE' && !subscription.willCancelAtPeriodEnd && (
                    <button
                        onClick={onUpgrade}
                        className="flex-1 py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        Upgrade Plan
                    </button>
                )}

                {/* Cancel Button: Visible if Active/Trialing/PastDue and NOT canceling */}
                {['ACTIVE', 'TRIALING', 'PAST_DUE'].includes(subscription.status) && !subscription.willCancelAtPeriodEnd && (
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 bg-card border-2 border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel Subscription
                    </button>
                )}

                {/* Resume Button: Visible if Canceling */}
                {subscription.willCancelAtPeriodEnd && (
                    <button
                        onClick={onReactivate || onUpgrade}
                        className="flex-1 py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        Reactivate Subscription
                    </button>
                )}
            </div>

            {subscription.willCancelAtPeriodEnd && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600">
                        Your subscription is set to cancel. You can continue enjoying benefits until {formatDate(subscription.currentPeriodEnd)}.
                        <br />To keep your benefits, simply reactivate or select a plan below.
                    </p>
                </div>
            )}

            {subscription.status === 'PAST_DUE' && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">
                        Your last payment failed. Please update your payment method or select a plan to restore full access.
                    </p>
                </div>
            )}
        </div>
    );
}
