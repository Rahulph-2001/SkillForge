"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(value) {
        if (!this.isValid(value)) {
            throw new Error('Invalid email address');
        }
        this._value = value.toLowerCase().trim();
    }
    get value() {
        return this._value;
    }
    isValid(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }
    equals(other) {
        return this._value === other._value;
    }
    toString() {
        return this._value;
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map