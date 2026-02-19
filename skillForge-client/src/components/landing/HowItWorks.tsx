import { Users, Zap, Calendar } from 'lucide-react';

const steps = [
    {
        icon: Users,
        number: '1',
        title: 'Sign Up Free',
        description: 'Create your account in minutes and receive 20 starter credits to begin your learning journey',
    },
    {
        icon: Zap,
        number: '2',
        title: 'Offer & Request',
        description: 'Share what you know to earn credits, then spend them on skills you want to learn',
    },
    {
        icon: Calendar,
        number: '3',
        title: 'Connect & Grow',
        description: 'Schedule sessions, meet amazing people, and grow your skills together',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">How SkillForge Works</h2>
                    <p className="text-muted-foreground">Three simple steps to start trading skills</p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.number}
                                className="bg-card text-card-foreground border border-border rounded-lg p-8 hover:shadow-lg transition-shadow"
                            >
                                {/* Icon and number */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                                        {step.number}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
