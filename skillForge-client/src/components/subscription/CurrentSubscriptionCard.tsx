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
        if (subscription.status === 'CANCELED') return 'bg-gray-100 border-gray-300'; // Actually CANCELED usually means expired/inactive
        if (subscription.status === 'EXPIRED') return 'bg-red-50 border-red-300';
        if (subscription.status === 'PAST_DUE') return 'bg-red-50 border-red-300';
        if (subscription.status === 'TRIALING') return 'bg-blue-50 border-blue-300';
        if (subscription.willCancelAtPeriodEnd) return 'bg-yellow-50 border-yellow-300';
        return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300';
    };

    const getStatusBadge = () => {
        if (subscription.status === 'PAST_DUE') {
            return (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    Past Due
                </span>
            );
        }
        if (subscription.willCancelAtPeriodEnd) {
            return (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Cancels on {formatDate(subscription.currentPeriodEnd)}
                </span>
            );
        }
        if (subscription.status === 'TRIALING') {
            return (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    Trial Period
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
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
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <Crown className={`w-6 h-6 ${subscription.status === 'PAST_DUE' ? 'text-red-500' : 'text-orange-500'}`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {subscription.planName || 'Current Plan'}
                        </h3>
                        {getStatusBadge()}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">
                        <span className="font-medium">{getValidUntilLabel()}</span> {formatDate(subscription.currentPeriodEnd)}
                    </span>
                </div>

                {daysRemaining > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5" /> {/* Spacer */}
                        <span className="text-sm text-gray-600">
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
                        className="flex-1 py-2 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        Upgrade Plan
                    </button>
                )}



                {/* Cancel Button: Visible if Active/Trialing/PastDue and NOT canceling */}
                {/* Cancel Button: Visible if Active/Trialing/PastDue and NOT canceling */}
                {['ACTIVE', 'TRIALING', 'PAST_DUE'].includes(subscription.status) && !subscription.willCancelAtPeriodEnd && (
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel Subscription
                    </button>
                )}

                {/* Resume Button: Visible if Canceling */}
                {subscription.willCancelAtPeriodEnd && (
                    <button
                        onClick={onReactivate || onUpgrade}
                        className="flex-1 py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        Reactivate Subscription
                    </button>
                )}
            </div>

            {subscription.willCancelAtPeriodEnd && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        Your subscription is set to cancel. You can continue enjoying benefits until {formatDate(subscription.currentPeriodEnd)}.
                        <br />To keep your benefits, simply reactivate or select a plan below.
                    </p>
                </div>
            )}

            {subscription.status === 'PAST_DUE' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                        Your last payment failed. Please update your payment method or select a plan to restore full access.
                    </p>
                </div>
            )}
        </div>
    );
}
