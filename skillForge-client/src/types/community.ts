export interface Community {
    id: string;
    name: string;
    description: string;
    category: 'Technology' | 'Languages' | 'Music' | 'Fitness' | 'Creative' | 'Professional' | 'Business';
    imageUrl: string;
    membersCount: number;
    creditsCost: number;
    creditsPeriod: string; // e.g. "30 days"
    isJoined: boolean;
    daysRemaining?: number;
    adminId?: string;
    isAutoRenew?: boolean;
}

export interface CommunityMember {
    id: string;
    name: string;
    avatar?: string;
    role: 'admin' | 'member';
    joinedAt: string;
}

export interface CommunityMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: string; // ISO string
    isPinned?: boolean;
    type?: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
    reactions?: {
        emoji: string;
        count: number;
        userReacted: boolean;
    }[];
}

export interface CommunityStats {
    membersCount: number;
    creditsCost: number;
    creditsPeriod: string;
    daysRemaining?: number;
}
