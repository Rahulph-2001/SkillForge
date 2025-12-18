export interface MessageResponseDTO {
    id: string;
    communityId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string | null;
    content: string;
    type: string;
    fileUrl: string | null;
    fileName: string | null;
    isPinned: boolean;
    pinnedAt: Date | null;
    pinnedBy: string | null;
    replyToId: string | null;
    forwardedFromId: string | null;
    replyTo?: MessageResponseDTO;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=MessageResponseDTO.d.ts.map