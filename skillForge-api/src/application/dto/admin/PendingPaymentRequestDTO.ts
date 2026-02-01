export interface PendingPaymentRequestDTO {
    id: string;
    projectId: string;
    projectTitle: string;
    type: 'RELEASE' | 'REFUND';
    amount: number;
    requestedBy: {
        id: string;
        name: string;
        email: string;
    };
    recipientId: string;
    status: 'PENDING';
    createdAt: Date;
}
