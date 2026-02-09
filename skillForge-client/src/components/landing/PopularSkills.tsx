import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { browseSkillsService, BrowseSkill } from '../../services/browseSkillsService';
import { LoginModal } from '../common/Modal/LoginModal';

export default function PopularSkills() {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [skills, setSkills] = useState<BrowseSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await browseSkillsService.browseSkills({ limit: 3 });
                setSkills(response.skills);
            } catch (err) {
                console.error('Failed to load popular skills', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleSkillClick = (skillId: string) => {
        if (user) {
            navigate(`/app/skill/${skillId}`);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    if (loading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <p>Loading popular skills...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

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
                            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleSkillClick(skill.id)}
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                                {skill.imageUrl ? (
                                    <img src={skill.imageUrl} alt={skill.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                        <span className="text-4xl">
                                            {skill.category === 'Music' ? '🎸' :
                                                skill.category === 'Programming' ? '💻' :
                                                    skill.category === 'Design' ? '🎨' : '✨'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{skill.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>

                                {/* Rating and students */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-gray-700 font-semibold">{Number(skill.rating || 0).toFixed(1)}</span>
                                    </div>
                                    <span className="text-gray-600">
                                        {skill.provider.reviewCount || skill.totalSessions || 0} reviews
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Join CTA */}
                <div className="text-center">
                    <button
                        onClick={() => navigate(user ? '/home' : '/signup')}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                        Join to Explore 200+ Skills
                    </button>
                </div>
            </div>
        </section>
    );
}
