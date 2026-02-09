import { v4 as uuidv4 } from 'uuid';

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

export class CreditPackage {
  private readonly _id: string;
  private _credits: number;
  private _price: number;
  private _isPopular: boolean;
  private _isActive: boolean;
  private _discount: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _isDeleted: boolean;

  constructor(props: CreateCreditPackageProps) {
    this._id = props.id || uuidv4();
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

  private validate(): void {
    if (this._credits <= 0) {
      throw new Error('Credits must be greater than 0');
    }
    if (this._price < 0) {
      throw new Error('Price cannot be negative');
    }
  }

  // Getters
  public get id(): string { return this._id; }
  public get credits(): number { return this._credits; }
  public get price(): number { return this._price; }
  public get isPopular(): boolean { return this._isPopular; }
  public get isActive(): boolean { return this._isActive; }
  public get discount(): number { return this._discount; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get isDeleted(): boolean { return this._isDeleted; }

  // Setters / Business Logic
  public update(props: Partial<{
    credits: number;
    price: number;
    isPopular: boolean;
    isActive: boolean;
    discount: number;
  }>): void {
    if (props.credits !== undefined) this._credits = props.credits;
    if (props.price !== undefined) this._price = props.price;
    if (props.isPopular !== undefined) this._isPopular = props.isPopular;
    if (props.isActive !== undefined) this._isActive = props.isActive;
    if (props.discount !== undefined) this._discount = props.discount;

    this._updatedAt = new Date();
    this.validate();
  }

  public delete(): void {
    this._isDeleted = true;
    this._updatedAt = new Date();
  }
}
