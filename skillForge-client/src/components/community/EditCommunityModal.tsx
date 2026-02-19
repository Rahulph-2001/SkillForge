import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { updateCommunity, Community } from '../../services/communityService';
import ImageCropper from '../common/imageCropper';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';

interface EditCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    community: Community;
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

export default function EditCommunityModal({
    isOpen,
    onClose,
    community,
    onSuccess,
}: EditCommunityModalProps) {
    const [formData, setFormData] = useState({
        name: community.name,
        description: community.description,
        category: community.category,
        creditsCost: community.creditsCost,
        creditsPeriod: community.creditsPeriod,
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(community.imageUrl);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Image cropper states
    const [showCropper, setShowCropper] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: community.name,
                description: community.description,
                category: community.category,
                creditsCost: community.creditsCost,
                creditsPeriod: community.creditsPeriod,
            });
            setImagePreview(community.imageUrl);
            setImage(null);
            setSelectedImage(null);
        }
    }, [isOpen, community]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        // Convert blob to File
        const file = new File([croppedBlob], 'community-image.jpg', { type: 'image/jpeg' });
        setImage(file);
        setImagePreview(URL.createObjectURL(croppedBlob));
        setShowCropper(false);
        setSelectedImage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await updateCommunity(community.id, {
                ...formData,
                image: image || undefined,
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update community');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                    {/* Header */}
                    <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center z-10">
                        <h2 className="text-2xl font-bold text-foreground">Edit Community</h2>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Community Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Community Name
                            </label>
                            <input
                                type="text"
                                required
                                minLength={3}
                                maxLength={100}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Description
                            </label>
                            <textarea
                                required
                                minLength={10}
                                maxLength={1000}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder-muted-foreground"
                                rows={4}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
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
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Credits Cost
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.creditsCost}
                                    onChange={(e) =>
                                        setFormData({ ...formData, creditsCost: parseInt(e.target.value) || 0 })
                                    }
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Period</label>
                                <input
                                    type="text"
                                    value={formData.creditsPeriod}
                                    onChange={(e) => setFormData({ ...formData, creditsPeriod: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                />
                            </div>
                        </div>

                        {/* Image Upload with Cropper */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Community Image
                            </label>
                            {imagePreview ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="w-full px-4 py-2 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        Change Image
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                                        <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && selectedImage && (
                <ImageCropper
                    imageSrc={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setShowCropper(false);
                        setSelectedImage(null);
                    }}
                    aspect={16 / 9}
                />
            )}

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                title="Community Updated!"
                message="Your community has been updated successfully."
                onClose={() => setShowSuccess(false)}
            />

            {/* Error Modal */}
            <ErrorModal isOpen={!!error} message={error || ''} onClose={() => setError(null)} />
        </>
    );
}
