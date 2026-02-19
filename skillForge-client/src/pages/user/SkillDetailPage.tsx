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

import { useAppSelector } from '../../store/hooks';
import { skillDetailsService, SkillDetail } from '../../services/skillDetailsService';
import { bookingService } from '../../services/bookingService';
import BookSessionModal, { BookingData } from '../../components/booking/BookSessionModal';
import BookingSuccessModal from '../../components/booking/BookingSuccessModal';
import { toast } from 'react-hot-toast';

export default function SkillDetailPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastBookingDetails, setLastBookingDetails] = useState<{
    date: string;
    time: string;
  } | null>(null);

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

    const requestPayload = {
      skillId: skill.id,
      providerId: skill.provider.id,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      message: bookingData.message,
    };

    try {
      const response = await bookingService.createBooking(requestPayload);
      console.log('✅ [SkillDetailPage] Booking created successfully:', response);

      setIsBookingModalOpen(false);
      setLastBookingDetails({
        date: bookingData.preferredDate,
        time: bookingData.preferredTime,
      });
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.error('❌ [SkillDetailPage] Failed to create booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleShare = () => {
    if (navigator.share && skill) {
      navigator.share({
        title: skill.title,
        text: skill.description,
        url: window.location.href,
      }).catch(() => {
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
      <div className="min-h-screen bg-background">
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (!skill) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button Header */}
      <div className="bg-card px-6 py-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition"
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
            <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-gradient-to-br from-primary/10 via-secondary to-muted">
              {skill.imageUrl ? (
                <img
                  src={skill.imageUrl}
                  alt={skill.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-9xl font-bold text-primary drop-shadow-lg">
                    {skill.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {skill.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star
                        size={20}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-semibold text-foreground">
                        {Number(skill.rating).toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({skill.totalSessions} sessions)
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium">
                      {skill.level}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 hover:bg-muted rounded-full transition"
                  >
                    <Heart
                      size={24}
                      className={
                        isLiked
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground'
                      }
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-muted rounded-full transition"
                  >
                    <Share2 size={24} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* About This Skill */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                About This Skill
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {skill.description}
              </p>
            </div>

            {/* Duration */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Session Details</h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock size={20} className="text-primary" />
                <span>
                  Session duration: {skill.durationHours} hour{skill.durationHours !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Tags */}
            {skill.tags.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">
                  Related Topics
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {skill.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition cursor-pointer"
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
            <div className="bg-card rounded-lg p-6 space-y-6 sticky top-8 shadow-lg border border-border">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <DollarSign size={24} className="text-green-600" />
                <span className="text-4xl font-bold text-foreground">
                  {skill.creditsPerHour}
                </span>
                <span className="text-muted-foreground">credits/hr</span>
              </div>

              {/* Session Duration */}
              <div className="flex items-center gap-3 text-muted-foreground pb-4 border-b border-border">
                <Clock size={20} className="text-primary" />
                <span>
                  {skill.durationHours} hour{skill.durationHours !== 1 ? 's' : ''} per session
                </span>
              </div>

              {/* Book Button */}
              {skill.availability ? (
                <button
                  onClick={handleBookSession}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
              ) : (
                <div className="w-full bg-muted border-2 border-input text-muted-foreground font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
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
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Provider Not Available
                </div>
              )}

              {/* Cancellation Info */}
              <p className="text-sm text-muted-foreground text-center pt-2 border-t border-border">
                Free cancellation up to 24 hours before session
              </p>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* About the Provider */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  About the Provider
                </h3>

                {/* Provider Card */}
                <div className="flex items-start gap-4">
                  {skill.provider.avatarUrl ? (
                    <img
                      src={skill.provider.avatarUrl}
                      alt={skill.provider.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-border shadow-md"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shadow-md ${skill.provider.avatarUrl ? 'hidden' : ''}`}
                  >
                    <span className="text-primary font-bold text-xl">
                      {skill.provider.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">
                      {skill.provider.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {skill.provider.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {Number(skill.provider.rating).toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({skill.provider.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  onClick={handleViewProviderProfile}
                  className="w-full py-2 px-4 border border-input text-foreground font-semibold rounded-lg hover:bg-muted transition"
                >
                  View Profile
                </button>
              </div>

              {/* Availability Status */}
              {!skill.availability && (
                <>
                  <div className="border-t border-border" />
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-500 mb-1">
                          Provider Availability Not Set
                        </h4>
                        <p className="text-sm text-yellow-800 dark:text-yellow-400">
                          This provider has not set their availability schedule yet. Please contact them directly or check back later.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Availability Schedule */}
              {skill.availability && skill.availability.weeklySchedule && (
                <>
                  <div className="border-t border-border" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Weekly Availability
                    </h3>

                    <div className="bg-muted/40 rounded-lg p-4 border border-border">
                      <div className="space-y-3">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                          const schedule = skill.availability!.weeklySchedule[day];
                          const isAvailable = schedule && schedule.enabled && schedule.slots.length > 0;

                          return (
                            <div key={day} className="flex items-start justify-between text-sm group">
                              <span className={`font-medium w-24 ${isAvailable ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {day}
                              </span>
                              <div className="flex-1 text-right">
                                {isAvailable ? (
                                  <div className="space-y-1">
                                    {schedule.slots.map((slot, idx) => {
                                      const formatTime = (time: string) => {
                                        const [h, m] = time.split(':');
                                        const hour = parseInt(h);
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        const hour12 = hour % 12 || 12;
                                        return `${hour12}:${m} ${ampm}`;
                                      };
                                      return (
                                        <div key={idx} className="inline-block bg-card px-2 py-1 rounded border border-border text-primary font-medium text-xs shadow-sm ml-2">
                                          {formatTime(slot.start)} - {formatTime(slot.end)}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-xs italic">Unavailable</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {skill.availability.timezone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 px-3 py-2 rounded-lg">
                        <span className="font-medium">Timezone:</span>
                        <span>{skill.availability.timezone}</span>
                      </div>
                    )}
                  </div>

                  {/* Booked Slots Indicator */}
                  {skill.availability.bookedSlots && skill.availability.bookedSlots.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="text-sm font-bold text-foreground mb-2">Provider Schedule (Busy)</h4>
                      <div className="flex flex-wrap gap-2">
                        {skill.availability.bookedSlots.slice(0, 5).map((slot, idx) => (
                          <span key={idx} className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded border border-destructive/20" title={`Busy with: ${slot.title}`}>
                            {new Date(slot.date).toLocaleDateString()} {slot.startTime} ({slot.title})
                          </span>
                        ))}
                        {skill.availability.bookedSlots.length > 5 && (
                          <span className="px-2 py-1 text-muted-foreground text-xs font-medium">+{skill.availability.bookedSlots.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
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
          providerId={skill.provider.id}
          providerName={skill.provider.name}
          sessionCost={skill.creditsPerHour * skill.durationHours}
          userBalance={user?.credits || 0}
          onBookSession={handleBookingSubmit}
          availability={skill.availability || undefined}
        />
      )}

      {/* Success Modal */}
      {skill && lastBookingDetails && (
        <BookingSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          bookingDetails={{
            skillTitle: skill.title,
            providerName: skill.provider.name,
            date: lastBookingDetails.date,
            time: lastBookingDetails.time,
          }}
        />
      )}
    </div>
  );
}
