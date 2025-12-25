import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateSubscription } from '../../store/slices/authSlice';
import subscriptionService, { SubscriptionPlan } from '../../services/subscriptionService';

/**
 * Component to sync user subscription plan from database to Redux on app load
 * This ensures the Navbar shows the correct subscription status even after page refresh
 */
export default function SubscriptionSync() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only run for authenticated users
    if (!user) return;

    const syncSubscription = async () => {
      try {
        console.log('🔄 [SubscriptionSync] Syncing subscription from database...');
        console.log('🔄 [SubscriptionSync] Current Redux subscription plan:', user.subscriptionPlan);

        // Fetch current subscription
        const subscription = await subscriptionService.getCurrentSubscription();

        if (subscription && subscription.status === 'ACTIVE') {
          // Fetch all plans to get the badge for the subscription's plan
          const plansResponse = await subscriptionService.listPublicPlans();
          const plan = plansResponse.plans.find((p: SubscriptionPlan) => p.id === subscription.planId);

          if (plan) {
            const badge = plan.badge.toLowerCase(); // Convert to lowercase: "free", "starter", "professional", "enterprise"
            console.log('🔄 [SubscriptionSync] Database subscription plan badge:', badge);

            // Update Redux if subscription plan is different
            if (user.subscriptionPlan !== badge) {
              console.log('✅ [SubscriptionSync] Updating Redux subscription plan:', badge);
              dispatch(updateSubscription(badge));
            } else {
              console.log('✅ [SubscriptionSync] Subscription plan already in sync');
            }
          } else {
            console.warn('⚠️ [SubscriptionSync] Plan not found for subscription planId:', subscription.planId);
            // If plan not found but subscription is active, don't change the current plan
            // This handles edge cases where a plan might have been deleted
          }
        } else {
          // No active subscription - user should be on free plan
          if (user.subscriptionPlan !== 'free') {
            console.log('✅ [SubscriptionSync] No active subscription, updating to free plan');
            dispatch(updateSubscription('free'));
          } else {
            console.log('✅ [SubscriptionSync] Already on free plan');
          }
        }
      } catch (error) {
        // Silently fail - subscription sync is not critical, user can still use the app
        console.error('❌ [SubscriptionSync] Failed to sync subscription:', error);
      }
    };

    // Sync subscription on mount
    syncSubscription();
  }, [user?.id, dispatch]); // Only re-run if user ID changes

  // This component doesn't render anything
  return null;
}

