import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { authService } from '../../services/authService'


export default function UserStatusMonitor() {
    const { user } = useAppSelector((state) => state.auth)
    const location = useLocation()

    // Check status on every route change or page refresh
    useEffect(() => {
        // Only run for authenticated users
        if (!user) return

        const validateStatus = async () => {
            try {
                await authService.validateUserStatus()
            } catch (error: unknown) {
                const err = error as { response?: { status?: number } };
                // If validation fails with 403, user is suspended
                // The API interceptor will handle the logout and redirect
                if (err?.response?.status === 403) {
                    console.log('[UserStatusMonitor] User account suspended, API interceptor handling logout')
                }
                // Silently ignore 429 (rate limit) errors
                if (err?.response?.status === 429) {
                    console.log('[UserStatusMonitor] Rate limit hit, relying on backend middleware')
                }
            }
        }

        // IMMEDIATE validation on route change or page load
        void validateStatus()

    }, [user, location.pathname]) // Triggers on every navigation

    // Check when user returns to the tab (visibility change)
    useEffect(() => {
        if (!user) return

        const handleVisibilityChange = async () => {
            // When user comes back to the tab, immediately check status
            if (document.visibilityState === 'visible') {
                try {
                    await authService.validateUserStatus()
                } catch (error: unknown) {
                    const err = error as { response?: { status?: number } };
                    if (err?.response?.status === 403) {
                        console.log('[UserStatusMonitor] Tab focus - User suspended')
                    }
                    // Silently ignore rate limit errors
                    if (err?.response?.status === 429) {
                        console.log('[UserStatusMonitor] Rate limit hit on tab focus')
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [user])

    // This component doesn't render anything
    return null
}
