import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUserAvatar } from '../../store/slices/authSlice';
import { userProfileService } from '../../services/userProfileService';

/**
 * Component to sync user avatar from database to Redux on app load
 * This ensures the Navbar shows the correct avatar even after page refresh
 */
export default function AvatarSync() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only run for authenticated users
    if (!user) return;

    const syncAvatar = async () => {
      try {
        console.log('🔄 [AvatarSync] Syncing avatar from database...');
        console.log('🔄 [AvatarSync] Current Redux avatar:', user.avatar);
        
        // Fetch latest profile data
        const profile = await userProfileService.getProfile();
        
        console.log('🔄 [AvatarSync] Database avatar:', profile.avatarUrl);
        
        // Update Redux if avatar is different
        if (profile.avatarUrl && profile.avatarUrl !== user.avatar) {
          console.log('✅ [AvatarSync] Updating Redux avatar:', profile.avatarUrl);
          dispatch(updateUserAvatar(profile.avatarUrl));
        } else if (profile.avatarUrl) {
          console.log('✅ [AvatarSync] Avatar already in sync');
        } else {
          console.log('ℹ️ [AvatarSync] No avatar in database');
        }
      } catch (error) {
        // Silently fail - avatar sync is not critical
        console.error('❌ [AvatarSync] Failed to sync avatar:', error);
      }
    };

    // Sync avatar on mount
    syncAvatar();
  }, [user?.id, dispatch]); // Only re-run if user ID changes

  // This component doesn't render anything
  return null;
}
