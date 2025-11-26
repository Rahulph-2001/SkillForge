import { Navbar } from '../../components/shared/Navbar';
import { Footer } from '../../components/shared/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { clearPersistedState } from '../../store/persistUtils';

export default function HomePage() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Logout from backend and clear Redux state
            await dispatch(logout()).unwrap();
            
            // Clear persisted state from localStorage
            await clearPersistedState();
            
            // Navigate to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            
            // Even if logout fails, clear local state and redirect
            await clearPersistedState();
            navigate('/login');
        }
    };

    // Fallback for display if some fields are missing in the auth user object
    const displayUser = user ? {
        name: user.name,
        avatar: '', // Add avatar to user model if available
        credits: user.credits,
        subscriptionPlan: 'free', // Show 'free' to encourage upgrades
    } : null;

    return (
        <main className="min-h-screen bg-white">
            {/* Navbar with Logout Button */}
            <div className="relative">
                <Navbar isAuthenticated={!!user} user={displayUser || undefined} />
                {user && (
                    <div className="absolute top-4 right-4 z-50">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6 flex items-center justify-center gap-2">
                        <span>💡</span>
                        <span>Trade Skills, Build Community</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Share Your Skills,
                        <br />
                        <span className="text-blue-600">Learn Something New</span>
                    </h1>

                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Join a thriving community where time equals value. Offer your expertise, earn credits, and unlock unlimited
                        learning opportunities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            to="/explore"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                        >
                            Explore Skills
                            <span>→</span>
                        </Link>
                        <Link
                            to="/my-skills/add"
                            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
                        >
                            Offer Your Skills
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">5,000+</div>
                            <div className="text-gray-600">Active Members</div>
                        </div>
                        <div className="hidden sm:block w-1 h-8 bg-gray-300"></div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">200+</div>
                            <div className="text-gray-600">Skill Categories</div>
                        </div>
                        <div className="hidden sm:block w-1 h-8 bg-gray-300"></div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">15,000+</div>
                            <div className="text-gray-600">Sessions Completed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">How SkillForge Works</h2>
                        <p className="text-gray-600">A simple credit-based system that values everyone's time equally</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            {
                                icon: '👥',
                                number: '1',
                                title: 'Join the Community',
                                description: 'Sign up and get 20 starter credits to begin your learning journey',
                            },
                            {
                                icon: '⚡',
                                number: '2',
                                title: 'Offer Your Skills',
                                description: 'Share what you know and earn credits by teaching others',
                            },
                            {
                                icon: '📅',
                                number: '3',
                                title: 'Book Sessions',
                                description: 'Use credits to book live sessions with expert skill providers',
                            },
                            {
                                icon: '🤝',
                                number: '4',
                                title: 'Connect & Grow',
                                description: 'Join communities, network with peers, and grow together',
                            },
                        ].map((step) => (
                            <div
                                key={step.number}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 text-2xl">
                                        {step.icon}
                                    </div>
                                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {step.number}
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Skills Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Featured Skills</h2>
                            <p className="text-gray-600">Popular skills from our top-rated providers</p>
                        </div>
                        <Link to="/explore" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                            View All
                            <span>→</span>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Acoustic Guitar for Beginners',
                                description:
                                    'Learn the fundamentals of acoustic guitar playing, including basic chords, strumming patterns...',
                                instructor: 'Marcus Johnson',
                                duration: '1 hour',
                                level: 'Beginner',
                                rating: 4.9,
                                reviews: '8 reviews',
                                tags: ['Music', 'Guitar', 'Beginner Friendly'],
                                price: '8 / hour',
                            },
                            {
                                title: 'Full-Stack Web Development',
                                description:
                                    'Master modern web development with React, Node.js, and databases. Build real-world projects...',
                                instructor: 'David Kim',
                                duration: '1.5 hours',
                                level: 'Intermediate',
                                rating: 4.7,
                                reviews: '12 reviews',
                                tags: ['Programming', 'Web Development', 'React'],
                                price: '12 / hour',
                            },
                            {
                                title: 'Vinyasa Yoga Flow',
                                description:
                                    'Dynamic yoga practice that links breath with movement. Improve flexibility, strength...',
                                instructor: 'Emily Rodriguez',
                                duration: '1 hour',
                                level: 'All Levels',
                                rating: 5,
                                reviews: '6 reviews',
                                tags: ['Yoga', 'Fitness', 'Wellness'],
                                price: '6 / hour',
                            },
                        ].map((skill, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <span className="text-5xl">{idx === 0 ? '🎸' : idx === 1 ? '💻' : '🧘'}</span>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-base font-bold text-gray-900 mb-2">{skill.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>

                                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-xs">👤</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{skill.instructor}</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                                        <span>⏱️ {skill.duration}</span>
                                        <span>📊 {skill.level}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {skill.tags.map((tag) => (
                                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">⭐</span>
                                                <span className="text-sm font-bold text-gray-900">{skill.rating}</span>
                                            </div>
                                            <span className="text-xs text-gray-600">({skill.reviews})</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{skill.price}</span>
                                    </div>

                                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safe & Trusted Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Safe & Trusted Platform</h2>
                        <p className="text-gray-600">Your security and satisfaction are our top priorities</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: '🛡️',
                                title: 'Verified Profiles',
                                description: 'All members are verified to ensure authenticity and safety',
                            },
                            {
                                icon: '⭐',
                                title: 'Rating System',
                                description: 'Transparent reviews help you find the best skill providers',
                            },
                            {
                                icon: '🎧',
                                title: '24/7 Support',
                                description: 'Our team is always here to help with any questions',
                            },
                        ].map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-block mb-6">
                        <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                            💳
                        </div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Trading Skills?</h2>
                    <p className="text-blue-100 text-lg mb-8">
                        Join thousands of learners and teachers in our vibrant community. Your first 20 credits are on us!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/explore"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                        >
                            Get Started Free
                            <span className="ml-2">→</span>
                        </Link>
                        <Link
                            to="/how-it-works"
                            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
