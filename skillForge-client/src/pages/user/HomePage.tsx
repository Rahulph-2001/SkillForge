import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { browseSkillsService, BrowseSkill } from '../../services/browseSkillsService';

export default function HomePage() {
    const [featuredSkills, setFeaturedSkills] = useState<BrowseSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                // Fetch top rated skills
                const response = await browseSkillsService.browseSkills({
                    limit: 3,
                    // in real app, we might want to sort by rating, but for now strict to plan
                });
                setFeaturedSkills(response.skills);
            } catch (err) {
                console.error('Failed to fetch featured skills:', err);
                setError('Failed to load featured skills');
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: string } = {
            'Music': '🎸',
            'Programming': '💻',
            'Technology': '💻',
            'Design': '🎨',
            'Art': '🎨',
            'Business': '💼',
            'Marketing': '📢',
            'Lifestyle': '🧘',
            'Health': '🧘',
            'Cooking': '🍳',
            'Language': '🗣️',
            'Academics': '📚'
        };
        return icons[category] || '✨';
    };

    return (
        <main className="min-h-screen bg-background transition-colors duration-300">


            {/* Hero Section */}
            <section className="bg-gradient-to-b from-secondary/50 to-background py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 flex items-center justify-center gap-2">
                        <span>💡</span>
                        <span>Trade Skills, Build Community</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                        Share Your Skills,
                        <br />
                        <span className="text-primary">Learn Something New</span>
                    </h1>

                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Join a thriving community where time equals value. Offer your expertise, earn credits, and unlock unlimited
                        learning opportunities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            to="/explore"
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                        >
                            Explore Skills
                            <span>→</span>
                        </Link>
                        <Link
                            to="/my-skills/add"
                            className="bg-card text-foreground px-8 py-3 rounded-lg font-semibold border-2 border-border hover:border-input transition-colors"
                        >
                            Offer Your Skills
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
                        <div>
                            <div className="text-2xl font-bold text-primary">5,000+</div>
                            <div className="text-muted-foreground">Active Members</div>
                        </div>
                        <div className="hidden sm:block w-1 h-8 bg-border"></div>
                        <div>
                            <div className="text-2xl font-bold text-primary">200+</div>
                            <div className="text-muted-foreground">Skill Categories</div>
                        </div>
                        <div className="hidden sm:block w-1 h-8 bg-border"></div>
                        <div>
                            <div className="text-2xl font-bold text-primary">15,000+</div>
                            <div className="text-muted-foreground">Sessions Completed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">How SkillForge Works</h2>
                        <p className="text-muted-foreground">A simple credit-based system that values everyone's time equally</p>
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
                                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="mb-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 text-2xl">
                                        {step.icon}
                                    </div>
                                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                                        {step.number}
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Skills Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Featured Skills</h2>
                            <p className="text-muted-foreground">Popular skills from our top-rated providers</p>
                        </div>
                        <Link to="/explore" className="text-primary font-semibold hover:text-primary/80 flex items-center gap-1 transition-colors">
                            View All
                            <span>→</span>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-3 text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="mt-2 text-muted-foreground">Loading featured skills...</p>
                            </div>
                        ) : error ? (
                            <div className="col-span-3 text-center py-12 text-destructive">
                                {error}
                            </div>
                        ) : featuredSkills.length === 0 ? (
                            <div className="col-span-3 text-center py-12 text-muted-foreground">
                                No featured skills available at the moment.
                            </div>
                        ) : (
                            featuredSkills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                                        {skill.imageUrl ? (
                                            <img
                                                src={skill.imageUrl}
                                                alt={skill.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-5xl">{getCategoryIcon(skill.category)}</span>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-base font-bold text-foreground mb-2 truncate" title={skill.title}>{skill.title}</h3>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{skill.description}</p>

                                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                                            {skill.provider.avatarUrl ? (
                                                <img
                                                    src={skill.provider.avatarUrl}
                                                    alt={skill.provider.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                                                    <span className="text-xs">👤</span>
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-foreground truncate">{skill.provider.name}</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                            <span>⏱️ {skill.durationHours}h</span>
                                            <span>📊 {skill.level}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {skill.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400">⭐</span>
                                                    <span className="text-sm font-bold text-foreground">{Number(skill.rating || 0).toFixed(1)}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    ({skill.provider.reviewCount || skill.totalSessions || 0} reviews)
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-foreground">{skill.creditsPerHour} credits/hr</span>
                                        </div>

                                        <Link
                                            to={`/app/skill/${skill.id}`}
                                            className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors block text-center"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Safe & Trusted Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Safe & Trusted Platform</h2>
                        <p className="text-muted-foreground">Your security and satisfaction are our top priorities</p>
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
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-block mb-6">
                        <div className="w-14 h-14 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground text-2xl">
                            💳
                        </div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Trading Skills?</h2>
                    <p className="text-primary-foreground/90 text-lg mb-8">
                        Join thousands of learners and teachers in our vibrant community. Your first 20 credits are on us!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/explore"
                            className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors inline-flex items-center justify-center"
                        >
                            Get Started Free
                            <span className="ml-2">→</span>
                        </Link>
                        <Link
                            to="/how-it-works"
                            className="bg-primary/80 border border-primary-foreground/20 text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
