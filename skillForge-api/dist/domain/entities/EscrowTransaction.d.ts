export declare enum EscrowStatus {
    HELD = "HELD",
    RELEASED = "RELEASED",
    REFUNDED = "REFUNDED"
}
export interface EscrowTransactionProps {
    id?: string;
    bookingId: string;
    learnerId: string;
    providerId: string;
    amount: number;
    status: EscrowStatus;
    heldAt: Date;
    releasedAt?: Date | null;
    refundedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class EscrowTransaction {
    private readonly props;
    private constructor();
    static create(props: EscrowTransactionProps): EscrowTransaction;
    static createNew(bookingId: string, learnerId: string, providerId: string, amount: number): EscrowTransaction;
    private validate;
    get id(): string | undefined;
    get bookingId(): string;
    get learnerId(): string;
    get providerId(): string;
    get amount(): number;
    get status(): EscrowStatus;
    get heldAt(): Date;
    get releasedAt(): Date | null | undefined;
    get refundedAt(): Date | null | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    isHeld(): boolean;
    isReleased(): boolean;
    isRefunded(): boolean;
    canBeReleased(): boolean;
    canBeRefunded(): boolean;
    toObject(): EscrowTransactionProps;
    static fromDatabaseRow(data: any): EscrowTransaction;
}
//# sourceMappingURL=EscrowTransaction.d.ts.map