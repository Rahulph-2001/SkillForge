import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Configure axios defaults for this service
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Community interfaces
export interface Community {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string | null;
    videoUrl: string | null;
    adminId: string;
    creditsCost: number;
    creditsPeriod: string;
    membersCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isAdmin?: boolean;
    isJoined?: boolean;
}

export interface CommunityMember {
    id: string;
    userId: string;
    userName?: string;
    userAvatar?: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    isActive: boolean;
}

export interface CommunityMessage {
    id: string;
    communityId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string | null;
    content: string;
    type: 'text' | 'image' | 'video' | 'file';
    fileUrl?: string | null;
    fileName?: string | null;
    isPinned: boolean;
    pinnedAt?: Date | null;
    pinnedBy?: string | null;
    replyToId?: string | null;
    forwardedFromId?: string | null;
    replyTo?: CommunityMessage;
    reactions?: Array<{
        emoji: string;
        count: number;
        users: Array<{ id: string; name: string; avatar?: string }>;
        hasReacted: boolean;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

// Get all communities
export const getCommunities = async (category?: string): Promise<Community[]> => {
    const params = category ? { category } : {};

    const response = await api.get('/communities', {
        params,
    });

    return response.data.data;
};

// Get community details
export const getCommunityDetails = async (id: string): Promise<Community> => {
    const response = await api.get(`/communities/${id}`);

    return response.data.data;
};

// Create community
export const createCommunity = async (data: {
    name: string;
    description: string;
    category: string;
    creditsCost?: number;
    creditsPeriod?: string;
    image?: File;
}): Promise<Community> => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.creditsCost !== undefined) formData.append('creditsCost', data.creditsCost.toString());
    if (data.creditsPeriod) formData.append('creditsPeriod', data.creditsPeriod);
    if (data.image) formData.append('image', data.image);

    const response = await api.post('/communities', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

// Update community
export const updateCommunity = async (
    id: string,
    data: {
        name?: string;
        description?: string;
        category?: string;
        creditsCost?: number;
        creditsPeriod?: string;
        image?: File;
    }
): Promise<Community> => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.creditsCost !== undefined) formData.append('creditsCost', data.creditsCost.toString());
    if (data.creditsPeriod) formData.append('creditsPeriod', data.creditsPeriod);
    if (data.image) formData.append('image', data.image);

    const response = await api.put(`/communities/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

// Join community
export const joinCommunity = async (id: string): Promise<void> => {
    await api.post(`/communities/${id}/join`);
};

// Leave community
export const leaveCommunity = async (id: string): Promise<void> => {
    await api.post(`/communities/${id}/leave`);
};

// Get community members
export const getCommunityMembers = async (
    id: string,
    limit = 50,
    offset = 0
): Promise<{ members: CommunityMember[]; total: number }> => {
    const response = await api.get(`/communities/${id}/members`, {
        params: { limit, offset },
    });

    return response.data.data;
};

// Remove community member (admin only)
export const removeCommunityMember = async (
    communityId: string,
    memberId: string
): Promise<void> => {
    await api.delete(`/communities/${communityId}/members/${memberId}`);
};

// Send message
export const sendMessage = async (data: {
    communityId: string;
    content: string;
    type?: 'text' | 'image' | 'video' | 'file';
    replyToId?: string;
    forwardedFromId?: string;
    file?: File;
}): Promise<CommunityMessage> => {
    const formData = new FormData();

    formData.append('communityId', data.communityId);
    formData.append('content', data.content);
    if (data.type) formData.append('type', data.type);
    if (data.replyToId) formData.append('replyToId', data.replyToId);
    if (data.forwardedFromId) formData.append('forwardedFromId', data.forwardedFromId);
    if (data.file) formData.append('file', data.file);

    const response = await api.post(
        `/communities/${data.communityId}/messages`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data.data;
};

// Get messages
export const getMessages = async (
    communityId: string,
    limit = 50,
    offset = 0
): Promise<CommunityMessage[]> => {
    const response = await api.get(`/communities/${communityId}/messages`, {
        params: { limit, offset },
    });

    return response.data.data;
};

// Pin message (admin only)
export const pinMessage = async (messageId: string): Promise<CommunityMessage> => {
    const response = await api.post(`/communities/messages/${messageId}/pin`);

    return response.data.data;
};

// Unpin message (admin only)
export const unpinMessage = async (messageId: string): Promise<CommunityMessage> => {
    const response = await api.post(`/communities/messages/${messageId}/unpin`);

    return response.data.data;
};

// Delete message
export const deleteMessage = async (messageId: string): Promise<void> => {
    await api.delete(`/communities/messages/${messageId}`);
};

// Add reaction
export const addReaction = async (messageId: string, emoji: string): Promise<void> => {
    await api.post(`/communities/messages/${messageId}/reactions`, { emoji });
};

// Remove reaction
export const removeReaction = async (
    communityId: string,
    messageId: string,
    emoji: string
): Promise<void> => {
    await api.delete(`/communities/${communityId}/messages/${messageId}/reactions`, {
        data: { emoji },
    });
};

/**
 * Block community by admin (admin-only operation)
 */
export const blockCommunityByAdmin = async (communityId: string, reason?: string): Promise<void> => {
    await api.post(`/admin/communities/${communityId}/block`, {
        reason,
    });
};

/**
 * Unblock community by admin (admin-only operation)
 */
export const unblockCommunityByAdmin = async (communityId: string, reason?: string): Promise<void> => {
    await api.post(`/admin/communities/${communityId}/unblock`, {
        reason,
    });
};

