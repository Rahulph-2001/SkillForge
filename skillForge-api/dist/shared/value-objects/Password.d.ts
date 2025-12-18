export declare class Password {
    private readonly _value;
    constructor(value: string, isHashed?: boolean);
    get value(): string;
    private isValid;
    equals(other: Password): boolean;
    toString(): string;
}
//# sourceMappingURL=Password.d.ts.map