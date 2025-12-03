import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ReviewsTab from '../../components/profile/ReviewsTab';
import AboutTab from '../../components/profile/AboutTab';
import { providerService, ProviderProfile } from '../../services/providerService';

export default function ProviderProfilePage() {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reviews' | 'about'>('reviews');
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (providerId) {
      fetchProviderProfile(providerId);
    }
  }, [providerId]);

  const fetchProviderProfile = async (id: string) => {
    try {
      setLoading(true);
      const data = await providerService.getProviderProfile(id);
      setProfile(data);
    } catch (error: any) {
      console.error('Failed to fetch provider profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <button
            onClick={handleBack}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="px-6 py-4 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Stats */}
      <div className="px-6 py-8 grid grid-cols-3 gap-8 border-b border-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{profile.rating}</div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
            <span className="text-yellow-400">★</span> Rating
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{profile.reviewCount}</div>
          <div className="text-sm text-gray-600">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{profile.totalSessionsCompleted}</div>
          <div className="text-sm text-gray-600">Sessions</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="px-6 py-8">
        {activeTab === 'reviews' && (
          <ReviewsTab
            providerId={profile.id}
            averageRating={profile.rating}
            totalReviews={profile.reviewCount}
          />
        )}
        {activeTab === 'about' && (
          <AboutTab
            profile={profile}
          />
        )}
      </div>
    </main>
  );
}
