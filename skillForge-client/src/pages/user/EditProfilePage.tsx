import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2, Save } from 'lucide-react';
import Navbar from '../../components/shared/Navbar/Navbar';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUserAvatar } from '../../store/slices/authSlice';
import { userProfileService, UserProfile } from '../../services/userProfileService';
import { toast } from 'react-hot-toast';
import ImageCropper from '../../components/shared/imageCropper';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

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
      setFormData({
        name: data.name,
        bio: data.bio || '',
        location: data.location || '',
      });
      setAvatarPreview(data.avatarUrl);
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Create preview for cropper
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    // Convert blob to file
    const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    setAvatarFile(croppedFile);
    
    // Create preview from blob
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(croppedBlob);
    
    setShowCropper(false);
    setTempImageSrc(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🟣 [EditProfilePage] Form submitted');
    console.log('🟣 [EditProfilePage] Form data:', formData);
    console.log('🟣 [EditProfilePage] Avatar file present:', !!avatarFile);
    if (avatarFile) {
      console.log('🟣 [EditProfilePage] Avatar file details:', {
        name: avatarFile.name,
        type: avatarFile.type,
        size: avatarFile.size,
        lastModified: avatarFile.lastModified
      });
    }

    try {
      setSaving(true);

      const updateData = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        ...(avatarFile && { avatar: avatarFile }),
      };

      console.log('🟣 [EditProfilePage] Update data prepared:', {
        name: updateData.name,
        bio: updateData.bio,
        location: updateData.location,
        hasAvatar: !!updateData.avatar
      });

      console.log('🟣 [EditProfilePage] Calling updateProfile service...');
      const response = await userProfileService.updateProfile(updateData);
      console.log('✅ [EditProfilePage] Profile updated successfully');
      console.log('🟣 [EditProfilePage] Response:', response);

      // Update Redux state with new avatar URL if avatar was uploaded
      if (avatarFile && response.avatarUrl) {
        console.log('🟣 [EditProfilePage] Updating Redux state with new avatar:', response.avatarUrl);
        dispatch(updateUserAvatar(response.avatarUrl));
      }

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('❌ [EditProfilePage] Failed to update profile:', error);
      console.error('❌ [EditProfilePage] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          isAuthenticated={!!user}
          user={user ? {
            name: user.name,
            credits: user.credits,
            subscriptionPlan: 'free',
            avatar: profile?.avatarUrl || undefined
          } : undefined}
        />
        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={!!user}
        user={user ? {
          name: user.name,
          credits: user.credits,
          subscriptionPlan: 'free',
          avatar: avatarPreview || undefined
        } : undefined}
      />

      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Profile</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white font-bold text-4xl">
                      {formData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                  <Camera size={20} />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-3">
                Click the camera icon to upload a new photo (max 5MB)
              </p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCancel={handleCropCancel}
          onCropComplete={handleCropComplete}
          aspect={1} // Square aspect ratio for profile pictures
        />
      )}
    </div>
  );
}
