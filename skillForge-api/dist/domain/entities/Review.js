"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const uuid_1 = require("uuid");
class Review {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
        this._bookingId = props.bookingId;
        this._providerId = props.providerId;
        this._learnerId = props.learnerId;
        this._skillId = props.skillId;
        this._rating = props.rating;
        this._review = props.review;
        this._createdAt = props.createdAt || new Date();
        this.validate();
    }
    validate() {
        if (!this._bookingId)
            throw new Error('Booking ID is required');
        if (!this._providerId)
            throw new Error('Provider ID is required');
        if (!this._learnerId)
            throw new Error('Learner ID is required');
        if (!this._skillId)
            throw new Error('Skill ID is required');
        if (this._rating < 1 || this._rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        if (!this._review || this._review.trim().length === 0) {
            throw new Error('Review text is required');
        }
    }
    get id() { return this._id; }
    get bookingId() { return this._bookingId; }
    get providerId() { return this._providerId; }
    get learnerId() { return this._learnerId; }
    get skillId() { return this._skillId; }
    get rating() { return this._rating; }
    get review() { return this._review; }
    get createdAt() { return this._createdAt; }
}
exports.Review = Review;
//# sourceMappingURL=Review.js.map