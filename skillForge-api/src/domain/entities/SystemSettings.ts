export interface CreateSystemSettingsProps {
    id?: string;
    key: string;
    value: string;
    description?: string | null;
    updatedBy?: string | null;
    updatedAt?: Date;
}

export class SystemSettings {
    private readonly _id: string;
    private readonly _key: string;
    private _value: string;
    private _description: string | null;
    private _updatedBy: string | null;
    private _updatedAt: Date;

    constructor(props: CreateSystemSettingsProps) {
        this._id = props.id || crypto.randomUUID();
        this._key = props.key;
        this._value = props.value;
        this._description = props.description || null;
        this._updatedBy = props.updatedBy || null;
        this._updatedAt = props.updatedAt || new Date();

        this.validate();
    }

    private validate(): void {
        if (!this._key) {
            throw new Error('Key is required');
        }
        if (!this._value) {
            throw new Error('Value is required');
        }
    }

    get id(): string {
        return this._id;
    }

    get key(): string {
        return this._key;
    }

    get value(): string {
        return this._value;
    }

    get description(): string | null {
        return this._description;
    }

    get updatedBy(): string | null {
        return this._updatedBy;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateValue(value: string, updatedBy: string): void {
        this._value = value;
        this._updatedBy = updatedBy;
        this._updatedAt = new Date();
        this.validate();
    }
}
