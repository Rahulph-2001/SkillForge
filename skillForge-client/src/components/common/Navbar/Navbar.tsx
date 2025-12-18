import { useState } from 'react';
import { Bell, MessageCircle, ChevronDown, LogOut, User, CreditCard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

import { useAppSelector } from '../../../store/hooks';

export default function Navbar() {
    const { user } = useAppSelector((state) => state.auth);
    const isAuthenticated = !!user;
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isActive = (path: string) => location.pathname === path;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch {
            toast.error('Logout failed');
        }
    };

    if (!isAuthenticated) {
        // Landing page navbar
        return (
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-lg text-gray-900">SkillForge</span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-700 font-medium hover:text-gray-900">
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    // Authenticated user navbar
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Logo and navigation */}
                <div className="flex items-center gap-8">
                    <Link to="/home" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-lg text-gray-900">SkillForge</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            to="/home"
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive('/home')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/explore"
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive('/explore')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Browse Skills
                        </Link>
                        <Link
                            to="/projects"
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive('/projects')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Projects
                        </Link>
                        <Link
                            to="/communities"
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive('/communities')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Communities
                        </Link>
                        <Link
                            to="/my-skills"
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive('/my-skills')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            My Skills
                        </Link>
                    </nav>
                </div>

                {/* Right side - User profile and icons */}
                <div className="flex items-center gap-4">
                    {/* Subscription Plan Badge - Crown Icon with Pro */}
                    {user?.subscriptionPlan && (
                        <Link
                            to="/plans"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${user.subscriptionPlan === 'free'
                                ? 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                : 'bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 border border-orange-200'
                                }`}
                        >
                            {/* Crown Icon */}
                            <svg
                                className={`w-5 h-5 ${user.subscriptionPlan === 'free' ? 'text-gray-500' : 'text-orange-500'}`}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>

                            <span className={`text-sm font-semibold ${user.subscriptionPlan === 'free' ? 'text-gray-700' : 'text-orange-600'
                                }`}>
                                {user.subscriptionPlan === 'free' ? 'Free' : 'Pro'}
                            </span>

                            {user.subscriptionPlan === 'free' && (
                                <span className="text-xs text-blue-600 font-semibold ml-1">Upgrade</span>
                            )}
                        </Link>
                    )}

                    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg">
                        <span className="text-sm font-semibold text-blue-600">{user?.credits || 0}</span>
                        <span className="text-sm text-gray-600">credits</span>
                    </div>

                    <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
                    <MessageCircle className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />

                    {/* User Menu Dropdown */}
                    <div className="relative pl-2 border-l border-gray-200">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <span className="text-blue-600 font-semibold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-900 hidden sm:inline">{user?.name || 'User'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />

                                {/* Menu */}
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{user?.credits || 0} credits available</p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">My Profile</span>
                                    </Link>

                                    <Link
                                        to="/sessions"
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">Sessions</span>
                                    </Link>

                                    <Link
                                        to="/plans"
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <CreditCard className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">My Subscription</span>
                                    </Link>

                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4 text-red-600" />
                                            <span className="text-sm text-red-600 font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
