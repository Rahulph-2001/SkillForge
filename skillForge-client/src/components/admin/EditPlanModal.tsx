import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import { SubscriptionPlan, SubscriptionFeature } from '../../services/subscriptionService';
import featureService, { Feature } from '../../services/featureService';
import { toast } from 'react-toastify';

interface EditPlanModalProps {
    plan: SubscriptionPlan | null;
    isOpen: boolean;
    onSave: (plan: Partial<SubscriptionPlan> & { features: any[] }) => void;
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
        createCommunity: null as number | null,
        badge: 'Starter' as 'Free' | 'Starter' | 'Professional' | 'Enterprise',
        color: 'blue',
        features: [] as Partial<SubscriptionFeature>[],
    });

    const [libraryFeatures, setLibraryFeatures] = useState<Feature[]>([]);
    const [showLibrarySelect, setShowLibrarySelect] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingLibrary, setLoadingLibrary] = useState(false);

    // Load library features on mount
    useEffect(() => {
        if (isOpen) {
            loadLibraryFeatures();
        }
    }, [isOpen]);

    const loadLibraryFeatures = async () => {
        try {
            setLoadingLibrary(true);
            const response = await featureService.listLibraryFeatures(); // Assuming listLibraryFeatures returns { features: [...] } or directly [...]
            setLibraryFeatures(response.features);
        } catch (error) {
            console.error('Failed to load library features', error);
            toast.error('Failed to load library features');
        } finally {
            setLoadingLibrary(false);
        }
    };

    // Initialize form data when plan changes
    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                price: plan.price,
                projectPosts: plan.projectPosts,
                createCommunity: plan.createCommunity,
                badge: plan.badge,
                color: plan.color,
                features: plan.features.map(f => ({ ...f })), // Clone features
            });
        } else {
            // Reset for new plan
            setFormData({
                name: '',
                price: 0,
                projectPosts: null,
                createCommunity: null,
                badge: 'Starter',
                color: 'blue',
                features: [],
            });
        }
        setErrors({});
        setShowLibrarySelect(false);
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
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Feature Management
    const addCustomFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, {
                name: '',
                featureType: 'BOOLEAN',
                isEnabled: true,
                displayOrder: prev.features.length,
                isHighlighted: false
            }],
        }));
        setShowLibrarySelect(false);
    };

    const addFromLibrary = (libraryFeature: Feature) => {
        // Check if already added
        const exists = formData.features.some(f => f.name === libraryFeature.name);
        if (exists) {
            toast.warning('Feature already exists in this plan');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, {
                name: libraryFeature.name,
                description: libraryFeature.description,
                featureType: libraryFeature.featureType,
                limitValue: libraryFeature.limitValue,
                isEnabled: true,
                displayOrder: prev.features.length,
                isHighlighted: libraryFeature.isHighlighted || false
            }],
        }));
        setShowLibrarySelect(false);
    };

    const updateFeature = (index: number, updates: Partial<SubscriptionFeature>) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = { ...newFeatures[index], ...updates };
        setFormData((prev) => ({ ...prev, features: newFeatures }));
    };

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Plan name is required';
        if (formData.price < 0) newErrors.price = 'Price cannot be negative';
        if (formData.badge === 'Free' && formData.price !== 0) newErrors.price = 'Free plan must have price of 0';
        if (formData.badge !== 'Free' && formData.price === 0) newErrors.price = 'Paid plans must have a price greater than 0';

        const emptyFeatures = formData.features.some((f) => !f.name?.trim());
        if (emptyFeatures) newErrors.features = 'All features must have a name';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const planToSave = {
            ...(plan?.id && { id: plan.id }),
            ...formData,
        };

        onSave(planToSave as any);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in flex flex-col border border-border">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {plan ? 'Edit Plan' : 'Create New Plan'}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            Configure plan details and features
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Plan Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Plan Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Plan Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 bg-background border ${errors.name ? 'border-destructive' : 'border-border'} rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground`}
                                placeholder="e.g. Starter"
                            />
                            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Badge *</label>
                            <select
                                name="badge"
                                value={formData.badge}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                            >
                                <option value="Free">Free</option>
                                <option value="Starter">Starter</option>
                                <option value="Professional">Professional</option>
                                <option value="Enterprise">Enterprise</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 bg-background border ${errors.price ? 'border-destructive' : 'border-border'} rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground`}
                            />
                            {errors.price && <p className="text-destructive text-xs mt-1">{errors.price}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Project Posts</label>
                                <input
                                    type="number"
                                    name="projectPosts"
                                    value={formData.projectPosts ?? ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                    placeholder="Unlimited"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Create Community</label>
                                <input
                                    type="number"
                                    name="createCommunity"
                                    value={formData.createCommunity ?? ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                    placeholder="Unlimited"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Color Theme</label>
                            <select
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                            >
                                <option value="gray">Gray</option>
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="orange">Orange</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column: Features */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center border-b border-border pb-2">
                            <h3 className="text-lg font-semibold text-foreground">Features</h3>
                            <div className="relative">
                                <button
                                    onClick={() => setShowLibrarySelect(!showLibrarySelect)}
                                    className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors border border-primary/20"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Feature
                                    <ChevronDown className="w-3 h-3" />
                                </button>

                                {showLibrarySelect && (
                                    <div className="absolute right-0 mt-2 w-64 bg-card rounded-md shadow-xl border border-border z-20 max-h-60 overflow-y-auto">
                                        <div className="p-2 border-b border-border bg-muted/40 sticky top-0">
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Master Library</h4>
                                        </div>
                                        {loadingLibrary ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                                        ) : libraryFeatures.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">No library features found</div>
                                        ) : (
                                            libraryFeatures.map(f => (
                                                <button
                                                    key={f.id}
                                                    onClick={() => addFromLibrary(f)}
                                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                                >
                                                    {f.name}
                                                </button>
                                            ))
                                        )}
                                        <div className="border-t border-border mt-1 pt-1 p-2">
                                            <button
                                                onClick={addCustomFeature}
                                                className="w-full text-center text-xs text-primary hover:text-primary/80 font-medium"
                                            >
                                                + Create Custom Feature
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {formData.features.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                                    No features added yet. Add from the Master Library or create custom ones.
                                </div>
                            )}

                            {formData.features.map((feature, index) => (
                                <div key={index} className="bg-muted/40 rounded-lg p-4 border border-border group hover:border-primary/50 transition-colors">
                                    <div className="flex gap-4 items-start">
                                        {/* Name & Type */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={feature.name}
                                                    onChange={(e) => updateFeature(index, { name: e.target.value })}
                                                    className="flex-1 px-2 py-1 bg-background border border-border rounded text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
                                                    placeholder="Feature Name"
                                                />
                                                <select
                                                    value={feature.featureType}
                                                    onChange={(e) => updateFeature(index, { featureType: e.target.value as any })}
                                                    className="w-32 px-2 py-1 bg-background border border-border rounded text-xs text-muted-foreground"
                                                >
                                                    <option value="BOOLEAN">Boolean</option>
                                                    <option value="NUMERIC_LIMIT">Limit</option>
                                                    <option value="TEXT">Text</option>
                                                </select>
                                            </div>
                                            <input
                                                type="text"
                                                value={feature.description || ''}
                                                onChange={(e) => updateFeature(index, { description: e.target.value })}
                                                className="w-full px-2 py-1 border border-transparent rounded text-xs text-muted-foreground bg-transparent focus:bg-background focus:border-border transition-colors"
                                                placeholder="Description (optional)"
                                            />
                                        </div>

                                        {/* Configuration */}
                                        <div className="w-32 flex flex-col gap-2">
                                            {feature.featureType === 'NUMERIC_LIMIT' && (
                                                <div className="flex items-center gap-2 bg-background px-2 py-1 rounded border border-border">
                                                    <label className="text-xs text-muted-foreground font-mono">Max:</label>
                                                    <input
                                                        type="number"
                                                        value={feature.limitValue ?? ''}
                                                        onChange={(e) => updateFeature(index, { limitValue: parseInt(e.target.value) })}
                                                        className="w-full text-sm font-semibold text-right focus:outline-none bg-transparent text-foreground"
                                                        placeholder="∞"
                                                    />
                                                </div>
                                            )}

                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={feature.isEnabled}
                                                    onChange={(e) => updateFeature(index, { isEnabled: e.target.checked })}
                                                    className="w-4 h-4 text-primary rounded focus:ring-primary border-border bg-background"
                                                />
                                                <span className="text-xs text-muted-foreground">Enabled</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={feature.isHighlighted}
                                                    onChange={(e) => updateFeature(index, { isHighlighted: e.target.checked })}
                                                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500 border-border bg-background"
                                                />
                                                <span className={`text-xs ${feature.isHighlighted ? 'text-yellow-500 font-medium' : 'text-muted-foreground'}`}>
                                                    Highlighted
                                                </span>
                                            </label>
                                        </div>

                                        {/* Action */}
                                        <button
                                            onClick={() => removeFeature(index)}
                                            className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.features && <p className="text-destructive text-sm">{errors.features}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-muted/40 border-t border-border p-6 flex justify-end gap-3 mt-auto">
                    <button onClick={onCancel} className="px-4 py-2 text-foreground font-semibold border border-border rounded-lg hover:bg-muted transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-sm transition-colors">
                        Save Plan
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
        </div>
    );
};

export default EditPlanModal;
