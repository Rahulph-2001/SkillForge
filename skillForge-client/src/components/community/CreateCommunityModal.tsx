import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { createCommunity } from '../../services/communityService';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';

interface CreateCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CATEGORIES = [
    'Technology',
    'Languages',
    'Music',
    'Fitness',
    'Creative',
    'Professional',
    'Business',
];

export default function CreateCommunityModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateCommunityModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: CATEGORIES[0],
        creditsCost: 0,
        creditsPeriod: 'monthly',
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed');
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        console.log('=== CREATE COMMUNITY SUBMIT ===');
        console.log('Form data:', formData);
        console.log('Image:', image);

        try {
            const communityData = {
                ...formData,
                image: image || undefined,
            };
            console.log('Sending data to API:', communityData);

            const result = await createCommunity(communityData);
            console.log('API Response:', result);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({
                    name: '',
                    description: '',
                    category: CATEGORIES[0],
                    creditsCost: 0,
                    creditsPeriod: 'monthly',
                });
                setImage(null);
                setImagePreview(null);
                onClose();
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err: any) {
            console.error('=== CREATE COMMUNITY ERROR ===');
            console.error('Full error:', err);
            console.error('Error response:', err.response);
            console.error('Error data:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to create community');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                        <h2 className="text-2xl font-bold text-gray-900">Create Community</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Community Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Community Name
                            </label>
                            <input
                                type="text"
                                required
                                minLength={3}
                                maxLength={100}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., React Developers"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                required
                                minLength={10}
                                maxLength={1000}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                                placeholder="Tell people what your community is about..."
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Credits */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Credits Cost
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.creditsCost}
                                    onChange={(e) =>
                                        setFormData({ ...formData, creditsCost: parseInt(e.target.value) || 0 })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Cost to join (0 for free)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                                <input
                                    type="text"
                                    value={formData.creditsPeriod}
                                    onChange={(e) => setFormData({ ...formData, creditsPeriod: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., monthly, one-time"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Community Image
                            </label>
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="text-sm text-gray-500">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Community'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modals */}
            <SuccessModal
                isOpen={showSuccess}
                title="Community Created!"
                message="Your community has been created successfully."
                onClose={() => setShowSuccess(false)}
            />

            <ErrorModal isOpen={!!error} message={error || ''} onClose={() => setError(null)} />
        </>
    );
}
