export interface SkillTemplateProps {
  id?: string;
  title: string;
  category: string;
  description: string;
  creditsMin: number;
  creditsMax: number;
  mcqCount: number;
  passRange: number;
  levels: string[];
  tags: string[];
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export class SkillTemplate {
  private readonly props: SkillTemplateProps;

  constructor(props: SkillTemplateProps) {
    this.props = {
      ...props,
      // Don't generate ID here - let Prisma/database generate UUID
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
      isActive: props.isActive ?? true,
      passRange: props.passRange || 70,
      status: props.status || 'Active',
    };

    this.validate();
  }

  private validate(): void {
    if (!this.props.title || this.props.title.trim().length === 0) {
      throw new Error('Skill template title is required');
    }

    if (!this.props.category || this.props.category.trim().length === 0) {
      throw new Error('Category is required');
    }

    // Description is optional - can be added by users when creating skills from template
    // if (!this.props.description || this.props.description.trim().length === 0) {
    //   throw new Error('Description is required');
    // }

    if (this.props.creditsMin < 0) {
      throw new Error('Minimum credits must be non-negative');
    }

    if (this.props.creditsMax < this.props.creditsMin) {
      throw new Error('Maximum credits must be greater than or equal to minimum credits');
    }

    if (this.props.mcqCount < 0) {
      throw new Error('MCQ count must be non-negative');
    }

    if (this.props.passRange < 0 || this.props.passRange > 100) {
      throw new Error('Pass range must be between 0 and 100');
    }

    if (!Array.isArray(this.props.levels) || this.props.levels.length === 0) {
      throw new Error('At least one level must be specified');
    }
  }

  get id(): string {
    return this.props.id!;
  }

  get title(): string {
    return this.props.title;
  }

  get category(): string {
    return this.props.category;
  }

  get description(): string {
    return this.props.description;
  }

  get creditsMin(): number {
    return this.props.creditsMin;
  }

  get creditsMax(): number {
    return this.props.creditsMax;
  }

  get mcqCount(): number {
    return this.props.mcqCount;
  }

  get passRange(): number {
    return this.props.passRange;
  }

  get levels(): string[] {
    return [...this.props.levels];
  }

  get tags(): string[] {
    return [...this.props.tags];
  }

  get status(): string {
    return this.props.status;
  }

  get isActive(): boolean {
    return this.props.isActive!;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description,
      creditsMin: this.creditsMin,
      creditsMax: this.creditsMax,
      mcqCount: this.mcqCount,
      passRange: this.passRange,
      levels: this.levels,
      tags: this.tags,
      status: this.status,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
