export interface Community {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string | null;
    videoUrl?: string | null;
    adminId: string;
    creditsCost: number;
    creditsPeriod: string;
    membersCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isAdmin?: boolean;
}

export interface CommunityMember {
    id: string;
    userId: string;
    name?: string;
    avatar?: string;
    role: 'admin' | 'member';
    joinedAt: string;
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
    pinnedAt?: string | null;
    pinnedBy?: string | null;
    replyToId?: string | null;
    forwardedFromId?: string | null;
    replyTo?: CommunityMessage;
    createdAt: string;
    updatedAt: string;
}

export interface CommunityStats {
    membersCount: number;
    creditsCost: number;
    creditsPeriod: string;
    daysRemaining?: number;
}
