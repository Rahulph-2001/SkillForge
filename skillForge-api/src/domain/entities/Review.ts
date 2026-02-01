import { v4 as uuidv4 } from 'uuid';

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

export class Review {
    private readonly _id: string;
    private readonly _bookingId: string;
    private readonly _providerId: string;
    private readonly _learnerId: string;
    private readonly _skillId: string;
    private readonly _rating: number;
    private readonly _review: string;
    private readonly _createdAt: Date;

    constructor(props: CreateReviewProps) {
        this._id = props.id || uuidv4();
        this._bookingId = props.bookingId;
        this._providerId = props.providerId;
        this._learnerId = props.learnerId;
        this._skillId = props.skillId;
        this._rating = props.rating;
        this._review = props.review;
        this._createdAt = props.createdAt || new Date();

        this.validate();
    }

    private validate(): void {
        if (!this._bookingId) throw new Error('Booking ID is required');
        if (!this._providerId) throw new Error('Provider ID is required');
        if (!this._learnerId) throw new Error('Learner ID is required');
        if (!this._skillId) throw new Error('Skill ID is required');

        if (this._rating < 1 || this._rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        if (!this._review || this._review.trim().length === 0) {
            throw new Error('Review text is required');
        }
    }

    public get id(): string { return this._id; }
    public get bookingId(): string { return this._bookingId; }
    public get providerId(): string { return this._providerId; }
    public get learnerId(): string { return this._learnerId; }
    public get skillId(): string { return this._skillId; }
    public get rating(): number { return this._rating; }
    public get review(): string { return this._review; }
    public get createdAt(): Date { return this._createdAt; }
}
