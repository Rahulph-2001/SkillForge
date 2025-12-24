/**
 * Base class for all domain exceptions
 */
export class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when domain validation rules are violated
 */
export class DomainValidationError extends DomainException {
    constructor(
        message: string,
        public readonly field?: string,
        public readonly value?: any
    ) {
        super(message);
    }
}

/**
 * Thrown when a required entity is not found
 */
export class EntityNotFoundError extends DomainException {
    constructor(
        public readonly entityName: string,
        public readonly identifier: string | Record<string, any>
    ) {
        super(`${entityName} not found: ${JSON.stringify(identifier)}`);
    }
}

/**
 * Thrown when attempting to create a duplicate entity
 */
export class DuplicateEntityError extends DomainException {
    constructor(
        public readonly entityName: string,
        public readonly field: string,
        public readonly value: any
    ) {
        super(`${entityName} with ${field} '${value}' already exists`);
    }
}

/**
 * Thrown when a business rule is violated
 */
export class BusinessRuleViolationError extends DomainException {
    constructor(
        message: string,
        public readonly rule: string
    ) {
        super(message);
    }
}

/**
 * Thrown when an invalid state transition is attempted
 */
export class InvalidStateTransitionError extends DomainException {
    constructor(
        public readonly currentState: string,
        public readonly attemptedState: string,
        message?: string
    ) {
        super(
            message || `Cannot transition from '${currentState}' to '${attemptedState}'`
        );
    }
}
