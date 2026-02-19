import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types/project';
import { Clock, Users, CheckCircle } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const navigate = useNavigate();

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'Open':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'In_Progress':
                return 'bg-muted text-muted-foreground';
            case 'Pending_Completion':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Payment_Pending':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'Refund_Pending':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Cancelled':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const formatStatus = (status: Project['status']) => {
        switch (status) {
            case 'In_Progress':
                return 'In Progress';
            case 'Pending_Completion':
                return 'Pending Completion';
            case 'Payment_Pending':
                return 'Payment Pending';
            case 'Refund_Pending':
                return 'Refund Pending';
            default:
                return status;
        }
    };

    return (
        <div
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-primary hover:text-primary/80">
                            {project.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {formatStatus(project.status)}
                        </span>
                    </div>
                </div>
                <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded border border-border">
                    {project.category}
                </span>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground font-medium">₹</span>
                        <span className="font-semibold text-foreground">{project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Users className="w-4 h-4" />
                        <span>{project.applicationsCount} applications</span>
                    </div>
                </div>

                {project.client && (
                    <div className="flex items-center gap-2">
                        {project.client.avatar ? (
                            <img
                                src={project.client.avatar}
                                alt={project.client.name}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">{project.client.name.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-foreground">{project.client.name}</span>
                                {project.client.isVerified && (
                                    <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-50 dark:fill-blue-900" />
                                )}
                            </div>
                            {project.client.rating !== undefined && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-muted-foreground">★ {project.client.rating}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
