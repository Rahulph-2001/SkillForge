export interface WalletTransactionProps {
  id: string;
  adminId: string;
  type: 'CREDIT' | 'WITHDRAWAL' | 'DEBIT';
  amount: number;
  currency: string;
  source: string;
  referenceId?: string;
  description?: string;
  metadata?: Record<string, any>;
  previousBalance: number;
  newBalance: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export class WalletTransaction {
  private constructor(private readonly props: WalletTransactionProps) {
    this.validate();
  }

  static create(props: WalletTransactionProps): WalletTransaction {
    return new WalletTransaction(props);
  }

  private validate(): void {
    if (!this.props.adminId) {
      throw new Error('Admin ID is required');
    }
    if (this.props.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (!['CREDIT', 'WITHDRAWAL', 'DEBIT'].includes(this.props.type)) {
      throw new Error('Invalid transaction type');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get adminId(): string {
    return this.props.adminId;
  }

  get type(): 'CREDIT' | 'WITHDRAWAL' | 'DEBIT' {
    return this.props.type;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get source(): string {
    return this.props.source;
  }

  get referenceId(): string | undefined {
    return this.props.referenceId;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  get previousBalance(): number {
    return this.props.previousBalance;
  }

  get newBalance(): number {
    return this.props.newBalance;
  }

  get status(): 'COMPLETED' | 'PENDING' | 'FAILED' {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): WalletTransactionProps {
    return { ...this.props };
  }

  static fromDatabaseRow(data: any): WalletTransaction {
    return new WalletTransaction({
      id: data.id,
      adminId: data.adminId || data.admin_id,
      type: data.type,
      amount: Number(data.amount),
      currency: data.currency,
      source: data.source,
      referenceId: data.referenceId || data.reference_id,
      description: data.description,
      metadata: data.metadata,
      previousBalance: Number(data.previousBalance || data.previous_balance),
      newBalance: Number(data.newBalance || data.new_balance),
      status: data.status,
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
    });
  }
}