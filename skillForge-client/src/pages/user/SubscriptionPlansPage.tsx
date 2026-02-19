import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSubscription } from '../../store/slices/authSlice';
import paymentService from '@/services/paymentService';
import PaymentModal from '@/components/payment/PaymentModal';
import PaymentSuccessModal from '@/components/payment/PaymentSuccessModal';
import PaymentFailureModal from '@/components/payment/PaymentFailureModal';
import CurrentSubscriptionCard from '@/components/subscription/CurrentSubscriptionCard';
import ConfirmModal from '@/components/common/Modal/ConfirmModal';
import { toast } from 'react-hot-toast';

import { Check, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

import { Footer } from '../../components/common/Footer';
import subscriptionService, { SubscriptionPlan, UserSubscription } from '../../services/subscriptionService';
import type { AppDispatch } from '../../store/store';


interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Get icon emoji based on plan badge
 */
const getPlanIcon = (badge: string): string => {
  const icons: Record<string, string> = {
    Free: '⚙️',
    Starter: '⚡',
    Professional: '👑',
    Enterprise: '🏢',
  };
  return icons[badge] || '⭐';
};

/**
 * Get background gradient based on plan color
 */
const getPlanGradient = (color: string): string => {
  const gradients: Record<string, string> = {
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100',
  };
  return gradients[color] || 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-muted dark:to-muted';
};

/**
 * Get border color based on plan color
 */
const getBorderColor = (color: string): string => {
  const colors: Record<string, string> = {
    gray: 'border-gray-300',
    blue: 'border-blue-400',
    purple: 'border-purple-400',
    orange: 'border-orange-400',
  };
  return colors[color] || 'border-gray-300';
};

/* ------------------ FAQ SECTION ------------------ */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What's the difference between Credits and Subscription?",
      answer:
        'Credits are used for booking sessions and joining communities. Subscriptions unlock the ability to create communities and post projects.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Yes! You can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.',
    },
    {
      question: 'What happens to my projects if I downgrade?',
      answer:
        "Your existing projects and communities will remain active. However, you won't be able to create new ones beyond your new plan's limits.",
    },
    {
      question: 'Do I get a refund on the yearly plan if I cancel early?',
      answer:
        'We offer a pro-rated refund for the remaining months on yearly plans if you cancel within the first 6 months.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-card border-t border-border py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden hover:border-muted-foreground/50 transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition"
              >
                <span className="text-left font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/30 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------ PRICING CARD ------------------ */

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCenter: boolean;
  onSubscribe: (plan: SubscriptionPlan) => void;
  isProcessing: boolean;
  currentSubscription?: UserSubscription | null;
}

