import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../store/hooks'
import { logout } from '../../../store/slices/authSlice'
import { clearPersistedState } from '../../../store/persistUtils'

interface AdminNavbarProps {
    activeTab?: string
}

export default function AdminNavbar({ activeTab = 'Dashboard' }: AdminNavbarProps) {
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
        { label: 'Sessions', path: '/admin/sessions' },
        { label: 'Transactions', path: '/admin/transactions' },
        { label: 'Wallet', path: '/admin/wallet' },
        { label: 'Credits', path: '/admin/credits' },
        { label: 'Communities', path: '/admin/communities' },
        { label: 'Reports', path: '/admin/reports' },
    ]

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-full">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                            S
                        </div>
                        <span className="font-bold text-lg text-gray-900">SkillForge</span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">ADMIN</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button 
                            className="text-gray-600 hover:text-gray-900 transition-colors"
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
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex overflow-x-auto border-t border-gray-200 bg-white scrollbar-hide">
                    <div className="flex min-w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === item.label
                                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent'
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
