import { Bell, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    isAuthenticated?: boolean;
    user?: {
        name: string;
        avatar?: string;
        credits?: number;
        subscriptionPlan?: string;
    };
}

export default function Navbar({ isAuthenticated = false, user }: NavbarProps) {
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
                        <Link to="/home" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
                            Home
                        </Link>
                        <Link to="/explore" className="text-gray-700 font-medium text-sm hover:text-gray-900">
                            Browse Skills
                        </Link>
                        <Link to="/projects" className="text-gray-700 font-medium text-sm hover:text-gray-900">
                            Projects
                        </Link>
                        <Link to="/communities" className="text-gray-700 font-medium text-sm hover:text-gray-900">
                            Communities
                        </Link>
                        <Link to="/my-skills" className="text-gray-700 font-medium text-sm hover:text-gray-900">
                            My Skills
                        </Link>
                        <Link to="/dashboard" className="text-gray-700 font-medium text-sm hover:text-gray-900">
                            Dashboard
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

                    <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                    <MessageCircle className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />

                    {/* User avatar */}
                    <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
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
                    </div>
                </div>
            </div>
        </header>
    );
}
