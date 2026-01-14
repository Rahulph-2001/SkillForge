import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Wallet,
  Zap,
  TrendingUp,
  Star,
  Calendar,
  Clock,
  Monitor,
  CreditCard,
  User as UserIcon,
  Loader2,
} from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUserAvatar } from '../../store/slices/authSlice';
import { userProfileService, UserProfile } from '../../services/userProfileService';
import { toast } from 'react-hot-toast';

interface Session {
  id: number;
  title: string;
  instructor: string;
  instructorImage: string;
  date: string;
  time: string;
  type: string;
  credits: number;
  confirmed: boolean;
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, _setSessions] = useState<Session[]>([]);
  // TODO: Fetch sessions from backend when endpoint is ready
  // const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userProfileService.getProfile();
      setProfile(data);

      // Update Redux state if avatar changed
      if (data.avatarUrl && data.avatarUrl !== user?.avatar) {
        console.log('🔵 [UserProfilePage] Updating Redux avatar:', data.avatarUrl);
        dispatch(updateUserAvatar(data.avatarUrl));
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleRedeemCredits = () => {
    toast.success('Redeem credits feature coming soon!');
  };

  const handleManageAllSessions = () => {
    navigate('/sessions');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="flex flex-col justify-center items-center py-20">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  const subscriptionPlan = profile.subscriptionPlan || 'free';
  const isPro = subscriptionPlan.toLowerCase() !== 'free';

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-white font-bold text-xl">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                <p className="text-sm text-gray-600 mb-1">{profile.location || 'San Francisco, CA'}</p>
                <p className="text-xs text-gray-500 mb-3">Member since {formatDate(profile.memberSince)}</p>
              </div>
              {/* Edit Profile Button */}
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Edit Profile
              </button>
            </div>
            <p className="text-sm text-gray-700">
              {profile.bio || 'Passionate about learning and sharing knowledge'}
            </p>
          </div>
        </div>

        {/* Professional Plan */}
        <div className="border border-blue-200 rounded-xl p-5 mb-6 bg-blue-50/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={18} className="text-blue-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  {isPro ? 'Professional Plan' : 'Free Plan'}
                </h2>
                <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                  active
                </span>
              </div>
              <p className="text-xs text-gray-600 ml-6">
                {profile.subscriptionValidUntil
                  ? `Valid until ${formatDate(profile.subscriptionValidUntil)}`
                  : 'No expiration'}
              </p>
            </div>
            <button
              onClick={() => navigate('/plans')}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md border border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md transition-all text-xs font-medium flex items-center gap-1"
            >
              <span>⬆</span> Upgrade Plan
            </button>
          </div>

          {/* Plan Details Grid */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-blue-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Price</p>
              <p className="text-lg font-semibold text-blue-600">
                {isPro ? '₹599/month' : '₹0/month'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Project Posts</p>
              <p className="text-lg font-semibold text-gray-900">
                {(profile.projectPostLimit === null || profile.projectPostLimit === -1)
                  ? 'Unlimited'
                  : Math.max(0, profile.projectPostLimit - profile.projectPostUsage)}
                <span className="text-xs text-gray-500 font-normal"> remaining</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Communities</p>
              <p className="text-lg font-semibold text-gray-900">
                {(profile.communityCreateLimit === null || profile.communityCreateLimit === -1)
                  ? 'Unlimited'
                  : Math.max(0, profile.communityCreateLimit - profile.communityCreateUsage)}
                <span className="text-xs text-gray-500 font-normal"> remaining</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3 mb-8">
          {/* Wallet Balance */}
          <div className="flex-1 bg-teal-50 border border-teal-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="text-teal-600" size={16} />
              <p className="text-xs text-gray-600 font-medium">Wallet Balance</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">₹ {profile?.walletBalance || 0}</p>
            <p className="text-xs text-gray-500">available for withdrawal</p>
          </div>

          {/* Credits */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="text-gray-600" size={16} />
              <p className="text-xs text-gray-600 font-medium">Credits</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{profile?.credits || 0}</p>
            <p className="text-xs text-gray-500 mb-2">worth ₹{(profile?.credits || 0) * 50}</p>
            <button
              onClick={handleRedeemCredits}
              className="text-blue-600 text-xs font-semibold hover:text-blue-700 hover:underline transition-all"
            >
              Redeem
            </button>
          </div>

          {/* Skills Offered */}
          <div className="flex-1 bg-teal-50 border border-teal-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-teal-600" size={16} />
              <p className="text-xs text-gray-600 font-medium">Skills Offered</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{profile?.skillsOffered || 0}</p>
            <p className="text-xs text-gray-500">active skills</p>
          </div>

          {/* Rating */}
          <div className="flex-1 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-yellow-500" size={16} />
              <p className="text-xs text-gray-600 font-medium">Rating</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {profile?.rating ? Number(profile.rating).toFixed(1) : '0.0'}
            </p>
            <p className="text-xs text-gray-500">{profile?.reviewCount || 0} reviews</p>
          </div>

          {/* Upcoming */}
          <div className="flex-1 bg-teal-50 border border-teal-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-teal-600" size={16} />
              <p className="text-xs text-gray-600 font-medium">Upcoming</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{sessions.length}</p>
            <p className="text-xs text-gray-500">sessions booked</p>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-0.5">Upcoming Sessions</h2>
              <p className="text-xs text-gray-500">Your scheduled learning sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleManageAllSessions}
                className="text-gray-700 text-sm font-medium hover:text-gray-900 hover:underline transition-all"
              >
                Manage All Sessions
              </button>
              <button
                onClick={() => navigate('/explore')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md transition-all text-sm font-medium flex items-center gap-1.5"
              >
                <span className="text-base">+</span> Book New Session
              </button>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <Calendar className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-md">
                  You don't have any scheduled sessions yet. Browse skills and book a session to start learning!
                </p>
                <button
                  onClick={() => navigate('/explore')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md transition-all text-sm font-medium"
                >
                  Browse Skills
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Session Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={session.instructorImage}
                        alt={session.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%234F46E5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="white"%3E📚%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>

                    {/* Session Details */}
                    <div className="flex-grow">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{session.title}</h3>
                      <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-600">
                        <UserIcon size={14} />
                        <span>with {session.instructor}</span>
                      </div>

                      {/* Session Meta */}
                      <div className="flex flex-wrap gap-4 mb-2 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar size={14} />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock size={14} />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Monitor size={14} />
                          <span>{session.type}</span>
                        </div>
                      </div>

                      {/* Credits and Status */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={14} className="text-gray-500" />
                          <span className="text-xs text-gray-600">{session.credits} credits</span>
                        </div>
                        {session.confirmed && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-xs text-green-600">Confirmed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md border border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md transition-all text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                        💬 Join Session
                      </button>
                      <button className="text-blue-600 text-xs font-medium hover:text-blue-700 hover:underline transition-all">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
