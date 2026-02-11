export interface CreateCreditPackageProps {
    id?: string;
    credits: number;
    price: number;
    isPopular?: boolean;
    isActive?: boolean;
    discount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}
export declare class CreditPackage {
    private readonly _id;
    private _credits;
    private _price;
    private _isPopular;
    private _isActive;
    private _discount;
    private readonly _createdAt;
    private _updatedAt;
    private _isDeleted;
    constructor(props: CreateCreditPackageProps);
    private validate;
    get id(): string;
    get credits(): number;
    get price(): number;
    get isPopular(): boolean;
    get isActive(): boolean;
    get discount(): number;
    get createdAt(): Date;
    get updatedAt(): Date;
    get isDeleted(): boolean;
    update(props: Partial<{
        credits: number;
        price: number;
        isPopular: boolean;
        isActive: boolean;
        discount: number;
    }>): void;
    delete(): void;
}
//# sourceMappingURL=CreditPackage.d.ts.map