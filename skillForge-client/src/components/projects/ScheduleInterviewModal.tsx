import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Clock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import projectApplicationService from '../../services/projectApplicationService';
import { SuccessModal } from '../common/Modal'; // Import reusable SuccessModal

const scheduleInterviewSchema = z.object({
    scheduledAt: z.string().min(1, 'Date and time is required').refine((val) => new Date(val) > new Date(), {
        message: "Date must be in the future"
    }),
    durationMinutes: z.number().min(15, 'Minimum duration is 15 minutes').max(120, 'Maximum duration is 120 minutes'),
});

type ScheduleInterviewFormData = z.infer<typeof scheduleInterviewSchema>;

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId: string;
    onScheduled: () => void;
}

export default function ScheduleInterviewModal({ isOpen, onClose, applicationId, onScheduled }: ScheduleInterviewModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ScheduleInterviewFormData>({
        resolver: zodResolver(scheduleInterviewSchema),
        defaultValues: {
            durationMinutes: 30,
        }
    });

    const onSubmit = async (data: ScheduleInterviewFormData) => {
        try {
            setIsLoading(true);
            const scheduledDate = new Date(data.scheduledAt);

            await projectApplicationService.scheduleInterview({
                applicationId,
                scheduledAt: scheduledDate,
                durationMinutes: data.durationMinutes,
            });

            // Show success modal instead of closing immediately
            setShowSuccess(true);
            reset();
            onScheduled(); // Refresh parent data in background
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to schedule interview');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    // If success state, show the reusable SuccessModal
    if (showSuccess) {
        return (
            <SuccessModal
                isOpen={true} // Always open when in this state
                title="Interview Scheduled!"
                message="The interview has been successfully scheduled. The candidate will be notified."
                onClose={handleSuccessClose}
                autoCloseDelay={2000} // Optional: auto close after 2s
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md border border-border animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Schedule Interview</h2>
                        <p className="text-sm text-muted-foreground mt-1">Set up a video call with the candidate</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    {/* Date & Time */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Date & Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="datetime-local"
                                {...register('scheduledAt')}
                                className={`w-full bg-background border ${errors.scheduledAt ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-border focus:border-ring focus:ring-ring/20'} rounded-xl py-3 pl-10 pr-4 text-foreground text-sm focus:outline-none focus:ring-4 transition-all`}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                        {errors.scheduledAt && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                {errors.scheduledAt.message}
                            </p>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <select
                                {...register('durationMinutes', { valueAsNumber: true })}
                                className={`w-full bg-background border ${errors.durationMinutes ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-border focus:border-ring focus:ring-ring/20'} rounded-xl py-3 pl-10 pr-4 text-foreground text-sm focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer`}
                            >
                                <option value={15}>15 minutes (Quick Chat)</option>
                                <option value={30}>30 minutes (Standard)</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>1 hour (Deep Dive)</option>
                                <option value={90}>1.5 hours</option>
                                <option value={120}>2 hours</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        {errors.durationMinutes && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium">
                                {errors.durationMinutes.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-medium text-foreground bg-muted border border-border rounded-xl hover:bg-muted/80 hover:text-foreground transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                'Confirm Schedule'
                            )}
                        </button>
                    </div>
                </form>
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
}
