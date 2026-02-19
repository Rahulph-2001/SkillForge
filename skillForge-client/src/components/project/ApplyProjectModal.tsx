import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Project } from '../../services/projectService';
import projectApplicationService from '../../services/projectApplicationService';
import { toast } from 'react-hot-toast';

interface ApplyProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onSuccess?: () => void;
}

export default function ApplyProjectModal({
    isOpen,
    onClose,
    project,
    onSuccess,
}: ApplyProjectModalProps) {
    const [formData, setFormData] = useState({
        coverLetter: '',
        proposedDuration: '',
        proposedBudget: project.budget,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.coverLetter.trim()) {
            toast.error('Please write a cover letter');
            return;
        }

        if (formData.coverLetter.length < 50) {
            toast.error('Cover letter must be at least 50 characters');
            return;
        }

        if (!formData.proposedDuration.trim()) {
            toast.error('Please provide a proposed duration');
            return;
        }

        try {
            setIsSubmitting(true);
            await projectApplicationService.applyToProject(project.id, {
                coverLetter: formData.coverLetter.trim(),
                proposedDuration: formData.proposedDuration.trim(),
                proposedBudget: formData.proposedBudget,
            });

            toast.success('Application submitted successfully!');
            if (onSuccess) onSuccess();
            onClose();

            // Reset form
            setFormData({
                coverLetter: '',
                proposedDuration: '',
                proposedBudget: project.budget,
            });
        } catch (error: any) {
            console.error('Failed to submit application:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Apply for Project</h2>
                        <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Cover Letter */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Cover Letter <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={formData.coverLetter}
                            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                            placeholder="Explain why you're the best fit for this project. Highlight your relevant experience and skills..."
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder-muted-foreground"
                            minLength={50}
                            maxLength={5000}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>Min 50 characters</span>
                            <span>{formData.coverLetter.length}/5000</span>
                        </div>
                    </div>

                    {/* Proposed Duration */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Proposed Duration <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.proposedDuration}
                            onChange={(e) => setFormData({ ...formData, proposedDuration: e.target.value })}
                            placeholder="e.g., 4 weeks, 2 months"
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            How long will it take you to complete this project?
                        </p>
                    </div>

                    {/* Proposed Budget */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Proposed Budget (Credits)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.proposedBudget}
                            onChange={(e) => setFormData({ ...formData, proposedBudget: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Project budget: {project.budget.toLocaleString()} credits
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm text-foreground">
                            <strong>Note:</strong> Your application will be reviewed by the project creator.
                            We use advanced AI to highlight your most relevant skills to the employer.
                        </p>
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
                            className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
