import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CreditPackage } from '../../../services/adminCreditService';

interface EditPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, data: EditPackageData) => Promise<void>;
    packageToEdit: CreditPackage | null;
}

export interface EditPackageData {
    credits: number;
    price: number;
    isPopular: boolean;
    isActive: boolean;
}

export default function EditPackageModal({ isOpen, onClose, onSubmit, packageToEdit }: EditPackageModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<EditPackageData>({
        credits: 0,
        price: 0,
        isPopular: false,
        isActive: true,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (packageToEdit) {
            setFormData({
                credits: packageToEdit.credits,
                price: packageToEdit.price,
                isPopular: packageToEdit.isPopular,
                isActive: packageToEdit.isActive,
            });
        }
    }, [packageToEdit]);

    if (!isOpen || !packageToEdit) return null;

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
            await onSubmit(packageToEdit.id, formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update package');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-md w-full p-6 relative border border-border shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-foreground mb-1">Edit Credit Package</h2>
                <p className="text-muted-foreground text-sm mb-6">Update package details and pricing</p>

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
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
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
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                            placeholder="e.g. 5000"
                            required
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPopular"
                                checked={formData.isPopular}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary bg-background"
                            />
                            <span className="text-foreground text-sm font-medium">Mark as popular</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary bg-background"
                            />
                            <span className="text-foreground text-sm font-medium">Active package</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
