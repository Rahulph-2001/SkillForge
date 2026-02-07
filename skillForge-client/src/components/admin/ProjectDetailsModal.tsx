import React, { useEffect, useState } from 'react';
import adminService, { AdminProjectDetails } from '../../services/adminService';
import './ProjectDetailsModal.css';

interface ProjectDetailsModalProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuspend?: (projectId: string) => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
    projectId,
    isOpen,
    onClose,
    onSuspend
}) => {
    const [project, setProject] = useState<AdminProjectDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && projectId) {
            loadProjectDetails();
        }
    }, [isOpen, projectId]);

    const loadProjectDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const details = await adminService.getProjectDetails(projectId);
            setProject(details);
        } catch (err: any) {
            setError(err?.message || 'Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = () => {
        if (onSuspend) {
            onSuspend(projectId);
        }
        onClose();
    };

    if (!isOpen) return null;

    const getStatusBadge = (status: string) => {
        const statusClasses: Record<string, string> = {
            'OPEN': 'badge-info',
            'IN_PROGRESS': 'badge-warning',
            'PENDING_COMPLETION': 'badge-primary',
            'PAYMENT_PENDING': 'badge-accent',
            'REFUND_PENDING': 'badge-error',
            'COMPLETED': 'badge-success',
            'CANCELLED': 'badge-neutral',
        };
        return statusClasses[status] || 'badge-neutral';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content project-details-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                {loading && (
                    <div className="modal-loading">
                        <div className="spinner"></div>
                        <p>Loading project details...</p>
                    </div>
                )}

                {error && (
                    <div className="modal-error">
                        <p>{error}</p>
                        <button onClick={loadProjectDetails}>Retry</button>
                    </div>
                )}

                {project && !loading && (
                    <>
                        <div className="modal-header">
                            <h2>{project.title}</h2>
                            <div className="modal-badges">
                                <span className={`badge ${getStatusBadge(project.status)}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                                {project.isSuspended && (
                                    <span className="badge badge-error">Suspended</span>
                                )}
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="details-section">
                                <h3>Project Information</h3>
                                <div className="details-grid">
                                    <div className="details-item">
                                        <span className="label">Category</span>
                                        <span className="value">{project.category}</span>
                                    </div>
                                    <div className="details-item">
                                        <span className="label">Budget</span>
                                        <span className="value">{project.budget} Credits</span>
                                    </div>
                                    <div className="details-item">
                                        <span className="label">Duration</span>
                                        <span className="value">{project.duration}</span>
                                    </div>
                                    <div className="details-item">
                                        <span className="label">Deadline</span>
                                        <span className="value">{project.deadline || 'No deadline'}</span>
                                    </div>
                                    <div className="details-item">
                                        <span className="label">Applications</span>
                                        <span className="value">{project.applicationsCount}</span>
                                    </div>
                                    <div className="details-item">
                                        <span className="label">Created</span>
                                        <span className="value">{formatDate(project.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="details-description">
                                    <span className="label">Description</span>
                                    <p>{project.description}</p>
                                </div>

                                {project.tags && project.tags.length > 0 && (
                                    <div className="details-tags">
                                        <span className="label">Tags</span>
                                        <div className="tags-list">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {project.isSuspended && (
                                <div className="details-section suspension-info">
                                    <h3>⚠️ Suspension Details</h3>
                                    <div className="details-grid">
                                        <div className="details-item">
                                            <span className="label">Suspended At</span>
                                            <span className="value">{formatDate(project.suspendedAt)}</span>
                                        </div>
                                        <div className="details-item full-width">
                                            <span className="label">Reason</span>
                                            <span className="value">{project.suspendReason || 'No reason provided'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="details-section">
                                <h3>Creator</h3>
                                <div className="user-card">
                                    <div className="user-avatar">
                                        {project.creator.avatarUrl ? (
                                            <img src={project.creator.avatarUrl} alt={project.creator.name} />
                                        ) : (
                                            <div className="avatar-placeholder">{project.creator.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">{project.creator.name}</span>
                                        <span className="user-email">{project.creator.email}</span>
                                    </div>
                                </div>
                            </div>

                            {project.contributor && (
                                <div className="details-section">
                                    <h3>Contributor</h3>
                                    <div className="user-card">
                                        <div className="user-avatar">
                                            {project.contributor.avatarUrl ? (
                                                <img src={project.contributor.avatarUrl} alt={project.contributor.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{project.contributor.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="user-info">
                                            <span className="user-name">{project.contributor.name}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {project.escrow && (
                                <div className="details-section escrow-info">
                                    <h3>💰 Escrow Information</h3>
                                    <div className="details-grid">
                                        <div className="details-item">
                                            <span className="label">Amount Held</span>
                                            <span className="value">{project.escrow.amountHeld} Credits</span>
                                        </div>
                                        <div className="details-item">
                                            <span className="label">Status</span>
                                            <span className="value">{project.escrow.status}</span>
                                        </div>
                                        <div className="details-item">
                                            <span className="label">Release To</span>
                                            <span className="value">{project.escrow.releaseTo}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            {!project.isSuspended && onSuspend && (
                                <button
                                    className="btn btn-danger"
                                    onClick={handleSuspend}
                                >
                                    Suspend Project
                                </button>
                            )}
                            <button className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailsModal;
