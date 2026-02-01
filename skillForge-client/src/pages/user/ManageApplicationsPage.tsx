
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Clock,
    Briefcase,
    ChevronLeft,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    MessageSquare
} from 'lucide-react';
import projectApplicationService, { ProjectApplication, ProjectApplicationStatus } from '../../services/projectApplicationService';
import projectService, { Project } from '../../services/projectService';
import { toast } from 'react-hot-toast';

export default function ManageApplicationsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<ProjectApplication[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchApplications();
        }
    }, [id]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const [appsData, projectData] = await Promise.all([
                projectApplicationService.getProjectApplications(id!),
                projectService.getProject(id!)
            ]);
            setApplications(appsData);
            setProject(projectData);
        } catch (error: any) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId: string, status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED') => {
        try {
            await projectApplicationService.updateStatus(applicationId, status);
            toast.success(`Application ${status.toLowerCase()} successfully`);
            fetchApplications(); // Refresh list
        } catch (error: any) {
            console.error('Failed to update status:', error);
            toast.error(error.response?.data?.message || 'Failed to update application status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(`/projects/${id}`)}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
                        <p className="text-gray-600">Review and manage received applications</p>
                    </div>
                </div>


                {/* Status Banners for other states */}
                {project && project.status === 'Completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-green-900">Project Completed Successfully</h3>
                        <p className="text-green-800">Payment has been released to the contributor.</p>
                    </div>
                )}

                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-500">Wait for freelancers to apply to your project.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Applicant Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                        {app.applicant?.avatarUrl ? (
                                                            <img src={app.applicant.avatarUrl} alt={app.applicant.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold text-gray-500">
                                                                {app.applicant?.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3
                                                            className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                                                            onClick={() => navigate(`/profile/${app.applicantId}`)}
                                                        >
                                                            {app.applicant?.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Match Score */}
                                                {app.matchScore && (
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-2xl font-bold text-blue-600">{app.matchScore}%</span>
                                                            <span className="text-sm font-medium text-gray-600">Match</span>
                                                        </div>
                                                        {app.matchAnalysis?.recommendation && (
                                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                                                                {app.matchAnalysis.recommendation}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Application Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">Proposed: ₹{app.proposedBudget.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">Duration: {app.proposedDuration}</span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{app.coverLetter}</p>
                                            </div>

                                            {app.matchAnalysis && (
                                                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                                    <h4 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                        AI Insights
                                                    </h4>
                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="font-medium text-indigo-800 mb-1">Strengths:</p>
                                                            <ul className="list-disc list-inside text-indigo-700">
                                                                {/* Handle nested backend structure or potentially missing data */}
                                                                {/* Backend returns: app.matchAnalysis.coverLetterAnalysis.strengths */}
                                                                {(app.matchAnalysis.coverLetterAnalysis?.strengths ||
                                                                    app.matchAnalysis.strengths ||
                                                                    []).slice(0, 3).map((s: string, i: number) => (
                                                                        <li key={i}>{s}</li>
                                                                    ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-indigo-800 mb-1">Weaknesses/Concerns:</p>
                                                            <ul className="list-disc list-inside text-indigo-700">
                                                                {/* Backend returns: app.matchAnalysis.coverLetterAnalysis.concerns */}
                                                                {(app.matchAnalysis.coverLetterAnalysis?.concerns ||
                                                                    app.matchAnalysis.weaknesses ||
                                                                    []).slice(0, 3).map((w: string, i: number) => (
                                                                        <li key={i}>{w}</li>
                                                                    ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Sidebar */}
                                        <div className="w-full md:w-48 flex flex-col gap-3 border-l pl-0 md:pl-6 border-gray-100">
                                            <div className="mb-2">
                                                <span className={`block w-full text-center px-3 py-1 rounded-full text-sm font-semibold 
                                                    ${app.status === ProjectApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                                                        app.status === ProjectApplicationStatus.REJECTED ? 'bg-red-100 text-red-800' :
                                                            app.status === ProjectApplicationStatus.SHORTLISTED ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            {app.status !== ProjectApplicationStatus.ACCEPTED &&
                                                app.status !== ProjectApplicationStatus.REJECTED && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                                                            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Accept
                                                        </button>

                                                        {app.status !== 'SHORTLISTED' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                                                                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                                                            >
                                                                <MoreHorizontal className="w-4 h-4" />
                                                                Shortlist
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors border border-red-200"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                            <button
                                                onClick={() => {/* TODO: Implement chat */ }}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
