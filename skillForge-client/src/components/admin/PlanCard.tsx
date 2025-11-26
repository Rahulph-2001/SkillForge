import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { SubscriptionPlan } from '../../services/subscriptionService';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (planId: string) => void;
}

const getBgColor = (color: string): string => {
  const colors: Record<string, string> = {
    gray: 'bg-gray-50 border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-300',
  };
  return colors[color] || 'bg-white border-gray-200';
};

const getBadgeColor = (color: string): string => {
  const colors: Record<string, string> = {
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  return colors[color] || 'bg-gray-500';
};


const getBorderColor = (color: string): string => {
  const colors: Record<string, string> = {
    gray: 'border-gray-300',
    blue: 'border-blue-300',
    purple: 'border-purple-300',
    orange: 'border-orange-300',
  };
  return colors[color] || 'border-gray-300';
};


const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => {
  return (
    <div
      className={`rounded-lg border-2 ${getBorderColor(plan.color)} p-6 ${getBgColor(plan.color)} transition-all hover:shadow-lg`}
    >
      {/* Header with Badge and Actions */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={`${getBadgeColor(plan.color)} text-white text-xs font-semibold px-3 py-1 rounded`}
        >
          {plan.badge}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(plan)}
            className="p-2 hover:bg-white rounded-md transition-colors"
            aria-label={`Edit ${plan.name} plan`}
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(plan.id)}
            className="p-2 hover:bg-white rounded-md transition-colors"
            aria-label={`Delete ${plan.name} plan`}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Plan Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>

      {/* Price */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900 mb-1">₹{plan.price}</p>
        <p className="text-sm text-gray-600">per month</p>
      </div>

      {/* Limits */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg" aria-hidden="true">📌</span>
          {plan.projectPosts === null
            ? 'Unlimited project posts'
            : `${plan.projectPosts} project post${plan.projectPosts !== 1 ? 's' : ''}`}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg" aria-hidden="true">👥</span>
          {plan.communityPosts === null
            ? 'Unlimited community posts'
            : `${plan.communityPosts} community post${plan.communityPosts !== 1 ? 's' : ''}`}
        </div>
      </div>

      {/* Features */}
      <div className="pt-4 border-t border-gray-300">
        <p className="text-xs font-semibold text-gray-700 mb-3">Features:</p>
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature.id} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 flex-shrink-0" aria-hidden="true">✓</span>
              <span>{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
