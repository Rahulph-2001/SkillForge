import { Shield, Star, Headphones } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: 'Verified Profiles',
        description: 'All members are verified to ensure authenticity and safety',
    },
    {
        icon: Star,
        title: 'Rating System',
        description: 'Transparent reviews help you find the best skill providers',
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'Our team is always here to help with any questions',
    },
];

export default function SafeTrusted() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Safe & Trusted Platform</h2>
                    <p className="text-gray-600">Your security and satisfaction are our top priorities</p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
