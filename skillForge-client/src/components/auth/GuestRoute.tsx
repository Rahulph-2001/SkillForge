import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { isAdmin } from '../../config/userRole'

interface GuestRouteProps {
    children: React.ReactNode
    redirectTo?: string
}


export default function GuestRoute({
    children,
    redirectTo
}: GuestRouteProps) {
    const { user } = useAppSelector((state) => state.auth)


    if (user) {
        if (redirectTo) {
            return <Navigate to={redirectTo} replace />
        }
        // Default redirect based on role
        const defaultRoute = isAdmin(user.role) ? '/admin/dashboard' : '/home'
        return <Navigate to={defaultRoute} replace />
    }

    // User is not authenticated, allow access to guest pages
    return <>{children}</>
}

