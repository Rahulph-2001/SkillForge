"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditPackage = void 0;
const uuid_1 = require("uuid");
class CreditPackage {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
        this._credits = props.credits;
        this._price = props.price;
        this._isPopular = props.isPopular || false;
        this._isActive = props.isActive ?? true;
        this._discount = props.discount || 0;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this._isDeleted = props.isDeleted || false;
        this.validate();
    }
    validate() {
        if (this._credits <= 0) {
            throw new Error('Credits must be greater than 0');
        }
        if (this._price < 0) {
            throw new Error('Price cannot be negative');
        }
    }
    // Getters
    get id() { return this._id; }
    get credits() { return this._credits; }
    get price() { return this._price; }
    get isPopular() { return this._isPopular; }
    get isActive() { return this._isActive; }
    get discount() { return this._discount; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get isDeleted() { return this._isDeleted; }
    // Setters / Business Logic
    update(props) {
        if (props.credits !== undefined)
            this._credits = props.credits;
        if (props.price !== undefined)
            this._price = props.price;
        if (props.isPopular !== undefined)
            this._isPopular = props.isPopular;
        if (props.isActive !== undefined)
            this._isActive = props.isActive;
        if (props.discount !== undefined)
            this._discount = props.discount;
        this._updatedAt = new Date();
        this.validate();
    }
    delete() {
        this._isDeleted = true;
        this._updatedAt = new Date();
    }
}
exports.CreditPackage = CreditPackage;
//# sourceMappingURL=CreditPackage.js.map