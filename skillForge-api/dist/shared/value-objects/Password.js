"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
class Password {
    constructor(value, isHashed = false) {
        if (!isHashed) {
            if (!this.isValid(value)) {
                throw new Error('Password must be at least 8 characters long');
            }
        }
        this._value = value;
    }
    get value() {
        return this._value;
    }
    isValid(password) {
        if (!password || typeof password !== 'string') {
            return false;
        }
        return password.length >= 8;
    }
    equals(other) {
        return this._value === other._value;
    }
    toString() {
        return this._value;
    }
}
exports.Password = Password;
//# sourceMappingURL=Password.js.map