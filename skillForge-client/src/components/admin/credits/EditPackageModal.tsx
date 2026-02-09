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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-1">Edit Credit Package</h2>
                <p className="text-gray-600 text-sm mb-6">Update package details and pricing</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Credits
                        </label>
                        <input
                            type="number"
                            name="credits"
                            value={formData.credits}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Price (₹)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700 text-sm font-medium">Mark as popular</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700 text-sm font-medium">Active package</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
