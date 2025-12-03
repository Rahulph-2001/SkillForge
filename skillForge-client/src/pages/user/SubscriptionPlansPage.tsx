import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';
import subscriptionService, { SubscriptionPlan } from '../../services/subscriptionService';
import { useAppSelector } from '../../store/hooks';

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
  return gradients[color] || 'bg-gradient-to-br from-gray-50 to-gray-100';
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
    <div className="bg-white border-t border-gray-200 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="text-left font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
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
  userPlan?: string;
}

function PricingCard({ plan, isCenter, userPlan }: PricingCardProps) {
  const isCurrentPlan = userPlan === plan.name;

  return (
    <div
      className={`relative rounded-2xl p-8 transition-all duration-300 border-2 ${
        isCenter
          ? `${getBorderColor(plan.color)} shadow-2xl`
          : 'border-gray-200'
      } ${getPlanGradient(plan.color)}`}
    >
      {/* Most Popular Badge */}
      {isCenter && !isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="inline-block px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="text-4xl mb-4">{getPlanIcon(plan.badge)}</div>

      {/* Title & Badge */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <span className="text-xs px-2 py-1 bg-white rounded-full font-semibold text-gray-700 shadow-sm">
          {plan.badge}
        </span>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
          <span className="text-gray-600">/month</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-medium mb-8 transition-colors ${
          isCurrentPlan
            ? 'bg-green-500 text-white cursor-default'
            : isCenter
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
        }`}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? '✓ Current Plan' : 'Subscribe Now'}
      </button>

      {/* Limits */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg">📌</span>
          <span className="font-medium">
            {plan.projectPosts === null
              ? 'Unlimited project posts'
              : `${plan.projectPosts} project post${plan.projectPosts !== 1 ? 's' : ''}/month`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg">👥</span>
          <span className="font-medium">
            {plan.communityPosts === null
              ? 'Unlimited communities'
              : `${plan.communityPosts} communit${plan.communityPosts !== 1 ? 'ies' : 'y'}`}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-700 mb-3">FEATURES INCLUDED:</p>
        {plan.features.map((feature) => (
          <div key={feature.id} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{feature.name}</span>
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
  userPlan?: string;
}

function PricingCarousel({ plans, currentSlide, onSlideChange, userPlan }: PricingCarouselProps) {
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
              className={`transform transition-all duration-300 ${
                index === 1 ? 'md:scale-105' : 'md:scale-95'
              }`}
            >
              <PricingCard plan={plan} isCenter={index === 1} userPlan={userPlan} />
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
                className="p-2 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Previous plans"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide >= totalSlides - 1}
                className="p-2 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Next plans"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onSlideChange(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-blue-500 w-8' : 'bg-gray-300 w-2'
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
  const { user } = useAppSelector((state) => state.auth);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  // Create properly formatted user object for Navbar
  const displayUser = user ? {
    name: user.name,
    avatar: user.avatar || undefined,
    credits: user.credits,
    subscriptionPlan: 'free', // Default to free to encourage upgrades
  } : undefined;

  useEffect(() => {
    loadPlans();
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar isAuthenticated={!!user} user={displayUser} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription plans...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar isAuthenticated={!!user} user={displayUser} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
            <div className="text-red-500 text-center mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Error Loading Plans</h2>
            <p className="text-gray-600 text-center mb-4">{error}</p>
            <button
              onClick={loadPlans}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <Navbar isAuthenticated={!!user} user={displayUser} />

      {/* Header */}
      <div className="pt-12 pb-8 text-center px-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Unlock the full potential of SkillForge with premium features. Create communities, post projects, and grow
          your network.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="px-4 pb-20">
        {plans.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">No subscription plans available at this time.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
          <PricingCarousel
            plans={plans}
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            userPlan={undefined}
          />
        )}
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
