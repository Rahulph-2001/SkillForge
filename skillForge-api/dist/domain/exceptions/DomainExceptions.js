"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidStateTransitionError = exports.BusinessRuleViolationError = exports.DuplicateEntityError = exports.EntityNotFoundError = exports.DomainValidationError = exports.DomainException = void 0;
/**
 * Base class for all domain exceptions
 */
class DomainException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainException = DomainException;
/**
 * Thrown when domain validation rules are violated
 */
class DomainValidationError extends DomainException {
    constructor(message, field, value) {
        super(message);
        this.field = field;
        this.value = value;
    }
}
exports.DomainValidationError = DomainValidationError;
/**
 * Thrown when a required entity is not found
 */
class EntityNotFoundError extends DomainException {
    constructor(entityName, identifier) {
        super(`${entityName} not found: ${JSON.stringify(identifier)}`);
        this.entityName = entityName;
        this.identifier = identifier;
    }
}
exports.EntityNotFoundError = EntityNotFoundError;
/**
 * Thrown when attempting to create a duplicate entity
 */
class DuplicateEntityError extends DomainException {
    constructor(entityName, field, value) {
        super(`${entityName} with ${field} '${value}' already exists`);
        this.entityName = entityName;
        this.field = field;
        this.value = value;
    }
}
exports.DuplicateEntityError = DuplicateEntityError;
/**
 * Thrown when a business rule is violated
 */
class BusinessRuleViolationError extends DomainException {
    constructor(message, rule) {
        super(message);
        this.rule = rule;
    }
}
exports.BusinessRuleViolationError = BusinessRuleViolationError;
/**
 * Thrown when an invalid state transition is attempted
 */
class InvalidStateTransitionError extends DomainException {
    constructor(currentState, attemptedState, message) {
        super(message || `Cannot transition from '${currentState}' to '${attemptedState}'`);
        this.currentState = currentState;
        this.attemptedState = attemptedState;
    }
}
exports.InvalidStateTransitionError = InvalidStateTransitionError;
//# sourceMappingURL=DomainExceptions.js.map