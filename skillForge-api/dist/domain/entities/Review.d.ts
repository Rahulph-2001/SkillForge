export interface CreateReviewProps {
    id?: string;
    bookingId: string;
    providerId: string;
    learnerId: string;
    skillId: string;
    rating: number;
    review: string;
    createdAt?: Date;
}
export declare class Review {
    private readonly _id;
    private readonly _bookingId;
    private readonly _providerId;
    private readonly _learnerId;
    private readonly _skillId;
    private readonly _rating;
    private readonly _review;
    private readonly _createdAt;
    constructor(props: CreateReviewProps);
    private validate;
    get id(): string;
    get bookingId(): string;
    get providerId(): string;
    get learnerId(): string;
    get skillId(): string;
    get rating(): number;
    get review(): string;
    get createdAt(): Date;
}
//# sourceMappingURL=Review.d.ts.map