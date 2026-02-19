import { useState, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, User, CreditCard, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import notificationService from '../../../services/notificationService';
import { ThemeToggle } from '../ThemeToggle';

export default function Navbar() {
    const { user } = useAppSelector((state) => state.auth);
    const isAuthenticated = !!user;
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    // Fetch unread notification count
    useEffect(() => {
        if (isAuthenticated) {
            const fetchUnreadCount = async () => {
                try {
                    const response = await notificationService.getUnreadCount();
                    setUnreadNotificationCount(response.count);
                } catch (error) {
                    console.error('Failed to fetch unread count:', error);
                }
            };
            fetchUnreadCount();

            // Refresh every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    // Close mobile menu on route change
    useEffect(() => {
        setShowMobileMenu(false);
    }, [location.pathname]);

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

    const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
        <Link
            to={to}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isActive(to)
                ? 'bg-primary text-primary-foreground dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                }`}
        >
            {children}
        </Link>
    );

    const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`block px-4 py-3 rounded-lg font-medium text-base transition-colors ${isActive(to)
                ? 'bg-primary/10 text-primary dark:text-primary-foreground'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
        >
            {children}
        </Link>
    );

    if (!isAuthenticated) {
        // Landing page navbar
        return (
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-lg text-foreground">SkillForge</span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/login" className="text-muted-foreground font-medium hover:text-foreground transition-colors">
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Logo and navigation */}
                <div className="flex items-center gap-8">
                    <Link to="/home" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">S</span>
                        </div>
                        <span className="font-bold text-lg text-foreground hidden sm:block">SkillForge</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-2">
                        <NavLink to="/home">Home</NavLink>
                        <NavLink to="/explore">Browse Skills</NavLink>
                        <NavLink to="/projects">Projects</NavLink>
                        <NavLink to="/communities">Communities</NavLink>
                        <NavLink to="/my-skills">My Skills</NavLink>
                    </nav>
                </div>

                {/* Right side - User profile and icons */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    {/* Subscription Plan Badge */}
                    <Link
                        to="/plans"
                        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${(user?.subscriptionPlan?.toLowerCase() || 'free') === 'free'
                                ? 'bg-secondary border-border hover:bg-secondary/80'
                                : 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                            }`}
                    >
                        <svg
                            className={`w-4 h-4 ${(user?.subscriptionPlan?.toLowerCase() || 'free') === 'free'
                                ? 'text-muted-foreground'
                                : 'text-orange-500'
                                }`}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        <span className={`text-xs font-semibold ${(user?.subscriptionPlan?.toLowerCase() || 'free') === 'free'
                            ? 'text-foreground'
                            : 'text-orange-600 dark:text-orange-400'
                            }`}>
                            {(user?.subscriptionPlan?.toLowerCase() || 'free') === 'free' ? 'Free' : 'Pro'}
                        </span>
                    </Link>

                    <Link
                        to="/credits"
                        className="hidden sm:flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                    >
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-500">{user?.credits || 0}</span>
                        <span className="text-xs text-amber-600/80 dark:text-amber-500/80">credits</span>
                    </Link>

                    <Link to="/notifications" className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        {unreadNotificationCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1 border-2 border-background">
                                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(true)}
                        className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-foreground" />
                    </button>

                    {/* User Menu Dropdown (Desktop) */}
                    <div className="hidden md:block relative pl-2 border-l border-border">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 hover:bg-secondary rounded-lg px-2 py-1 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-primary font-semibold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{user?.name || 'User'}</span>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-card text-card-foreground rounded-lg shadow-lg border border-border py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-border">
                                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{user?.credits || 0} credits available</p>
                                    </div>
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors" onClick={() => setShowUserMenu(false)}>
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">My Profile</span>
                                    </Link>
                                    <Link to="/credits" className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors" onClick={() => setShowUserMenu(false)}>
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-sm">Manage Credits</span>
                                    </Link>
                                    <Link to="/sessions" className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors" onClick={() => setShowUserMenu(false)}>
                                        <div className="w-4 h-4 flex items-center justify-center font-bold text-xs border border-current rounded-sm px-px">S</div>
                                        <span className="text-sm">Sessions</span>
                                    </Link>
                                    <Link to="/plans" className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors" onClick={() => setShowUserMenu(false)}>
                                        <div className="w-4 h-4 flex items-center justify-center font-bold text-xs">💎</div>
                                        <span className="text-sm">My Subscription</span>
                                    </Link>
                                    <div className="border-t border-border mt-2 pt-2">
                                        <button onClick={() => { setShowUserMenu(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-destructive/10 text-destructive w-full text-left transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowMobileMenu(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed inset-y-0 right-0 w-[300px] bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out h-full overflow-y-auto">
                        <div className="p-4 flex items-center justify-between border-b border-border">
                            <span className="font-bold text-lg text-foreground">Menu</span>
                            <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-secondary rounded-lg">
                                <X className="w-6 h-6 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* User Info (Mobile) */}
                            <div className="flex items-center gap-3 pb-4 border-b border-border">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-primary font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-1">
                                <MobileNavLink to="/home" onClick={() => setShowMobileMenu(false)}>Home</MobileNavLink>
                                <MobileNavLink to="/explore" onClick={() => setShowMobileMenu(false)}>Browse Skills</MobileNavLink>
                                <MobileNavLink to="/projects" onClick={() => setShowMobileMenu(false)}>Projects</MobileNavLink>
                                <MobileNavLink to="/communities" onClick={() => setShowMobileMenu(false)}>Communities</MobileNavLink>
                                <MobileNavLink to="/my-skills" onClick={() => setShowMobileMenu(false)}>My Skills</MobileNavLink>
                            </nav>

                            {/* Section Divider */}
                            <div className="h-px bg-border" />

                            {/* Profile Links */}
                            <div className="space-y-1">
                                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</p>
                                <MobileNavLink to="/profile" onClick={() => setShowMobileMenu(false)}>My Profile</MobileNavLink>
                                <MobileNavLink to="/credits" onClick={() => setShowMobileMenu(false)}>
                                    <div className="flex items-center justify-between w-full">
                                        <span>Manage Credits</span>
                                        <span className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full">{user?.credits} cr</span>
                                    </div>
                                </MobileNavLink>
                                <MobileNavLink to="/plans" onClick={() => setShowMobileMenu(false)}>My Subscription</MobileNavLink>
                            </div>

                            {/* Settings & Logout */}
                            <div className="pt-4 border-t border-border space-y-4">
                                <div className="flex items-center justify-between px-4">
                                    <span className="text-sm font-medium text-foreground">Theme</span>
                                    <ThemeToggle />
                                </div>

                                <button
                                    onClick={() => { setShowMobileMenu(false); handleLogout(); }}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-destructive font-medium hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
