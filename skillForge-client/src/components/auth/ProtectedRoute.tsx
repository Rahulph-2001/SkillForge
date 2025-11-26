import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: string[]
    redirectTo?: string
    preventAdminAccess?: boolean // If true, prevents admin from accessing user routes
    preventUserAccess?: boolean // If true, prevents regular users from accessing admin routes
}


export default function ProtectedRoute({
    children,
    allowedRoles = [],
    redirectTo = '/login',
    preventAdminAccess = false,
    preventUserAccess = false
}: ProtectedRouteProps) {
    const { user } = useAppSelector((state) => state.auth)
    const location = useLocation()

    // Not authenticated
    if (!user) {
        return <Navigate to={redirectTo} replace state={{ from: location }} />
    }

    // Prevent admin from accessing user routes
    if (preventAdminAccess && user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />
    }

    // Prevent regular users from accessing admin routes
    if (preventUserAccess && user.role !== 'admin') {
        return <Navigate to="/home" replace />
    }

    // Check role if allowedRoles is specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // User doesn't have required role
        // Redirect admin to admin dashboard, regular users to home
        const fallbackRoute = user.role === 'admin' ? '/admin/dashboard' : '/home'
        return <Navigate to={fallbackRoute} replace />
    }

    // User is authenticated and has required role
    return <>{children}</>
}
