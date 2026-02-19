
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(`/projects/${id}`)}
                        className="p-2 hover:bg-card rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Manage Applications</h1>
                        <p className="text-muted-foreground">Review and manage received applications</p>
                    </div>
                </div>


                {/* Status Banners for other states */}
                {project && project.status === 'Completed' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Project Completed Successfully</h3>
                        <p className="text-green-600 dark:text-green-300">Payment has been released to the contributor.</p>
                    </div>
                )}

                {applications.length === 0 ? (
                    <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                        <p className="text-muted-foreground">Wait for freelancers to apply to your project.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div key={app.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Applicant Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                                                        {app.applicant?.avatarUrl ? (
                                                            <img src={app.applicant.avatarUrl} alt={app.applicant.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold text-muted-foreground">
                                                                {app.applicant?.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3
                                                            className="text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                                                            onClick={() => navigate(`/profile/${app.applicantId}`)}
                                                        >
                                                            {app.applicant?.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Match Score */}
                                                {app.matchScore && (
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-2xl font-bold text-primary">{app.matchScore}%</span>
                                                            <span className="text-sm font-medium text-muted-foreground">Match</span>
                                                        </div>
                                                        {app.matchAnalysis?.recommendation && (
                                                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                                                                {app.matchAnalysis.recommendation}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Application Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">Proposed: ₹{app.proposedBudget.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">Duration: {app.proposedDuration}</span>
                                                </div>
                                            </div>

                                            <div className="bg-muted/30 rounded-lg p-4 mb-4">
                                                <h4 className="text-sm font-semibold text-foreground mb-2">Cover Letter</h4>
                                                <p className="text-muted-foreground text-sm whitespace-pre-wrap">{app.coverLetter}</p>
                                            </div>

                                            {app.matchAnalysis && (
                                                <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
                                                    <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                        AI Insights
                                                    </h4>
                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Strengths:</p>
                                                            <ul className="list-disc list-inside text-indigo-600 dark:text-indigo-400">
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
                                                            <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Weaknesses/Concerns:</p>
                                                            <ul className="list-disc list-inside text-indigo-600 dark:text-indigo-400">
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
                                        <div className="w-full md:w-48 flex flex-col gap-3 border-l pl-0 md:pl-6 border-border">
                                            <div className="mb-2">
                                                <span className={`block w-full text-center px-3 py-1 rounded-full text-sm font-semibold 
                                                    ${app.status === ProjectApplicationStatus.ACCEPTED ? 'bg-green-500/10 text-green-600' :
                                                        app.status === ProjectApplicationStatus.REJECTED ? 'bg-destructive/10 text-destructive' :
                                                            app.status === ProjectApplicationStatus.SHORTLISTED ? 'bg-blue-500/10 text-blue-600' :
                                                                'bg-amber-500/10 text-amber-600'}`}>
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

                                                        {/* Shortlist Button */}
                                                        {app.status !== 'SHORTLISTED' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                                                                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-lg text-sm font-medium transition-colors border border-blue-500/20"
                                                            >
                                                                <MoreHorizontal className="w-4 h-4" />
                                                                Shortlist
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-card hover:bg-destructive/10 text-destructive rounded-lg text-sm font-medium transition-colors border border-destructive/20"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                            <button
                                                onClick={() => {/* TODO: Implement chat */ }}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg text-sm font-medium transition-colors"
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
