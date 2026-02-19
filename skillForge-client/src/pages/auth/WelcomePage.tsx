import { Link } from 'react-router-dom';

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
            <div className="max-w-2xl mx-auto px-6 py-12">
                {/* Header with rotating coin icon */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-spin-slow">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                                <path d="M12 6v12M8.5 9.5h7M8.5 14.5h7" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-3">Welcome to SkillForge!</h1>
                    <p className="text-muted-foreground text-lg">
                        You've just received 20 starter credits to begin your learning journey
                    </p>
                </div>

                {/* Credit Balance Card */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 mb-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                    <p className="text-amber-700 text-sm font-medium mb-2 relative z-10">Your Credit Balance</p>
                    <div className="flex items-center justify-center gap-3 mb-4 relative z-10">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center animate-spin-slow border-4 border-white shadow-sm">
                            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                                <path d="M12 6v12M8.5 9.5h7M8.5 14.5h7" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-5xl font-bold text-amber-600">20</span>
                    </div>
                    <p className="text-amber-800/80 relative z-10">Credits are like currency on SkillForge</p>
                </div>

                {/* How the Credit System Works */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6 text-center">How the Credit System Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Earn Credits Card */}
                        <div className="bg-card border-2 border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M7 16.5V9m0 0l3.5-3.5M7 9h7m0 0l-3.5 3.5M14 9v7.5m0 0l-3.5 3.5m3.5-3.5l3.5 3.5"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">Earn Credits</h3>
                            <p className="text-muted-foreground">
                                Teach what you know and earn credits. 1 hour of teaching typically earns 8-12 credits.
                            </p>
                        </div>

                        {/* Spend Credits Card */}
                        <div className="bg-card border-2 border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">Spend Credits</h3>
                            <p className="text-muted-foreground">
                                Use credits to learn new skills. Most sessions cost between 6-15 credits per hour.
                            </p>
                        </div>
                    </div>
                </div>

                {/* What You Can Learn */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">What You Can Learn</h2>
                    <div className="space-y-4">
                        {[
                            { title: 'Web Development Basics', duration: '1 hour session', credits: 10 },
                            { title: 'Spanish Conversation Practice', duration: '45 min session', credits: 7 },
                            { title: 'Guitar Lessons for Beginners', duration: '1 hour session', credits: 8 },
                        ].map((course, idx) => (
                            <div
                                key={idx}
                                className="bg-muted border border-border rounded-lg p-6 flex items-center justify-between hover:bg-muted/80 transition-colors"
                            >
                                <div>
                                    <h3 className="font-bold text-foreground">{course.title}</h3>
                                    <p className="text-muted-foreground text-sm">{course.duration}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-amber-500 animate-spin-slow"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                                            <path d="M12 6v12M8.5 9.5h7M8.5 14.5h7" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span className="font-bold text-amber-600">{course.credits}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Join Community Section */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-12">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Join a Thriving Community</h3>
                            <p className="text-foreground/80">
                                Connect with over 5,000 learners and teachers. Share knowledge, build relationships, and grow together
                                in our supportive community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Link
                        to="/home"
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        Set Up Profile
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <Link
                        to="/home"
                        className="w-full sm:w-auto text-muted-foreground font-semibold hover:text-foreground transition-colors"
                    >
                        Skip for Now
                    </Link>
                </div>

                {/* Footer Text */}
                <p className="text-center text-muted-foreground text-sm mt-6">
                    You can always complete your profile later from settings
                </p>
            </div>
        </div>
    );
}
