import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Star,
  Loader2,
  DollarSign,
} from 'lucide-react';
import Navbar from '../../components/shared/Navbar/Navbar';
import { useAppSelector } from '../../store/hooks';
import { skillDetailsService, SkillDetail } from '../../services/skillDetailsService';
import { bookingService } from '../../services/bookingService';
import BookSessionModal, { BookingData } from '../../components/booking/BookSessionModal';
import { toast } from 'react-hot-toast';

export default function SkillDetailPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (skillId) {
      fetchSkillDetails();
    }
  }, [skillId]);

  const fetchSkillDetails = async () => {
    try {
      setLoading(true);
      const data = await skillDetailsService.getSkillDetails(skillId!);
      setSkill(data);
    } catch (error: any) {
      console.error('Failed to fetch skill details:', error);
      toast.error(error.response?.data?.message || 'Failed to load skill details');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData: BookingData) => {
    console.log('🟢 [SkillDetailPage] handleBookingSubmit called');
    console.log('🟢 [SkillDetailPage] Booking data received:', bookingData);
    
    if (!skill) {
      console.error('❌ [SkillDetailPage] No skill data available');
      return;
    }

    console.log('🟢 [SkillDetailPage] Skill data:', {
      skillId: skill.id,
      skillTitle: skill.title,
      providerId: skill.provider.id,
      providerName: skill.provider.name,
      creditsPerHour: skill.creditsPerHour,
      durationHours: skill.durationHours,
    });

    const requestPayload = {
      skillId: skill.id,
      providerId: skill.provider.id,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      message: bookingData.message,
    };

    console.log('🟢 [SkillDetailPage] Request payload:', requestPayload);

    try {
      console.log('🟢 [SkillDetailPage] Calling bookingService.createBooking...');
      
      const response = await bookingService.createBooking(requestPayload);
      
      console.log('✅ [SkillDetailPage] Booking created successfully:', response);
      
      toast.success('Booking request sent successfully!');
      setIsBookingModalOpen(false);
    } catch (error: any) {
      console.error('❌ [SkillDetailPage] Failed to create booking:', error);
      console.error('❌ [SkillDetailPage] Error response:', error.response);
      console.error('❌ [SkillDetailPage] Error data:', error.response?.data);
      console.error('❌ [SkillDetailPage] Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      console.error('❌ [SkillDetailPage] Error message:', errorMessage);
      
      toast.error(errorMessage);
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleShare = () => {
    if (navigator.share && skill) {
      navigator.share({
        title: skill.title,
        text: skill.description,
        url: window.location.href,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleViewProviderProfile = () => {
    if (skill) {
      navigate(`/provider/${skill.provider.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          isAuthenticated={!!user}
          user={user ? {
            name: user.name,
            avatar: user.avatar || undefined,
            credits: user.credits,
            subscriptionPlan: 'free'
          } : undefined}
        />
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (!skill) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={!!user}
        user={user ? {
          name: user.name,
          avatar: user.avatar || undefined,
          credits: user.credits,
          subscriptionPlan: 'free'
        } : undefined}
      />

      {/* Back Button Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Skills</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Banner Image */}
            <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
              {skill.imageUrl ? (
                <img
                  src={skill.imageUrl}
                  alt={skill.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-9xl font-bold text-white drop-shadow-lg">
                    {skill.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {skill.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star
                        size={20}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-semibold text-gray-900">
                        {skill.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({skill.totalSessions} sessions)
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                      {skill.level}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Heart
                      size={24}
                      className={
                        isLiked
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Share2 size={24} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* About This Skill */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                About This Skill
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {skill.description}
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={20} className="text-blue-600" />
                <span>
                  Session duration: {skill.durationHours} hour{skill.durationHours !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Tags */}
            {skill.tags.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Related Topics
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {skill.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 hover:bg-blue-100 transition cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 space-y-6 sticky top-8 shadow-lg border border-gray-200">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <DollarSign size={24} className="text-green-600" />
                <span className="text-4xl font-bold text-gray-900">
                  {skill.creditsPerHour}
                </span>
                <span className="text-gray-600">credits/hr</span>
              </div>

              {/* Session Duration */}
              <div className="flex items-center gap-3 text-gray-600 pb-4 border-b border-gray-200">
                <Clock size={20} className="text-blue-600" />
                <span>
                  {skill.durationHours} hour{skill.durationHours !== 1 ? 's' : ''} per session
                </span>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookSession}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book a Session
              </button>

              {/* Cancellation Info */}
              <p className="text-sm text-gray-600 text-center pt-2 border-t border-gray-200">
                Free cancellation up to 24 hours before session
              </p>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* About the Provider */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  About the Provider
                </h3>

                {/* Provider Card */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">
                      {skill.provider.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {skill.provider.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {skill.provider.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {skill.provider.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({skill.provider.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  onClick={handleViewProviderProfile}
                  className="w-full py-2 px-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {skill && (
        <BookSessionModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          skillTitle={skill.title}
          providerName={skill.provider.name}
          sessionCost={skill.creditsPerHour * skill.durationHours}
          userBalance={user?.credits || 0}
          onBookSession={handleBookingSubmit}
        />
      )}
    </div>
  );
}
