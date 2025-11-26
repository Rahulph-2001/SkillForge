import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { SubscriptionPlan, SubscriptionFeature } from '../../services/subscriptionService';

interface EditPlanModalProps {
  plan: SubscriptionPlan | null;
  isOpen: boolean;
  onSave: (plan: Partial<SubscriptionPlan> & { features: Omit<SubscriptionFeature, 'id'>[] }) => void;
  onCancel: () => void;
}


const EditPlanModal: React.FC<EditPlanModalProps> = ({
  plan,
  isOpen,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    projectPosts: null as number | null,
    communityPosts: null as number | null,
    badge: 'Starter' as 'Free' | 'Starter' | 'Professional' | 'Enterprise',
    color: 'blue',
    features: [] as { name: string }[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when plan changes
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        projectPosts: plan.projectPosts,
        communityPosts: plan.communityPosts,
        badge: plan.badge,
        color: plan.color,
        features: plan.features.map((f) => ({ name: f.name })),
      });
    } else {
      // Reset for new plan
      setFormData({
        name: '',
        price: 0,
        projectPosts: null,
        communityPosts: null,
        badge: 'Starter',
        color: 'blue',
        features: [],
      });
    }
    setErrors({});
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number' ? (value === '' ? null : Number(value)) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureChange = (index: number, newName: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { name: newName };
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { name: '' }],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.badge === 'Free' && formData.price !== 0) {
      newErrors.price = 'Free plan must have price of 0';
    }

    if (formData.badge !== 'Free' && formData.price === 0) {
      newErrors.price = 'Paid plans must have a price greater than 0';
    }

    const emptyFeatures = formData.features.filter((f) => !f.name.trim());
    if (emptyFeatures.length > 0) {
      newErrors.features = 'All features must have a name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const planToSave = {
      ...(plan?.id && { id: plan.id }),
      name: formData.name,
      price: formData.price,
      projectPosts: formData.projectPosts,
      communityPosts: formData.communityPosts,
      badge: formData.badge,
      color: formData.color,
      features: formData.features,
    };

    onSave(planToSave);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-plan-modal-title"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <div>
            <h2
              id="edit-plan-modal-title"
              className="text-2xl font-bold text-gray-900"
            >
              {plan ? 'Edit Plan' : 'Create New Plan'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Update pricing, limits, and features for this subscription plan
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Plan Name */}
          <div>
            <label
              htmlFor="plan-name"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Plan Name *
            </label>
            <input
              id="plan-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="e.g., Starter"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Badge */}
          <div>
            <label
              htmlFor="plan-badge"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Badge *
            </label>
            <select
              id="plan-badge"
              name="badge"
              value={formData.badge}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Free">Free</option>
              <option value="Starter">Starter</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          {/* Monthly Price */}
          <div>
            <label
              htmlFor="plan-price"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Monthly Price (₹) *
            </label>
            <input
              id="plan-price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="299"
              min="0"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          {/* Project Posts per Month */}
          <div>
            <label
              htmlFor="project-posts"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Project Posts per Month
            </label>
            <input
              id="project-posts"
              type="number"
              name="projectPosts"
              value={formData.projectPosts ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3"
              min="0"
            />
            <p className="text-gray-500 text-xs mt-1">
              Leave empty for unlimited
            </p>
          </div>

          {/* Community Posts per Month */}
          <div>
            <label
              htmlFor="community-posts"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Community Posts per Month
            </label>
            <input
              id="community-posts"
              type="number"
              name="communityPosts"
              value={formData.communityPosts ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1"
              min="0"
            />
            <p className="text-gray-500 text-xs mt-1">
              Leave empty for unlimited
            </p>
          </div>

          {/* Color */}
          <div>
            <label
              htmlFor="plan-color"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Color Theme
            </label>
            <select
              id="plan-color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gray">Gray</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
            </select>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Features
            </label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={feature.name}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    aria-label={`Delete feature ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {errors.features && (
              <p className="text-red-500 text-xs mt-1">{errors.features}</p>
            )}

            <button
              onClick={addFeature}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add new feature
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditPlanModal;
