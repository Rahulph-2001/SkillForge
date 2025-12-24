import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';

import StatCard from '../../components/admin/StatCard';
import PlanCard from '../../components/admin/PlanCard';
import EditPlanModal from '../../components/admin/EditPlanModal';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import SuccessModal from '../../components/common/Modal/SuccessModal';
import subscriptionService, {
  SubscriptionPlan,
  SubscriptionStats,
  SubscriptionFeature,
} from '../../services/subscriptionService';


const SubscriptionManagement: React.FC = () => {
  // State Management
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [plansResponse, statsResponse] = await Promise.all([
        subscriptionService.listPlans(),
        subscriptionService.getStats(),
      ]);

      setPlans(plansResponse.plans);
      setStats(statsResponse);
    } catch (err: any) {
      console.error('Error loading subscription data:', err);
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit button click
   */
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  /**
   * Handle delete button click
   */
  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm and execute plan deletion
   */
  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await subscriptionService.deletePlan(planToDelete);

      // Remove from local state
      setPlans((prev) => prev.filter((p) => p.id !== planToDelete));

      setShowDeleteConfirm(false);
      setPlanToDelete(null);
      setSuccessMessage('Plan deleted successfully');
      setShowSuccessModal(true);

      // Reload stats
      const statsResponse = await subscriptionService.getStats();
      setStats(statsResponse);
    } catch (err: any) {
      console.error('Error deleting plan:', err);
      setError(err.message || 'Failed to delete plan');
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    }
  };

  /**
   * Handle create new plan button click
   */
  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setShowEditModal(true);
  };

  /**
   * Handle save plan (create or update)
   */
  const handleSavePlan = async (
    updatedPlan: Partial<SubscriptionPlan> & {
      features: Omit<SubscriptionFeature, 'id'>[];
    }
  ) => {
    try {
      const planData = {
        name: updatedPlan.name!,
        price: updatedPlan.price!,
        projectPosts: updatedPlan.projectPosts ?? null,
        createCommunity: updatedPlan.createCommunity ?? null,
        features: updatedPlan.features,
        badge: updatedPlan.badge!,
        color: updatedPlan.color!,
      };

      if (selectedPlan?.id) {
        // Update existing plan
        const updated = await subscriptionService.updatePlan(
          selectedPlan.id,
          planData
        );
        setPlans((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setSuccessMessage('Plan updated successfully');
      } else {
        // Create new plan
        const created = await subscriptionService.createPlan(planData);
        setPlans((prev) => [...prev, created]);
        setSuccessMessage('Plan created successfully');
      }

      setShowEditModal(false);
      setSelectedPlan(null);
      setShowSuccessModal(true);

      // Reload stats
      const statsResponse = await subscriptionService.getStats();
      setStats(statsResponse);
    } catch (err: any) {
      console.error('Error saving plan:', err);
      setError(err.message || 'Failed to save plan');
      setShowEditModal(false);
      setSelectedPlan(null);
    }
  };

  /**
   * Handle modal close
   */
  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedPlan(null);
  };

  // Loading State
  if (loading) {
    return (
      <>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription data...</p>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error && !stats) {
    return (
      <>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-red-500 text-center mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 text-center mb-4">{error}</p>
            <button
              onClick={loadData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>

      <div className="min-h-screen bg-gray-50 p-8 font-sans antialiased">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription Management
            </h1>
          </div>
          <p className="text-gray-600">
            Monitor subscriptions and manage plans
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon="₹"
              label="Total Revenue"
              value={`₹${stats.totalRevenue}`}
              bgColor="bg-green-100"
            />
            <StatCard
              icon="📈"
              label="Monthly Recurring"
              value={`₹${stats.monthlyRecurring}`}
              bgColor="bg-purple-100"
            />
            <StatCard
              icon="👤"
              label="Active Subscriptions"
              value={stats.activeSubscriptions}
              bgColor="bg-blue-100"
            />
            <StatCard
              icon="👑"
              label="Paid Users"
              value={stats.paidUsers}
              bgColor="bg-yellow-100"
            />
            <StatCard
              icon="👤"
              label="Free Users"
              value={stats.freeUsers}
              bgColor="bg-gray-100"
            />
          </div>
        )}

        {/* Error Banner (if any error occurred after initial load) */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 underline text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Plans Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Current Subscription Plans
              </h2>
              <p className="text-gray-600">
                Manage pricing and features for all subscription tiers
              </p>
            </div>
            <button
              onClick={handleCreatePlan}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              + Create New Plan
            </button>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">No subscription plans found</p>
              <button
                onClick={handleCreatePlan}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <EditPlanModal
          plan={selectedPlan}
          isOpen={showEditModal}
          onSave={handleSavePlan}
          onCancel={handleCloseModal}
        />

        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Delete Subscription Plan"
          message="Are you sure you want to delete this plan? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setPlanToDelete(null);
          }}
          type="danger"
        />

        <SuccessModal
          isOpen={showSuccessModal}
          title="Success"
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </>
  );
};

export default SubscriptionManagement;
