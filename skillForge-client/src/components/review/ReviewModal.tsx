import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { videoCallService } from '../../services/videoCallService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ReviewModalProps {
    bookingId: string;
    onSubmitted: () => void;
}

export default function ReviewModal({ bookingId, onSubmitted }: ReviewModalProps) {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (review.trim().length < 10) {
            toast.error('Review must be at least 10 characters');
            return;
        }

        try {
            setIsSubmitting(true);
            await videoCallService.createReview({
                bookingId,
                rating,
                review,
            });
            toast.success('Review submitted successfully!');
            onSubmitted();
            navigate('/dashboard/user/sessions'); // Redirect to sessions or home
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="bg-[#0A0F29] px-6 py-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Session Completed!</h2>
                    <p className="text-gray-400">Please rate your experience with the mentor</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`w-10 h-10 ${(hoverRating || rating) >= star
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            {rating === 5 && 'Excellent!'}
                            {rating === 4 && 'Very Good'}
                            {rating === 3 && 'Good'}
                            {rating === 2 && 'Fair'}
                            {rating === 1 && 'Poor'}
                            {rating === 0 && 'Select a rating'}
                        </p>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Your Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your experience... (min 10 characters)"
                            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                            required
                        />
                        <p className="text-xs text-right text-gray-400">
                            {review.length}/2000
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0 || review.trim().length < 10}
                        className="w-full flex items-center justify-center gap-2 bg-[#0A0F29] text-white py-3.5 rounded-xl font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit Review
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
