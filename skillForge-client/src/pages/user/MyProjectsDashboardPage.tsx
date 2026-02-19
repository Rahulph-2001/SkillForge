
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Layout,
    Briefcase,
    FileText,
    Users,
    Plus,
    MessageSquare,
    Phone,
    Clock,
    Video,
    CheckCircle,
    XCircle,
    Lock,
    AlertTriangle,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import projectService, { Project } from '../../services/projectService';
import projectApplicationService, { ProjectApplication } from '../../services/projectApplicationService';
import { createReport } from '../../services/reportService';
import { toast } from 'react-hot-toast';
import ScheduleInterviewModal from '../../components/projects/ScheduleInterviewModal';

// Tabs configuration
const TABS = [
    { id: 'created', label: 'Created', icon: Briefcase },
    { id: 'contributing', label: 'Contributing', icon: Layout },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'applicants', label: 'Applicants', icon: Users },
];

export default function MyProjectsDashboardPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'created';
    const [isLoading, setIsLoading] = useState(true);

    const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
    const [contributingProjects, setContributingProjects] = useState<Project[]>([]);
    const [myApplications, setMyApplications] = useState<ProjectApplication[]>([]);
    const [receivedApplications, setReceivedApplications] = useState<ProjectApplication[]>([]);

    // Interview Modal State
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

    const setActiveTab = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            switch (activeTab) {
                case 'created':
                    const created = await projectService.getMyProjects();
                    setCreatedProjects(created);
                    break;
                case 'contributing':
                    const contributing = await projectService.getContributingProjects();
                    setContributingProjects(contributing);
                    break;
                case 'applications':
                    const applications = await projectApplicationService.getMyApplications();
                    setMyApplications(applications);
                    break;
                case 'applicants':
                    const applicants = await projectApplicationService.getReceivedApplications();
                    setReceivedApplications(applicants);
                    break;
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
                        <p className="text-muted-foreground mt-1">Manage your projects and applications</p>
                    </div>
                    <button
                        onClick={() => navigate('/projects/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Project
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-card rounded-xl shadow-sm border border-border mb-8 overflow-hidden">
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap min-w-fit
                                        ${isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                    {tab.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {activeTab === 'created' && <CreatedProjectsTab projects={createdProjects} />}
                            {activeTab === 'contributing' && <ContributingProjectsTab projects={contributingProjects} refreshData={fetchData} />}
                            {activeTab === 'applications' && <MyApplicationsTab applications={myApplications} />}
                            {activeTab === 'applicants' && (
                                <ApplicantsTab
                                    applications={receivedApplications}
                                    refreshData={fetchData}
                                    onScheduleInterview={(appId) => {
                                        setSelectedApplicationId(appId);
                                        setIsInterviewModalOpen(true);
                                    }}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interview Modal */}
                {selectedApplicationId && (
                    <ScheduleInterviewModal
                        isOpen={isInterviewModalOpen}
                        onClose={() => {
                            setIsInterviewModalOpen(false);
                            setSelectedApplicationId(null);
                        }}
                        applicationId={selectedApplicationId}
                        onScheduled={fetchData}
                    />
                )}
            </div>
        </div>
    );
}

function CreatedProjectsTab({ projects }: { projects: Project[] }) {
    const navigate = useNavigate();

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleReviewCompletion = async (projectId: string, decision: 'APPROVE' | 'REQUEST_CHANGES', reason?: string) => {
        try {
            await projectService.reviewCompletion(projectId, decision, reason);
            if (decision === 'APPROVE') {
                toast.success('Project completed and payment released!');
            } else if (decision === 'REQUEST_CHANGES') {
                toast.success('Modifications requested from contributor');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit review');
        }
    };

    const handleRejectClick = (projectId: string) => {
        setSelectedProjectId(projectId);
        setIsRejectModalOpen(true);
    };

    const handleConfirmRejection = async () => {
        if (!selectedProjectId || !rejectionReason.trim()) return;

        try {
            await projectService.reviewCompletion(selectedProjectId, 'REJECT', rejectionReason);
            toast.success('Project rejected and dispute raised for admin review.');
            setIsRejectModalOpen(false);
            setRejectionReason('');
            setSelectedProjectId(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit rejection');
        }
    };

    if (projects.length === 0) {
        return (
            <EmptyState
                icon={Briefcase}
                title="No projects created"
                description="Create your first project to start hiring freelancers."
                actionLabel="Create Project"
                onAction={() => navigate('/projects/create')}
            />
        );
    }

    return (
        <div className="space-y-6">
            {projects.map((project) => (
                <div key={project.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3
                                    className="text-lg font-bold text-primary hover:underline cursor-pointer"
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                >
                                    {project.title}
                                </h3>
                                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold
                                    ${project.status === 'Open' ? 'bg-primary/10 text-primary' :
                                        project.status === 'In_Progress' ? 'bg-secondary text-secondary-foreground' :
                                            project.status === 'Payment_Pending' ? 'bg-indigo-500/10 text-indigo-500' :
                                                project.status === 'Refund_Pending' ? 'bg-destructive/10 text-destructive' :
                                                    'bg-green-500/10 text-green-500'}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 max-w-3xl">
                                {project.description}
                            </p>
                        </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex flex-wrap text-sm gap-y-3 gap-x-8 text-muted-foreground mb-6 relative">
                        {/* DEBUG BADGE - Remove in production */}
                        <div className="absolute top-[-30px] right-0 text-[10px] text-muted-foreground font-mono border border-border px-1 rounded">
                            DEBUG: {project.status}
                        </div>

                        <div className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                            <span className="text-lg">₹ {project.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground/70" />
                            <span>{project.applicationsCount} applications</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground/70" />
                            <span>{project.duration}</span>
                        </div>
                        {['In_Progress', 'Pending_Completion', 'Payment_Pending', 'Refund_Pending'].includes(project.status) && (
                            <div className="flex items-center gap-2 px-2 py-0.5 bg-amber-500/10 rounded text-amber-600 dark:text-amber-400 font-medium text-xs border border-amber-500/20">
                                <Lock className="w-3 h-3" />
                                In Escrow
                            </div>
                        )}
                    </div>

                    {/* Working With Section (For In Progress / Pending) */}
                    {['In_Progress', 'Pending_Completion', 'Payment_Pending', 'Refund_Pending', 'Completed'].includes(project.status) && project.acceptedContributor && (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
                                    {project.acceptedContributor.avatarUrl ? (
                                        <img src={project.acceptedContributor.avatarUrl} alt={project.acceptedContributor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-bold">
                                            {project.acceptedContributor.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Working with</p>
                                    <p className="text-sm font-bold text-foreground">{project.acceptedContributor.name}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/projects/${project.id}?chat=true`)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded text-foreground text-sm font-medium hover:bg-secondary transition-colors"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Chat
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded text-foreground text-sm font-medium hover:bg-secondary transition-colors">
                                    <Phone className="w-4 h-4" />
                                    Call
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Review Block */}
                    {project.status === 'Pending_Completion' && (
                        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">Review Project Completion</h4>
                            <p className="text-blue-600 dark:text-blue-300 text-sm mb-4">
                                Has the contributor completed the project to your satisfaction? Your payment of <span className="font-bold">₹{project.budget.toLocaleString()}</span> is held in escrow.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleReviewCompletion(project.id, 'APPROVE')}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve & Release Payment
                                </button>
                                <button
                                    onClick={() => handleRejectClick(project.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg text-sm font-bold transition-colors shadow-sm"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Reject & Dispute
                                </button>
                            </div>
                        </div>
                    )}

                    {project.status === 'Payment_Pending' && (
                        <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
                            <Clock className="w-5 h-5" />
                            <div>
                                <h4 className="font-bold text-sm">Payment Release Pending Approval</h4>
                                <p className="text-xs mt-0.5">Admin approval is required to release the payment. This usually takes 24-48 hours.</p>
                            </div>
                        </div>
                    )}

                    {project.status === 'Refund_Pending' && (
                        <div className="mt-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3 text-destructive">
                            <Clock className="w-5 h-5" />
                            <div>
                                <h4 className="font-bold text-sm">Refund Pending Approval</h4>
                                <p className="text-xs mt-0.5">Admin approval is required to process the refund.</p>
                            </div>
                        </div>
                    )}


                </div>
            ))}
            {isRejectModalOpen && selectedProjectId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-foreground mb-2">Reject Project Completion</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Please provide a detailed reason for rejecting the project completion. This will be reviewed by an admin during the dispute resolution process.
                            </p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why the work is not satisfactory..."
                                className="w-full h-32 px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-destructive focus:border-destructive resize-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
                            <button
                                onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setRejectionReason('');
                                    setSelectedProjectId(null);
                                }}
                                className="px-4 py-2 text-muted-foreground font-medium hover:bg-secondary rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRejection}
                                disabled={!rejectionReason.trim()}
                                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ContributingProjectsTab({ projects, refreshData }: { projects: Project[]; refreshData: () => Promise<void> }) {
    const navigate = useNavigate();
    const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReportProject, setSelectedReportProject] = useState<Project | null>(null);
    const [reportDescription, setReportDescription] = useState('');
    const [reportCategory, setReportCategory] = useState('Payment Dispute');

    const handleOpenReportModal = (project: Project) => {
        setSelectedReportProject(project);
        setReportDescription('');
        setIsReportModalOpen(true);
    };

    const handleSubmitReport = async () => {
        if (!selectedReportProject) return;

        try {
            await createReport({
                type: 'PROJECT_DISPUTE',
                category: reportCategory,
                description: reportDescription,
                projectId: selectedReportProject.id,
                targetUserId: selectedReportProject.clientId // Reporting the client
            });
            toast.success('Dispute reported to admin successfully');
            setIsReportModalOpen(false);
        } catch (error: any) {
            console.error('Failed to submit report:', error);
            toast.error(error?.response?.data?.message || 'Failed to submit report');
        }
    };

    if (projects.length === 0) {
        return (
            <EmptyState
                icon={Layout}
                title="No active projects"
                description="You haven't been hired for any projects yet."
            />
        );
    }

    const handleMarkComplete = async (projectId: string) => {
        setLoadingProjectId(projectId);
        try {
            await projectService.requestCompletion(projectId);
            toast.success("Project completion requested! The client will be notified to verify.", {
                icon: '🎉',
                duration: 4000
            });
            await refreshData();
        } catch (error: any) {
            console.error('Failed to request completion:', error);
            toast.error(error?.response?.data?.message || 'Failed to request project completion');
        } finally {
            setLoadingProjectId(null);
        }
    };

    return (
        <div className="space-y-6">
            {projects.map((project) => (
                <div key={project.id} className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="text-lg font-semibold text-primary hover:underline cursor-pointer"
                                >
                                    {project.title}
                                </h3>
                                <span className={`text-xs px-2 py-0.5 rounded font-medium 
                                    ${project.status === 'In_Progress' ? 'bg-amber-500/10 text-amber-600' :
                                        project.status === 'Pending_Completion' ? 'bg-purple-500/10 text-purple-600' :
                                            project.status === 'Payment_Pending' ? 'bg-indigo-500/10 text-indigo-600' :
                                                project.status === 'Refund_Pending' ? 'bg-destructive/10 text-destructive' :
                                                    'bg-secondary text-muted-foreground'}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
                                <span>₹ {project.budget.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{project.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                {project.client?.avatarUrl ? (
                                    <img src={project.client.avatarUrl} alt={project.client.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold bg-muted">
                                        {project.client?.name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Project Creator</p>
                                <p className="text-sm font-semibold text-foreground">{project.client?.name || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/projects/${project.id}?chat=true`)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded text-foreground text-sm font-medium hover:bg-secondary transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Chat
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded text-foreground text-sm font-medium hover:bg-secondary transition-colors">
                                <Phone className="w-4 h-4" />
                                Call
                            </button>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-foreground mb-3">Project Details</h4>
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                {project.description}
                            </p>
                            {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-card border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex justify-end pt-4 border-t border-border">
                        {project.status === 'Completed' ? (
                            <div className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-500/10 px-3 py-2 rounded-lg">
                                <span className="text-lg">✓</span>
                                Project Completed
                            </div>
                        ) : project.status === 'Pending_Completion' ? (
                            <div className="flex items-center gap-2 text-purple-600 font-medium text-sm bg-purple-500/10 px-3 py-2 rounded-lg">
                                <Clock className="w-4 h-4" />
                                Verification Pending
                            </div>
                        ) : project.status === 'Refund_Pending' ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-destructive font-medium text-sm bg-destructive/10 px-3 py-2 rounded-lg">
                                    <AlertTriangle className="w-4 h-4" />
                                    Refund Requested
                                </div>
                                <button
                                    onClick={() => handleOpenReportModal(project)}
                                    className="flex items-center gap-2 px-4 py-2 border border-destructive/30 text-destructive font-medium rounded-lg hover:bg-destructive/10 transition-colors"
                                >
                                    Report Dispute
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleMarkComplete(project.id)}
                                disabled={loadingProjectId === project.id}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm ${loadingProjectId === project.id
                                    ? 'bg-primary/70 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90'
                                    } text-primary-foreground`}
                            >
                                {loadingProjectId === project.id ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Mark as Completed
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {/* Report Dispute Modal */}
            {isReportModalOpen && selectedReportProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-foreground mb-2">Report Dispute</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                If you believe the client's refund request is unjustified, please provide details below. An admin will review the project chat and work logic.
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-foreground mb-1">Reason</label>
                                <select
                                    value={reportCategory}
                                    onChange={(e) => setReportCategory(e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm text-foreground"
                                >
                                    <option value="Payment Dispute">Payment Dispute - Work Completed</option>
                                    <option value="Unresponsive Client">Unresponsive Client</option>
                                    <option value="Scope Creep">Scope Creep / Extra Work Demanded</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                                <textarea
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    placeholder="Explain your side of the story..."
                                    className="w-full h-32 px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="px-4 py-2 text-muted-foreground font-medium hover:bg-secondary rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                disabled={!reportDescription.trim()}
                                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MyApplicationsTab({ applications }: { applications: ProjectApplication[] }) {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

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
        return 'completed';
    };

    if (applications.length === 0) {
        return (
            <EmptyState
                icon={FileText}
                title="No applications sent"
                description="Start browsing projects to apply."
            />
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((app) => {
                // Find latest interview if exists
                const interview = app.interviews && app.interviews.length > 0
                    ? app.interviews[0]
                    : null;
                const interviewState = getInterviewState(interview);
                const isShortlisted = app.status === 'SHORTLISTED';

                return (
                    <div key={app.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3
                                    className="text-lg font-semibold text-foreground mb-1 hover:text-primary cursor-pointer transition-colors"
                                    onClick={() => navigate(`/projects/${app.projectId}`)}
                                >
                                    {app.project?.title || 'Unknown Project'}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-600' :
                                            app.status === 'SHORTLISTED' ? 'bg-primary/10 text-primary' :
                                                app.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                                                    'bg-secondary text-muted-foreground'}`}>
                                        {app.status}
                                    </span>
                                    {interviewState === 'upcoming' && (
                                        <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Interview Scheduled
                                        </span>
                                    )}
                                </div>
                            </div>

                            {app.matchScore && (
                                <div className="flex flex-col items-end">
                                    <span className="text-sm text-muted-foreground">LLM Match Score</span>
                                    <span className="text-lg font-bold text-primary">{app.matchScore}%</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                            <div>
                                <span className="block text-muted-foreground text-xs">Proposed Budget</span>
                                <span className="font-medium text-foreground">
                                    {app.proposedBudget ? `₹${app.proposedBudget.toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-muted-foreground text-xs">Proposed Duration</span>
                                <span className="font-medium text-foreground">{app.proposedDuration || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-muted-foreground text-xs">Applied On</span>
                                <span className="font-medium text-foreground">{new Date(app.appliedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Dynamic Interview Section */}
                        {isShortlisted && interview && (
                            <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                                        <Video className="w-4 h-4" />
                                        Video Interview
                                    </h4>

                                    {interviewState === 'upcoming' && (
                                        <p className="text-xs text-primary/80 mt-1">
                                            Scheduled for: <span className="font-medium">{new Date(interview.scheduledAt).toLocaleString()}</span>
                                        </p>
                                    )}
                                    {interviewState === 'active' && (
                                        <p className="text-xs text-primary/80 mt-1">
                                            The interview has started. Please join now.
                                        </p>
                                    )}
                                    {interviewState === 'completed' && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            This interview is completed.
                                        </p>
                                    )}
                                    {interviewState === 'none' && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Waiting for the client to schedule.
                                        </p>
                                    )}
                                </div>

                                {interviewState === 'active' && (
                                    <button
                                        onClick={() => navigate(`/session/interview/${interview.id}/call`)}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm animate-pulse flex items-center gap-2"
                                    >
                                        <Video className="w-4 h-4" />
                                        Join Now
                                    </button>
                                )}

                                {interviewState === 'upcoming' && (
                                    <div className="px-4 py-2 bg-card text-primary rounded-lg text-sm font-medium border border-border shadow-sm">
                                        Starts in {Math.ceil((new Date(interview.scheduledAt).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h
                                    </div>
                                )}
                            </div>
                        )}

                        {isShortlisted && !interview && (
                            <div className="bg-muted/50 border border-border p-3 rounded-lg text-xs text-muted-foreground mt-4">
                                Application Shortlisted. Waiting for client to schedule an interview.
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function ApplicantsTab({
    applications,
    refreshData,
    onScheduleInterview
}: {
    applications: ProjectApplication[];
    refreshData: () => void;
    onScheduleInterview: (appId: string) => void;
}) {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute to refresh button states
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleStatusUpdate = async (appId: string, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            await projectApplicationService.updateStatus(appId, status);
            toast.success(`Application ${status.toLowerCase()} successfully`);
            refreshData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const getInterviewState = (interview: any) => {
        if (!interview) return 'none';

        // Check explicit status first
        if (interview.status === 'COMPLETED') return 'completed';
        if (interview.status === 'CANCELLED') return 'cancelled';

        const scheduledTime = new Date(interview.scheduledAt);
        const durationMs = interview.durationMinutes * 60 * 1000;
        const endTime = new Date(scheduledTime.getTime() + durationMs);

        // Allow joining 10 mins before start until 15 mins after end (for wrap up/rejoin)
        const joinWindowStart = new Date(scheduledTime.getTime() - 10 * 60 * 1000);
        const joinWindowEnd = new Date(endTime.getTime() + 15 * 60 * 1000);

        if (currentTime < joinWindowStart) return 'upcoming';
        if (currentTime >= joinWindowStart && currentTime <= joinWindowEnd) return 'active';
        return 'completed';
    };

    if (applications.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title="No applicants yet"
                description="Wait for freelancers to apply to your projects."
            />
        );
    }

    return (
        <div className="space-y-6">
            {applications.map((app) => {
                const interview = app.interviews && app.interviews.length > 0 ? app.interviews[0] : null;
                const interviewState = getInterviewState(interview);
                const isInterviewScheduled = !!interview;

                return (
                    <div key={app.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                        {/* Header: Project Badge & Status */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Application for:</span>
                                <span className="text-sm font-medium text-primary cursor-pointer hover:underline" onClick={() => navigate(`/projects/${app.projectId}`)}>{app.project?.title}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                ${app.status === 'PENDING' ? 'bg-secondary text-muted-foreground' :
                                    app.status === 'SHORTLISTED' ? 'bg-primary/10 text-primary' :
                                        app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-600' :
                                            app.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                                                'bg-secondary text-foreground'}`}>
                                {app.status === 'SHORTLISTED' && isInterviewScheduled
                                    ? (interviewState === 'completed' ? 'Interview Completed' : 'Interview Scheduled')
                                    : app.status}
                            </span>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden border border-border">
                                {app.applicant?.avatarUrl ? (
                                    <img src={app.applicant.avatarUrl} alt={app.applicant.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-lg font-bold text-muted-foreground">{app.applicant?.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-foreground">{app.applicant?.name || 'Unknown User'}</h3>
                                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                    <span className="text-amber-500">★</span>
                                    <span>{app.applicant?.rating || 'New'}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Match Score Banner */}
                        {app.matchScore && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">AI Match Score:</span>
                                    <div className="text-sm text-emerald-700 dark:text-emerald-300">
                                        <span className="font-bold">{app.matchScore}%</span>
                                        <span className="mx-1">-</span>
                                        <span>
                                            {app.matchScore >= 90 ? 'Excellent match!' :
                                                app.matchScore >= 80 ? 'Good match' :
                                                    app.matchScore >= 70 ? 'Fair match' : 'Low match'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Proposal Text */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-foreground mb-2">Proposal:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {app.coverLetter}
                            </p>
                        </div>

                        {/* Details Row (Duration, Budget, Applied) */}
                        <div className="flex flex-wrap gap-12 mb-6 border-b border-border pb-6">
                            <div>
                                <span className="block text-xs text-muted-foreground mb-1">Duration</span>
                                <span className="block text-sm font-bold text-foreground">{app.proposedDuration || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground mb-1">Budget</span>
                                <span className="block text-sm font-bold text-foreground">
                                    {app.proposedBudget ? `₹${app.proposedBudget.toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground mb-1">Applied</span>
                                <span className="block text-sm font-bold text-foreground">
                                    {new Date(app.appliedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            {/* Case 1: Shortlisted with Interview */}
                            {app.status === 'SHORTLISTED' && isInterviewScheduled ? (
                                <>
                                    {/* Future Interview */}
                                    {interviewState === 'upcoming' && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20">
                                            <Calendar className="w-4 h-4" />
                                            Scheduled: {new Date(interview.scheduledAt).toLocaleString()}
                                        </div>
                                    )}

                                    {/* Active Interview Window (Join Button) */}
                                    {interviewState === 'active' && (
                                        <button
                                            onClick={() => navigate(`/session/interview/${interview.id}/call`)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-md animate-pulse"
                                        >
                                            <Video className="w-4 h-4" />
                                            Join Live Interview
                                        </button>
                                    )}

                                    {/* Completed Interview (Decision Buttons) */}
                                    {interviewState === 'completed' && (
                                        <>
                                            <div className="px-3 py-2 bg-secondary text-muted-foreground rounded-lg text-sm font-medium mr-2">
                                                Interview Completed
                                            </div>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                                            >
                                                Accept Applicant
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg text-sm font-bold transition-colors shadow-sm"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                </>
                            ) : (
                                /* Case 2: Pending/Reviewed (Decision or Schedule) */
                                (app.status === 'PENDING' || app.status === 'REVIEWED') ? (
                                    <>
                                        <button
                                            onClick={() => onScheduleInterview(app.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:bg-secondary text-foreground rounded-lg text-sm font-bold transition-colors"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            Schedule Interview
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                            className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    /* Case 3: Final States */
                                    <div className={`px-4 py-2 rounded-lg text-sm font-medium border
                                        ${app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                            app.status === 'REJECTED' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                'bg-secondary text-muted-foreground border-border'}`}>
                                        {app.status === 'ACCEPTED' ? 'Application Accepted' :
                                            app.status === 'REJECTED' ? 'Application Rejected' :
                                                app.status === 'WITHDRAWN' ? 'Application Withdrawn' : app.status}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: any) {
    return (
        <div className="py-16 text-center bg-card rounded-xl border border-border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