function PricingCard({ plan, isCenter, onSubscribe, isProcessing, currentSubscription }: PricingCardProps) {
  const isCurrentPlan = currentSubscription?.planId === plan.id;
  const isFree = plan.price === 0;

  return (
    <div
      className={`relative rounded-2xl p-8 transition-all duration-300 border-2 ${isCenter
        ? `${getBorderColor(plan.color)} shadow-2xl`
        : 'border-border'
        } ${getPlanGradient(plan.color)} dark:bg-card dark:bg-none`}
    >
      {/* Most Popular Badge */}
      {isCenter && !isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="text-4xl mb-4">{getPlanIcon(plan.badge)}</div>

      {/* Title & Badge */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
        <span className="text-xs px-2 py-1 bg-background rounded-full font-semibold text-foreground shadow-sm">
          {plan.badge}
        </span>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">₹{plan.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      {/* CTA Button */}
      {isCurrentPlan ? (
        <button
          disabled
          className="w-full py-3 px-4 rounded-lg font-medium mb-8 transition-colors bg-green-500 text-white cursor-default flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Current Plan
        </button>
      ) : (
        <button
          onClick={() => onSubscribe(plan)}
          disabled={isFree || isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium mb-8 transition-colors ${isFree
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : isCenter
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
              : 'bg-card text-foreground hover:bg-muted border border-border disabled:opacity-50'
            }`}
        >
          {isProcessing ? 'Processing...' : isFree ? 'Free Plan' : 'Subscribe Now'}
        </button>
      )}

      {/* Limits */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span className="text-lg">📌</span>
          <span className="font-medium">
            {plan.projectPosts === null
              ? 'Unlimited project posts'
              : `${plan.projectPosts} project post${plan.projectPosts !== 1 ? 's' : ''}/month`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span className="text-lg">👥</span>
          <span className="font-medium">
            {plan.createCommunity === null
              ? 'Unlimited communities'
              : `${plan.createCommunity} communit${plan.createCommunity !== 1 ? 'ies' : 'y'}`}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground mb-3">FEATURES INCLUDED:</p>
        {plan.features.map((feature) => (
          <div key={feature.id} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ PRICING CAROUSEL ------------------ */

interface PricingCarouselProps {
  plans: SubscriptionPlan[];
  currentSlide: number;
  onSlideChange: (slide: number) => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
  isProcessing: boolean;
  currentSubscription?: UserSubscription | null;
}

function PricingCarousel({ plans, currentSlide, onSlideChange, onSubscribe, isProcessing, currentSubscription }: PricingCarouselProps) {
  const getVisibleCards = () => {
    if (plans.length <= 3) {
      return plans;
    }

    if (currentSlide === 0) {
      return [plans[0], plans[1], plans[2]];
    } else if (currentSlide >= plans.length - 2) {
      return [plans[plans.length - 3], plans[plans.length - 2], plans[plans.length - 1]];
    }
    return [plans[currentSlide], plans[currentSlide + 1], plans[currentSlide + 2]];
  };

  const handlePrev = () => {
    onSlideChange(Math.max(0, currentSlide - 1));
  };

  const handleNext = () => {
    onSlideChange(Math.min(plans.length - 3, currentSlide + 1));
  };

  const visibleCards = getVisibleCards();
  const totalSlides = Math.max(1, plans.length - 2);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative">
        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {visibleCards.map((plan, index) => (
            <div
              key={plan.id}
              className={`transform transition-all duration-300 ${index === 1 ? 'md:scale-105' : 'md:scale-95'
                }`}
            >
              <PricingCard
                plan={plan}
                isCenter={index === 1}
                onSubscribe={onSubscribe}
                isProcessing={isProcessing}
                currentSubscription={currentSubscription}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {plans.length > 3 && (
          <>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="p-2 rounded-full border border-border hover:border-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Previous plans"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide >= totalSlides - 1}
                className="p-2 rounded-full border border-border hover:border-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Next plans"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onSlideChange(index)}
                  className={`h-2 rounded-full transition-all ${currentSlide === index ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-2'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------ MAIN PAGE (EXPORT) ------------------ */

export default function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  // Current subscription state
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);


  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success/Failure Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | undefined>(undefined);
  const [lastPaymentIntentId, setLastPaymentIntentId] = useState<string | undefined>(undefined);

  // Confirm Modal State
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriptionService.listPublicPlans();
      setPlans(response.plans);

      // Set initial slide to show Professional plan in center if available
      const professionalIndex = response.plans.findIndex((p) => p.badge === 'Professional');
      if (professionalIndex >= 0 && response.plans.length > 3) {
        setCurrentSlide(Math.max(0, professionalIndex - 1));
      } else if (response.plans.length > 3) {
        setCurrentSlide(1);
      } else {
        setCurrentSlide(0);
      }
    } catch (err: any) {
      console.error('Error loading plans:', err);
      setError(err.message || 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const subscription = await subscriptionService.getCurrentSubscription();
      setCurrentSubscription(subscription);
    } catch (err: any) {
      console.error('Error loading current subscription:', err);
      // Don't show error to user - just means they don't have a subscription
    } finally {
      // Done
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    // Skip payment for free plans
    if (plan.price === 0) {
      toast('This is a free plan', { icon: 'ℹ️' });
      return;
    }

    try {
      setIsProcessing(true);
      setSelectedPlan(plan);

      // Create payment intent with subscription metadata
      const response = await paymentService.createPaymentIntent({
        amount: plan.price,
        currency: 'INR',
        purpose: 'SUBSCRIPTION',
        metadata: {
          planId: plan.id,
          planName: plan.name,
          planBadge: plan.badge,
          billingInterval: 'MONTHLY', // Default to monthly as we removed the selector state
        },
      });

      setClientSecret(response.clientSecret);
      setIsPaymentModalOpen(true);
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast.error(error.message || 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // Update Redux state immediately to reflect in navbar
    if (selectedPlan) {
      dispatch(updateSubscription(selectedPlan.badge.toLowerCase()));
    }

    // Reload current subscription to get full data with expiry
    loadCurrentSubscription();

    // Wait slightly for modal transition
    setIsPaymentModalOpen(false);
    setLastPaymentIntentId(paymentIntentId);
    setShowSuccessModal(true);
  };

  const handlePaymentError = (errorMessage: string) => {
    setIsPaymentModalOpen(false);
    setPaymentError(errorMessage);
    setShowFailureModal(true);
  };

  const handleRetryPayment = () => {
    setShowFailureModal(false);
    setPaymentError(undefined);
    setIsPaymentModalOpen(true);
  };

  const handleContinueSuccess = () => {
    setShowSuccessModal(false);
    setLastPaymentIntentId(undefined);
    setSelectedPlan(null);
    setClientSecret('');
    // Navigate to profile page to see new subscription status
    navigate('/profile');
  };

  const handleCancelSubscription = () => {
    if (!currentSubscription) return;
    setShowCancelConfirm(true);
  };

  const confirmCancelSubscription = async () => {
    setShowCancelConfirm(false);

    try {
      await subscriptionService.cancelSubscription(false); // false = cancel at period end
      toast.success('Subscription will be canceled at the end of the billing period');
      // Reload subscription to show updated status
      await loadCurrentSubscription();
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    }
  };

  /* ------------------ REACTIVATE SUBSCRIPTION ------------------ */

  const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);

  const handleReactivateSubscription = () => {
    setShowReactivateConfirm(true);
  };

  const confirmReactivateSubscription = async () => {
    setShowReactivateConfirm(false);
    try {
      await subscriptionService.reactivateSubscription();
      toast.success('Subscription reactivated successfully!');
      await loadCurrentSubscription();
    } catch (error: any) {
      console.error('Error reactivating subscription:', error);
      toast.error(error.message || 'Failed to reactivate subscription');
    }
  };

  const handleUpgradeSubscription = () => {
    // Scroll to plans section
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    // Delay clearing critical state just in case user re-opens or similar, though usually fine to clear:
    // setClientSecret('');  
    // setSelectedPlan(null);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscription plans...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-card rounded-lg shadow-lg p-8 max-w-md mx-4">
            <div className="text-red-500 text-center mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-foreground text-center mb-2">Error Loading Plans</h2>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <button
              onClick={loadPlans}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="pt-12 pb-8 text-center px-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Unlock the full potential of SkillForge with premium features. Create communities, post projects, and grow
          your network.
        </p>
      </div>

      {/* Current Subscription Section */}
      {currentSubscription && (
        <div className="max-w-4xl mx-auto px-4 mb-12">

          <div className="max-w-4xl mx-auto px-4 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Current Subscription</h2>
            <CurrentSubscriptionCard
              subscription={currentSubscription}
              onCancel={handleCancelSubscription}
              onUpgrade={handleUpgradeSubscription}
              onReactivate={handleReactivateSubscription}
              isHighestTier={currentSubscription.planName?.toLowerCase().includes('enterprise')}
            />
          </div>
        </div>
      )}

      {/* Available Plans Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          {currentSubscription ? 'Available Plans' : 'Choose Your Plan'}
        </h2>
      </div>

      {/* Carousel Section */}
      <div className="px-4 pb-20">
        {plans.length === 0 ? (
          <div className="max-w-md mx-auto bg-card rounded-lg shadow-sm border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">No subscription plans available at this time.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
          <PricingCarousel
            plans={plans}
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            onSubscribe={handleSubscribe}
            isProcessing={isProcessing}
            currentSubscription={currentSubscription}
          />
        )}
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Payment Modal */}
      {/* 
        Only show payment modal if we have secrets, plan, and NOT showing success/failure 
        to avoid overlapping modals 
      */}
      {clientSecret && selectedPlan && !showSuccessModal && !showFailureModal && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          clientSecret={clientSecret}
          amount={selectedPlan.price}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

      {/* Success Modal */}
      {selectedPlan && (
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          transactionId={lastPaymentIntentId}
          onContinue={handleContinueSuccess}
        />
      )}

      {/* Failure Modal */}
      <PaymentFailureModal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        error={paymentError}
        onRetry={handleRetryPayment}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period."
        confirmText="Yes, Cancel"
        cancelText="Keep Subscription"
        type="danger"
      />

      {/* Reactivate Confirmation Modal */}
      <ConfirmModal
        isOpen={showReactivateConfirm}
        onCancel={() => setShowReactivateConfirm(false)}
        onConfirm={confirmReactivateSubscription}
        title="Reactivate Subscription"
        message="Are you sure you want to reactivate your subscription? This will undo the scheduled cancellation and auto-renew your plan."
        confirmText="Yes, Reactivate"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
}
