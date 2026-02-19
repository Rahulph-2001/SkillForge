import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface CreatePackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePackageData) => Promise<void>;
}

export interface CreatePackageData {
    credits: number;
    price: number;
    isPopular: boolean;
    isActive: boolean;
}

export default function CreatePackageModal({ isOpen, onClose, onSubmit }: CreatePackageModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreatePackageData>({
        credits: 100,
        price: 0,
        isPopular: false,
        isActive: true, // Default to active
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.credits <= 0) {
            setError('Credits must be greater than 0');
            return;
        }
        if (formData.price < 0) {
            setError('Price cannot be negative');
            return;
        }

        try {
            setLoading(true);
            await onSubmit(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create package');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-md w-full p-6 relative border border-border shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-foreground mb-1">Create New Package</h2>
                <p className="text-muted-foreground text-sm mb-6">Configure credit package details and pricing</p>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Credits
                        </label>
                        <input
                            type="number"
                            name="credits"
                            value={formData.credits}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g. 100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Price (₹)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g. 5000"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Recommended: ₹60-75 per credit (Redemption rate: ₹50/credit)
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPopular"
                                checked={formData.isPopular}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                            />
                            <span className="text-foreground text-sm font-medium">Mark as popular</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                            />
                            <span className="text-foreground text-sm font-medium">Active package</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-input text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Package
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
