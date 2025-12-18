import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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
    createdAt: Date;
    updatedAt: Date;
    isAdmin?: boolean;
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
    createdAt: Date;
    updatedAt: Date;
}

// Get all communities
export const getCommunities = async (category?: string): Promise<Community[]> => {
    const token = localStorage.getItem('token');
    const params = category ? { category } : {};

    const response = await axios.get(`${API_URL}/communities`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });

    return response.data.data;
};

// Get community details
export const getCommunityDetails = async (id: string): Promise<Community> => {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/communities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

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
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.creditsCost !== undefined) formData.append('creditsCost', data.creditsCost.toString());
    if (data.creditsPeriod) formData.append('creditsPeriod', data.creditsPeriod);
    if (data.image) formData.append('image', data.image);

    const response = await axios.post(`${API_URL}/communities`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem('token');
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.creditsCost !== undefined) formData.append('creditsCost', data.creditsCost.toString());
    if (data.creditsPeriod) formData.append('creditsPeriod', data.creditsPeriod);
    if (data.image) formData.append('image', data.image);

    const response = await axios.put(`${API_URL}/communities/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

// Join community
export const joinCommunity = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');

    await axios.post(
        `${API_URL}/communities/${id}/join`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

// Leave community
export const leaveCommunity = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');

    await axios.post(
        `${API_URL}/communities/${id}/leave`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

// Get community members
export const getCommunityMembers = async (
    id: string,
    limit = 50,
    offset = 0
): Promise<{ members: CommunityMember[]; total: number }> => {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/communities/${id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit, offset },
    });

    return response.data.data;
};

// Remove community member (admin only)
export const removeCommunityMember = async (
    communityId: string,
    memberId: string
): Promise<void> => {
    const token = localStorage.getItem('token');

    await axios.delete(`${API_URL}/communities/${communityId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
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
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('communityId', data.communityId);
    formData.append('content', data.content);
    if (data.type) formData.append('type', data.type);
    if (data.replyToId) formData.append('replyToId', data.replyToId);
    if (data.forwardedFromId) formData.append('forwardedFromId', data.forwardedFromId);
    if (data.file) formData.append('file', data.file);

    const response = await axios.post(
        `${API_URL}/communities/${data.communityId}/messages`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/communities/${communityId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit, offset },
    });

    return response.data.data;
};

// Pin message (admin only)
export const pinMessage = async (messageId: string): Promise<CommunityMessage> => {
    const token = localStorage.getItem('token');

    const response = await axios.post(
        `${API_URL}/communities/messages/${messageId}/pin`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return response.data.data;
};

// Unpin message (admin only)
export const unpinMessage = async (messageId: string): Promise<CommunityMessage> => {
    const token = localStorage.getItem('token');

    const response = await axios.post(
        `${API_URL}/communities/messages/${messageId}/unpin`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return response.data.data;
};

// Delete message
export const deleteMessage = async (messageId: string): Promise<void> => {
    const token = localStorage.getItem('token');

    await axios.delete(`${API_URL}/communities/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
