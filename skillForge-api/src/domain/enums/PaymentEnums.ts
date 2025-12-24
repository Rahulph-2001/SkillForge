export enum PaymentProvider {
    STRIPE = 'STRIPE',
    PAYPAL = 'PAYPAL',
    RAZORPAY = 'RAZORPAY'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
    CANCELED = 'CANCELED',
    REFUNDED = 'REFUNDED'
}

export enum PaymentPurpose {
    SUBSCRIPTION = 'SUBSCRIPTION',
    CREDITS = 'CREDITS',
    PROJECT_POST = 'PROJECT_POST'
}

export enum Currency {
    INR = 'INR',
    USD = 'USD',
    EUR = 'EUR'
}