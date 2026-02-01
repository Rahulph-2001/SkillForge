import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    DollarSign,
    Clock,
    Briefcase,
    ChevronRight,
    Loader2,
    Video
} from 'lucide-react';
import projectApplicationService, { ProjectApplication, ProjectApplicationStatus } from '../../services/projectApplicationService';
import { toast } from 'react-hot-toast';

export default function MyApplicationsPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<ProjectApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchApplications();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await projectApplicationService.getMyApplications();
            setApplications(data);
        } catch (error: any) {
            console.error('Failed to fetch applications:', error);
            toast.error('Failed to load your applications');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (applicationId: string) => {
        if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
            return;
        }

        try {
            await projectApplicationService.withdrawApplication(applicationId);
            toast.success('Application withdrawn successfully');
            fetchApplications(); // Refresh list
        } catch (error: any) {
            console.error('Failed to withdraw application:', error);
            toast.error(error.response?.data?.message || 'Failed to withdraw application');
        }
    };

    const getStatusColor = (status: ProjectApplicationStatus) => {
        switch (status) {
            case ProjectApplicationStatus.ACCEPTED:
                return 'bg-green-100 text-green-800';
            case ProjectApplicationStatus.SHORTLISTED:
                return 'bg-blue-100 text-blue-800';
            case ProjectApplicationStatus.REJECTED:
                return 'bg-red-100 text-red-800';
            case ProjectApplicationStatus.WITHDRAWN:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getInterviewState = (interview: any) => {
        if (!interview) return 'none';

        // Check explicit status first
        if (interview.status === 'COMPLETED') return 'completed';
        if (interview.status === 'CANCELLED') return 'cancelled';

        const scheduledTime = new Date(interview.scheduledAt);
        const durationMs = (interview.durationMinutes || 30) * 60 * 1000;
        const endTime = new Date(scheduledTime.getTime() + durationMs);

        // Allow joining 15 mins before start until 15 mins after end
        const joinWindowStart = new Date(scheduledTime.getTime() - 15 * 60 * 1000);
        const joinWindowEnd = new Date(endTime.getTime() + 15 * 60 * 1000);

        if (currentTime < joinWindowStart) return 'upcoming';
        if (currentTime >= joinWindowStart && currentTime <= joinWindowEnd) return 'active';
        return 'completed'; // Fallback if time passed but status not updated yet
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                        <p className="text-gray-600 mt-1">Manage your project applications</p>
                    </div>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-500 mb-6">Start exploring projects and find your next opportunity.</p>
                        <button
                            onClick={() => navigate('/projects')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Projects
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => {
                            // Find latest interview if exists
                            const interview = application.interviews && application.interviews.length > 0
                                ? application.interviews[0]
                                : null;
                            const interviewState = getInterviewState(interview);
                            const isShortlisted = application.status === ProjectApplicationStatus.SHORTLISTED;

                            return (
                                <div
                                    key={application.id}
                                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3
                                                    onClick={() => navigate(`/projects/${application.projectId}`)}
                                                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                                >
                                                    {application.project?.title || 'Unknown Project'}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                    {application.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>Proposed: ₹{application.proposedBudget?.toLocaleString() || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{application.proposedDuration || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {/* Interview Status for Applicant */}
                                            {isShortlisted && interview && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {interviewState === 'upcoming' && (
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                                                            <Calendar className="w-4 h-4" />
                                                            Scheduled: {new Date(interview.scheduledAt).toLocaleString()}
                                                        </div>
                                                    )}

                                                    {interviewState === 'active' && (
                                                        <button
                                                            onClick={() => navigate(`/session/interview/${interview.id}/call`)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-md animate-pulse"
                                                        >
                                                            <Video className="w-4 h-4" />
                                                            Join Live Interview
                                                        </button>
                                                    )}

                                                    {interviewState === 'completed' && (
                                                        <div className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                                            Interview Completed
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {application.matchScore && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="flex-1 max-w-xs bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${application.matchScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-blue-600">
                                                        {application.matchScore}% Match
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {application.status === ProjectApplicationStatus.PENDING && (
                                                <button
                                                    onClick={() => handleWithdraw(application.id)}
                                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    Withdraw
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/projects/${application.projectId}`)}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
