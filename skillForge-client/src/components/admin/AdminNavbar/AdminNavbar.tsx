import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../store/hooks'
import { logout } from '../../../store/slices/authSlice'
import { clearPersistedState } from '../../../store/persistUtils'

import { useLocation } from 'react-router-dom';

export default function AdminNavbar() {
    const location = useLocation();
    const currentPath = location.pathname;

    // Helper to determine active tab based on path
    const getActiveTab = (path: string) => {
        if (path === '/admin/dashboard') return 'Dashboard';
        if (path.startsWith('/admin/users')) return 'Users';
        if (path.startsWith('/admin/skills')) return 'Skills';
        if (path.startsWith('/admin/skill-templates')) return 'Skill Templates';
        if (path.startsWith('/admin/projects')) return 'Projects';
        if (path.startsWith('/admin/subscriptions')) return 'Subscriptions';
        if (path.startsWith('/admin/feature-management')) return 'Feature Management';
        if (path.startsWith('/admin/sessions')) return 'Sessions';
        if (path.startsWith('/admin/wallet')) return 'Wallet';
        if (path.startsWith('/admin/credits')) return 'Credits';
        if (path.startsWith('/admin/communities')) return 'Communities';
        if (path.startsWith('/admin/reports')) return 'Reports';
        return '';
    };

    const activeTab = getActiveTab(currentPath);
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        try {
            // Logout from backend and clear Redux state
            await dispatch(logout()).unwrap()

            // Clear persisted state from localStorage
            await clearPersistedState()

            // Navigate to admin login page
            navigate('/admin/login')
        } catch (error) {
            console.error('Logout error:', error)

            // Even if logout fails, clear local state and redirect
            await clearPersistedState()
            navigate('/admin/login')
        }
    }

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Skills', path: '/admin/skills' },
        { label: 'Skill Templates', path: '/admin/skill-templates' },
        { label: 'Projects', path: '/admin/projects' },
        { label: 'Subscriptions', path: '/admin/subscriptions' },
        { label: 'Feature Management', path: '/admin/feature-management' },
        { label: 'Sessions', path: '/admin/sessions' },
        { label: 'Wallet', path: '/admin/wallet' },
        { label: 'Credits', path: '/admin/credits' },
        { label: 'Communities', path: '/admin/communities' },
        { label: 'Reports', path: '/admin/reports' },
    ]

    return (
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
            <div className="max-w-full">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
                            S
                        </div>
                        <span className="font-bold text-lg text-foreground">SkillForge</span>
                        <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold">ADMIN</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/admin/notifications')}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Notifications"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex overflow-x-auto border-t border-border bg-card scrollbar-hide">
                    <div className="flex min-w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === item.label
                                    ? 'border-b-2 border-primary text-primary bg-primary/5'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-b-2 border-transparent'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </header>
    )
}
