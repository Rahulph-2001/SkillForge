import { Star } from 'lucide-react';

const skills = [
    {
        id: 1,
        title: 'Acoustic Guitar for Beginners',
        description: 'Learn the fundamentals of acoustic guitar playing, including basic chords...',
        image: '/images/guitar.jpg',
        rating: 4.7,
        students: 8,
    },
    {
        id: 2,
        title: 'Full Stack Web Development',
        description: 'Master modern web development with React, Node.js, and databases. Build...',
        image: '/images/coding.jpg',
        rating: 4.7,
        students: 12,
    },
    {
        id: 3,
        title: 'Vinyasa Yoga Flow',
        description: 'Dynamic yoga practice that links breath with movement. Improve...',
        image: '/images/yoga.jpg',
        rating: 5,
        students: 6,
    },
];

export default function PopularSkills() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Popular Skills</h2>
                    <p className="text-gray-600">Explore what our community is learning and teaching</p>
                </div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span className="text-4xl">🎸</span>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{skill.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>

                                {/* Rating and students */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-gray-700 font-semibold">{skill.rating}</span>
                                    </div>
                                    <span className="text-gray-600">{skill.students} students</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Join CTA */}
                <div className="text-center">
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                        Join to Explore 200+ Skills
                    </button>
                </div>
            </div>
        </section>
    );
}
