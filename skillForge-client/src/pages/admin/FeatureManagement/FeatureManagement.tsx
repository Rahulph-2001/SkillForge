import React, { useState, useEffect, useCallback } from 'react';
import featureService, { Feature, CreateFeatureRequest, UpdateFeatureRequest, FeatureListResponse } from '../../../services/featureService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/common/Modal/ConfirmModal';
import Pagination from '../../../components/common/pagination/Pagination';
import './FeatureManagement.css';

const FeatureManagement: React.FC = () => {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [featureToToggle, setFeatureToToggle] = useState<Feature | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch features when pagination or search changes
    useEffect(() => {
        loadFeatures();
    }, [page, limit, debouncedSearch]);

    const loadFeatures = useCallback(async () => {
        try {
            setLoading(true);
            const data: FeatureListResponse = await featureService.listLibraryFeatures(
                page,
                limit,
                debouncedSearch || undefined
            );
            setFeatures(data.features);
            setTotalPages(data.pagination.totalPages);
            setTotalItems(data.pagination.total);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load features');
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleToggleStatus = (feature: Feature) => {
        setFeatureToToggle(feature);
        setShowConfirmModal(true);
    };

    const confirmToggleStatus = async () => {
        if (!featureToToggle) return;

        const newStatus = !featureToToggle.isEnabled;

        try {
            await featureService.updateFeature(featureToToggle.id, { isEnabled: newStatus });
            toast.success(`Feature ${newStatus ? 'unblocked' : 'blocked'} successfully`);
            loadFeatures();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to update feature`);
        } finally {
            setShowConfirmModal(false);
            setFeatureToToggle(null);
        }
    };

    const handleEdit = (feature: Feature) => {
        setSelectedFeature(feature);
        setShowEditModal(true);
    };

    const getFeatureTypeLabel = (type: string) => {
        switch (type) {
            case 'BOOLEAN': return 'Boolean';
            case 'NUMERIC_LIMIT': return 'Numeric Limit';
            case 'TEXT': return 'Text';
            default: return type;
        }
    };

    return (
        <div className="feature-management">
            <div className="feature-header">
                <h1>Master Feature Library</h1>
                <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                    + Create Feature
                </button>
            </div>

            {/* Search Input */}
            <div className="search-container" style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        width: '300px',
                    }}
                />
            </div>

            {loading ? (
                <div className="loading">Loading features...</div>
            ) : (
                <>
                    <div className="features-table-container">
                        <table className="features-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="no-data">No features found</td>
                                    </tr>
                                ) : (
                                    features.map((feature) => (
                                        <tr key={feature.id}>
                                            <td>
                                                <div className="feature-name">
                                                    {feature.name}
                                                    {feature.description && (
                                                        <span className="feature-desc">{feature.description}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${feature.featureType.toLowerCase()}`}>
                                                    {getFeatureTypeLabel(feature.featureType)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status ${feature.isEnabled ? 'enabled' : 'disabled'}`}>
                                                    {feature.isEnabled ? 'Active' : 'Blocked'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-edit" onClick={() => handleEdit(feature)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        className={`btn-${feature.isEnabled ? 'block' : 'unblock'}`}
                                                        onClick={() => handleToggleStatus(feature)}
                                                        style={{
                                                            backgroundColor: feature.isEnabled ? '#ef4444' : '#10b981',
                                                            color: 'white',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '0.375rem',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            marginLeft: '0.5rem'
                                                        }}
                                                    >
                                                        {feature.isEnabled ? 'Block' : 'Unblock'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                limit={limit}
                                onPageChange={handlePageChange}
                                onLimitChange={handleLimitChange}
                                showLimitSelector={true}
                                showInfo={true}
                            />
                        </div>
                    )}
                </>
            )}

            {showCreateModal && (
                <CreateFeatureModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        loadFeatures();
                    }}
                />
            )}

            {showEditModal && selectedFeature && (
                <EditFeatureModal
                    feature={selectedFeature}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedFeature(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedFeature(null);
                        loadFeatures();
                    }}
                />
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                title={featureToToggle?.isEnabled ? 'Block Feature' : 'Unblock Feature'}
                message={`Are you sure you want to ${featureToToggle?.isEnabled ? 'block' : 'unblock'} the feature "${featureToToggle?.name}"?`}
                confirmText={featureToToggle?.isEnabled ? 'Block' : 'Unblock'}
                cancelText="Cancel"
                type={featureToToggle?.isEnabled ? 'danger' : 'warning'}
                onConfirm={confirmToggleStatus}
                onCancel={() => {
                    setShowConfirmModal(false);
                    setFeatureToToggle(null);
                }}
            />
        </div>
    );
};

// Create Feature Modal Component
interface CreateFeatureModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CreateFeatureModal: React.FC<CreateFeatureModalProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<CreateFeatureRequest>({
        name: '',
        description: '',
        featureType: 'BOOLEAN',
        isEnabled: true,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await featureService.createFeature(formData);
            toast.success('Feature created successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create feature');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Feature</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Feature Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Feature Type *</label>
                        <select
                            value={formData.featureType}
                            onChange={(e) => setFormData({ ...formData, featureType: e.target.value as any })}
                            required
                        >
                            <option value="BOOLEAN">Boolean</option>
                            <option value="NUMERIC_LIMIT">Numeric Limit</option>
                            <option value="TEXT">Text</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isEnabled}
                                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                            />
                            <span>Active</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Feature'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Edit Feature Modal Component
interface EditFeatureModalProps {
    feature: Feature;
    onClose: () => void;
    onSuccess: () => void;
}

const EditFeatureModal: React.FC<EditFeatureModalProps> = ({ feature, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<UpdateFeatureRequest>({
        name: feature.name,
        description: feature.description,
        isEnabled: feature.isEnabled,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await featureService.updateFeature(feature.id, formData);
            toast.success('Feature updated successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update feature');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Feature</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Feature Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isEnabled}
                                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                            />
                            <span>Active</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Feature'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeatureManagement;