import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="bg-gradient-to-b from-secondary/50 to-background py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                {/* Main heading */}
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                    Trade Skills,
                    <br />
                    <span className="text-primary">Build Community</span>
                </h1>

                {/* Description */}
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Join a community where skills are the currency. Learn new things by teaching what you know. No money needed - just passion for learning.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link
                        to="/signup"
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                    >
                        Join Free - Get 20 Credits
                        <span>→</span>
                    </Link>
                    <a
                        href="#how-it-works"
                        className="bg-card text-foreground px-8 py-3 rounded-lg font-semibold border-2 border-border hover:border-input transition-colors"
                    >
                        Learn How It Works
                    </a>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>50K+ members</span>
                    </div>
                    <div className="w-1 h-1 bg-muted rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.65 rating</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
