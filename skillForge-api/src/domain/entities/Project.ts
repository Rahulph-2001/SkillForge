
export enum ProjectStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In_Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface ProjectProps {
  id?: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  budget: number;
  duration: string;
  deadline?: string | null;
  status: ProjectStatus;
  paymentId?: string | null;
  applicationsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Project {
  private constructor(private readonly props: ProjectProps) {
    this.validate();
  }

  static create(props: ProjectProps): Project {
    return new Project(props);
  }

  private validate(): void {
    if (!this.props.clientId) {
      throw new Error('Client ID is required');
    }
    if (!this.props.title || this.props.title.trim().length === 0) {
      throw new Error('Project title is required');
    }
    if (!this.props.description || this.props.description.trim().length === 0) {
      throw new Error('Project description is required');
    }
    if (!this.props.category) {
      throw new Error('Project category is required');
    }
    if (this.props.budget < 0) {
      throw new Error('Budget cannot be negative');
    }
    if (!this.props.duration) {
      throw new Error('Project duration is required');
    }
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get category(): string {
    return this.props.category;
  }

  get tags(): string[] {
    return this.props.tags;
  }

  get budget(): number {
    return this.props.budget;
  }

  get duration(): string {
    return this.props.duration;
  }

  get deadline(): string | null | undefined {
    return this.props.deadline;
  }

  get status(): ProjectStatus {
    return this.props.status;
  }

  get paymentId(): string | null | undefined {
    return this.props.paymentId;
  }

  get applicationsCount(): number {
    return this.props.applicationsCount || 0;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business logic methods
  canBeUpdated(): boolean {
    return this.props.status === ProjectStatus.OPEN || this.props.status === ProjectStatus.IN_PROGRESS;
  }

  canBeCancelled(): boolean {
    return this.props.status === ProjectStatus.OPEN || this.props.status === ProjectStatus.IN_PROGRESS;
  }

  canBeCompleted(): boolean {
    return this.props.status === ProjectStatus.IN_PROGRESS;
  }

  markAsInProgress(): void {
    if (this.props.status !== ProjectStatus.OPEN) {
      throw new Error('Only open projects can be marked as in progress');
    }
    this.props.status = ProjectStatus.IN_PROGRESS;
    this.props.updatedAt = new Date();
  }

  markAsCompleted(): void {
    if (!this.canBeCompleted()) {
      throw new Error('Project must be in progress to be marked as completed');
    }
    this.props.status = ProjectStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }

  markAsCancelled(): void {
    if (!this.canBeCancelled()) {
      throw new Error('Project cannot be cancelled in its current state');
    }
    this.props.status = ProjectStatus.CANCELLED;
    this.props.updatedAt = new Date();
  }

  incrementApplicationsCount(): void {
    this.props.applicationsCount = (this.props.applicationsCount || 0) + 1;
    this.props.updatedAt = new Date();
  }

  toJSON(): ProjectProps {
    return {
      id: this.props.id,
      clientId: this.props.clientId,
      title: this.props.title,
      description: this.props.description,
      category: this.props.category,
      tags: this.props.tags,
      budget: this.props.budget,
      duration: this.props.duration,
      deadline: this.props.deadline,
      status: this.props.status,
      paymentId: this.props.paymentId,
      applicationsCount: this.props.applicationsCount || 0,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  toObject(): ProjectProps {
    return this.toJSON();
  }
}

