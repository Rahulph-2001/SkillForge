import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { SkillResponse, CreateSkillPayload } from '../../services/skillService';
import ImageCropper from '../common/imageCropper';

interface EditSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, data: Partial<CreateSkillPayload>, imageFile?: File) => Promise<void>;
    skill: SkillResponse;
}

const COMMON_TAGS = [
    'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
    'UI/UX Design', 'Graphic Design', 'Digital Marketing', 'SEO',
    'Content Writing', 'Video Editing', 'Photography', 'Music Production',
    'Business Strategy', 'Project Management', 'Leadership', 'Communication',
    'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++',
    'HTML/CSS', 'SQL', 'Git', 'Docker', 'AWS', 'Azure'
];

export default function EditSkillModal({ isOpen, onClose, onSubmit, skill }: EditSkillModalProps) {
    const [formData, setFormData] = useState<Partial<CreateSkillPayload>>({
        title: '',
        description: '',
        durationHours: 0,
        creditsHour: 0,
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Cropper State
    const [showCropper, setShowCropper] = useState(false);
    const [cropperImageSrc, setCropperImageSrc] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (skill) {
            setFormData({
                title: skill.title,
                description: skill.description,
                durationHours: skill.durationHours,
                creditsHour: skill.creditsPerHour,
                tags: skill.tags,
            });
            // Set existing image as preview
            if (skill.imageUrl) {
                setImagePreview(skill.imageUrl);
            }
        }
    }, [skill]);

    useEffect(() => {
        // Filter tags based on input, or show all if input is empty
        const availableTags = COMMON_TAGS.filter(tag => !formData.tags?.includes(tag));

        if (tagInput.trim()) {
            const filtered = availableTags.filter(tag =>
                tag.toLowerCase().includes(tagInput.toLowerCase())
            );
            setFilteredTags(filtered);
        } else {
            setFilteredTags(availableTags);
        }
    }, [tagInput, formData.tags]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCropperImageSrc(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again if needed
        e.target.value = '';
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        // Create a File from the Blob
        const file = new File([croppedBlob], "skill-image.jpg", { type: "image/jpeg" });
        setImageFile(file);

        // Create preview URL
        const previewUrl = URL.createObjectURL(croppedBlob);
        setImagePreview(previewUrl);

        setShowCropper(false);
        setCropperImageSrc('');
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setCropperImageSrc('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Exclude title from updates as it's not editable
            const { title, ...updates } = formData;
            await onSubmit(skill.id, updates, imageFile || undefined);
            onClose();
        } catch (error) {
            console.error('Failed to update skill:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = (tag: string) => {
        if (tag.trim() && !formData.tags?.includes(tag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tag.trim()]
            }));
        }
        setTagInput('');
        setShowTagSuggestions(false);
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tagInput.trim()) {
                handleAddTag(tagInput);
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove)
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl my-8">
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Skill</h2>
                    <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid gap-6">
                        {/* Title - Read Only */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Skill Title <span className="text-xs text-gray-500">(Cannot be changed)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                disabled
                                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Skill Image</label>
                            <div className="flex items-start gap-4">
                                {imagePreview && (
                                    <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200">
                                        <img
                                            src={imagePreview}
                                            alt="Skill preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                    </button>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Recommended: 800x600px, max 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Duration */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Duration (Hours)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.durationHours}
                                    onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            {/* Credits */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Credits per Hour</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.creditsHour}
                                    onChange={(e) => setFormData({ ...formData, creditsHour: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Tags with Suggestions */}
                        <div className="relative">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tags <span className="text-xs text-gray-500">(Select from options or type custom)</span>
                            </label>
                            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                {formData.tags?.map((tag) => (
                                    <span key={tag} className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm text-blue-700">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="text-blue-400 hover:text-blue-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInputKeyDown}
                                    onFocus={() => setShowTagSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                                    placeholder={formData.tags?.length === 0 ? "Select or type tags..." : ""}
                                    className="flex-1 bg-transparent outline-none min-w-[150px]"
                                />
                            </div>

                            {/* Tag Suggestions Dropdown */}
                            {showTagSuggestions && filteredTags.length > 0 && (
                                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                    {filteredTags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleAddTag(tag)}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && cropperImageSrc && (
                <ImageCropper
                    imageSrc={cropperImageSrc}
                    onCancel={handleCropCancel}
                    onCropComplete={handleCropComplete}
                    aspect={16 / 9}
                />
            )}
        </div>
    );
}
