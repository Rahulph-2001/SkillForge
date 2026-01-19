export enum EscrowStatus {
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
}

export interface EscrowTransactionProps {
  id?: string;
  bookingId: string;
  learnerId: string;
  providerId: string;
  amount: number;
  status: EscrowStatus;
  heldAt: Date;
  releasedAt?: Date | null;
  refundedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class EscrowTransaction {
  private constructor(private readonly props: EscrowTransactionProps) {
    this.validate();
  }

  static create(props: EscrowTransactionProps): EscrowTransaction {
    return new EscrowTransaction(props);
  }

  static createNew(
    bookingId: string,
    learnerId: string,
    providerId: string,
    amount: number
  ): EscrowTransaction {
    const now = new Date();
    return new EscrowTransaction({
      bookingId,
      learnerId,
      providerId,
      amount,
      status: EscrowStatus.HELD,
      heldAt: now,
      releasedAt: null,
      refundedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  private validate(): void {
    if (!this.props.bookingId) {
      throw new Error('Booking ID is required');
    }
    if (!this.props.learnerId) {
      throw new Error('Learner ID is required');
    }
    if (!this.props.providerId) {
      throw new Error('Provider ID is required');
    }
    if (this.props.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (!Object.values(EscrowStatus).includes(this.props.status)) {
      throw new Error('Invalid escrow status');
    }
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get bookingId(): string {
    return this.props.bookingId;
  }

  get learnerId(): string {
    return this.props.learnerId;
  }

  get providerId(): string {
    return this.props.providerId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get status(): EscrowStatus {
    return this.props.status;
  }

  get heldAt(): Date {
    return this.props.heldAt;
  }

  get releasedAt(): Date | null | undefined {
    return this.props.releasedAt;
  }

  get refundedAt(): Date | null | undefined {
    return this.props.refundedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isHeld(): boolean {
    return this.props.status === EscrowStatus.HELD;
  }

  isReleased(): boolean {
    return this.props.status === EscrowStatus.RELEASED;
  }

  isRefunded(): boolean {
    return this.props.status === EscrowStatus.REFUNDED;
  }

  canBeReleased(): boolean {
    return this.props.status === EscrowStatus.HELD;
  }

  canBeRefunded(): boolean {
    return this.props.status === EscrowStatus.HELD;
  }

  toObject(): EscrowTransactionProps {
    return { ...this.props };
  }

  static fromDatabaseRow(data: any): EscrowTransaction {
    return new EscrowTransaction({
      id: data.id,
      bookingId: data.bookingId || data.booking_id,
      learnerId: data.learnerId || data.learner_id,
      providerId: data.providerId || data.provider_id,
      amount: Number(data.amount),
      status: data.status as EscrowStatus,
      heldAt: new Date(data.heldAt || data.held_at),
      releasedAt: data.releasedAt || data.released_at ? new Date(data.releasedAt || data.released_at) : null,
      refundedAt: data.refundedAt || data.refunded_at ? new Date(data.refundedAt || data.refunded_at) : null,
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
    });
  }
}