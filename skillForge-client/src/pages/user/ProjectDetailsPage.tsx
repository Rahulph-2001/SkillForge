import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Clock,
    Users,
    Star,
    CheckCircle,
    Shield,
    Sparkles,
    MessageSquare
} from 'lucide-react';
import projectService, { Project } from '../../services/projectService';
import ApplyProjectModal from '../../components/project/ApplyProjectModal';
import ProjectChatModal from '../../components/project/ProjectChatModal';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../store/store';
// import api from '../../services/api'; // Removed as we use service now
import { toast } from 'react-hot-toast';

export default function ProjectDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (id) {
            fetchProjectDetails();
        }
    }, [id]);

    useEffect(() => {
        if (searchParams.get('chat') === 'true') {
            setIsChatOpen(true);
        }
    }, [searchParams]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProject(id!);
            setProject(data);
        } catch (error: any) {
            console.error('Failed to fetch project:', error);
            toast.error(error.response?.data?.message || 'Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-600 mb-4">Project not found</p>
                <button
                    onClick={() => navigate('/projects')}
                    className="text-blue-600 hover:underline"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    const isCreator = user?.id === project.clientId;
    const statusColors: Record<string, string> = {
        Open: 'bg-green-100 text-green-800',
        In_Progress: 'bg-blue-100 text-blue-800',
        Pending_Completion: 'bg-yellow-100 text-yellow-800',
        Payment_Pending: 'bg-orange-100 text-orange-800',
        Refund_Pending: 'bg-red-100 text-red-800',
        Completed: 'bg-gray-100 text-gray-800',
        Cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Projects</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Header */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {project.title}
                                    </h1>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm text-gray-600">{project.category}</span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-gray-600">
                                            Posted {new Date(project.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Budget</p>
                                        <p className="text-sm font-semibold text-gray-900">₹{project.budget.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Duration</p>
                                        <p className="text-sm font-semibold text-gray-900">{project.duration}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Applications</p>
                                        <p className="text-sm font-semibold text-gray-900">{project.applicationsCount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Deadline</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {project.deadline
                                                ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                : 'Flexible'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </div>

                        {/* Required Skills */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chat Button for Participants */}
                        {(isCreator || (user?.id === project.acceptedContributor?.id)) && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Open Project Chat
                                </button>
                            </div>
                        )}

                        {/* Chat Modal */}
                        {project && (
                            <ProjectChatModal
                                isOpen={isChatOpen}
                                onClose={() => setIsChatOpen(false)}
                                projectId={project.id}
                                currentUserId={user?.id || ''}
                                isClient={isCreator}
                            />
                        )}
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* Creator/Apply Section */}
                        {isCreator ? (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-blue-900 mb-4">
                                    <CheckCircle className="w-5 h-5" />
                                    <p className="font-semibold">You are the creator of this project</p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate(`/my-projects?tab=created`)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                                    >
                                        Manage Project
                                    </button>
                                    <button
                                        onClick={() => navigate(`/my-projects?tab=applicants`)}
                                        className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-4 rounded-lg border-2 border-blue-200 transition-colors"
                                    >
                                        View Applications ({project.applicationsCount})
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-sm">
                                <div className="flex items-start gap-2 text-blue-900 mb-4 p-3 bg-white/60 rounded-lg">
                                    <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                        Our LLM will analyze your profile and skills to provide a match score
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowApplyModal(true)}
                                    disabled={project.status !== 'Open'}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {project.status === 'Open' ? 'Apply for This Project' : 'Project Closed'}
                                </button>
                            </div>
                        )}

                        {/* Posted By */}
                        {project.client && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Posted By</h3>
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {project.client.avatarUrl ? (
                                            <img
                                                src={project.client.avatarUrl}
                                                alt={project.client.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            project.client.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {project.client.name}
                                            </p>
                                            {project.client.isVerified && (
                                                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                            )}
                                        </div>
                                        {project.client.rating !== undefined && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {Number(project.client.rating).toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => navigate(`/profile/${project.clientId}`)}
                                            className="text-sm text-blue-600 hover:underline mt-2"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Details */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Budget:</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {project.budget.toLocaleString()} credits
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Status:</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                        {project.paymentId ? 'Reserved' : 'Pending'}
                                    </span>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start gap-2">
                                        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-900">
                                            Payment is held in escrow and released upon project completion and approval
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {
                project && (
                    <ApplyProjectModal
                        isOpen={showApplyModal}
                        onClose={() => setShowApplyModal(false)}
                        project={project}
                        onSuccess={() => {
                            setShowApplyModal(false);
                            toast.success('Application submitted successfully!');
                            fetchProjectDetails(); // Refresh to update application count
                        }}
                    />
                )
            }
        </div >
    );
}
