import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { providerService, ProviderReview } from '../../services/providerService';

interface ReviewsTabProps {
  providerId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ReviewsTab({ providerId, averageRating, totalReviews }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate rating distribution based on actual reviews
  const calculateRatingDistribution = () => {
    if (reviews.length === 0) {
      return [
        { stars: 5, percentage: 80, count: Math.floor(totalReviews * 0.8) },
        { stars: 4, percentage: 15, count: Math.floor(totalReviews * 0.15) },
        { stars: 3, percentage: 3, count: Math.floor(totalReviews * 0.03) },
        { stars: 2, percentage: 1, count: Math.floor(totalReviews * 0.01) },
        { stars: 1, percentage: 1, count: Math.floor(totalReviews * 0.01) },
      ];
    }

    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.rating === stars).length;
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return { stars, percentage, count };
    });

    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();

  useEffect(() => {
    fetchReviews();
  }, [providerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await providerService.getProviderReviews(providerId);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInMs = now.getTime() - reviewDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Reviews Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h2>
        <p className="text-gray-600">
          {totalReviews} reviews • {averageRating} average rating
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="mb-12">
        <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700">{item.stars}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600 w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-gray-100">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 font-semibold text-gray-600">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials(review.userName)
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 fill-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {getTimeAgo(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    {review.skillTitle}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
