/**
 * Base class for all domain exceptions
 */
export declare class DomainException extends Error {
    constructor(message: string);
}
/**
 * Thrown when domain validation rules are violated
 */
export declare class DomainValidationError extends DomainException {
    readonly field?: string | undefined;
    readonly value?: any | undefined;
    constructor(message: string, field?: string | undefined, value?: any | undefined);
}
/**
 * Thrown when a required entity is not found
 */
export declare class EntityNotFoundError extends DomainException {
    readonly entityName: string;
    readonly identifier: string | Record<string, any>;
    constructor(entityName: string, identifier: string | Record<string, any>);
}
/**
 * Thrown when attempting to create a duplicate entity
 */
export declare class DuplicateEntityError extends DomainException {
    readonly entityName: string;
    readonly field: string;
    readonly value: any;
    constructor(entityName: string, field: string, value: any);
}
/**
 * Thrown when a business rule is violated
 */
export declare class BusinessRuleViolationError extends DomainException {
    readonly rule: string;
    constructor(message: string, rule: string);
}
/**
 * Thrown when an invalid state transition is attempted
 */
export declare class InvalidStateTransitionError extends DomainException {
    readonly currentState: string;
    readonly attemptedState: string;
    constructor(currentState: string, attemptedState: string, message?: string);
}
//# sourceMappingURL=DomainExceptions.d.ts.map