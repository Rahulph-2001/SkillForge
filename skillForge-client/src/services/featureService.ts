import api from './api';

export interface Feature {
    id: string;
    planId?: string;
    name: string;
    description?: string;
    featureType: 'BOOLEAN' | 'NUMERIC_LIMIT' | 'TEXT';
    limitValue?: number;
    isEnabled: boolean;
    displayOrder: number;
    isHighlighted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFeatureRequest {
    planId?: string;
    name: string;
    description?: string;
    featureType: 'BOOLEAN' | 'NUMERIC_LIMIT' | 'TEXT';
    limitValue?: number;
    isEnabled?: boolean;
    displayOrder?: number;
    isHighlighted?: boolean;
}

export interface UpdateFeatureRequest {
    name?: string;
    description?: string;
    limitValue?: number;
    displayOrder?: number;
    isEnabled?: boolean;
    isHighlighted?: boolean;
}

const featureService = {
    /**
     * Create a new feature
     */
    async createFeature(data: CreateFeatureRequest): Promise<Feature> {
        const response = await api.post('/admin/features', data);
        return response.data.data;
    },

    /**
     * List all library features (master features with no plan)
     */
    async listLibraryFeatures(): Promise<Feature[]> {
        return this.listFeatures();
    },

    /**
     * List all features (optionally filtered by planId)
     */
    async listFeatures(planId?: string, highlightedOnly?: boolean): Promise<Feature[]> {
        const params = new URLSearchParams();
        if (planId) params.append('planId', planId);
        if (highlightedOnly) params.append('highlightedOnly', 'true');

        const response = await api.get(`/admin/features?${params.toString()}`);
        return response.data.data;
    },

    /**
     * Get feature by ID
     */
    async getFeature(id: string): Promise<Feature> {
        const response = await api.get(`/admin/features/${id}`);
        return response.data.data;
    },

    /**
     * Update an existing feature
     */
    async updateFeature(id: string, data: UpdateFeatureRequest): Promise<Feature> {
        const response = await api.put(`/admin/features/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete a feature
     */
    async deleteFeature(id: string): Promise<void> {
        await api.delete(`/admin/features/${id}`);
    },
};

export default featureService;
