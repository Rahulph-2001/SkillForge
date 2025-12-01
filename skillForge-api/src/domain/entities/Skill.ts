import { v4 as uuidv4 } from 'uuid';

export type SkillStatus = 'approved' | 'pending' | 'in-review' | 'rejected';

export interface CreateSkillProps {
  id?: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  creditsPerHour: number;
  tags: string[];
  imageUrl?: string | null;
  status?: SkillStatus;
  totalSessions?: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Skill {
  private readonly _id: string;
  private readonly _providerId: string;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _category: string;
  private readonly _level: string;
  private readonly _duration: string;
  private readonly _creditsPerHour: number;
  private readonly _tags: string[];
  private readonly _imageUrl: string | null;
  private readonly _status: SkillStatus;
  private readonly _totalSessions: number;
  private readonly _rating: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(props: CreateSkillProps) {
    this._id = props.id || uuidv4();
    this._providerId = props.providerId;
    this._title = props.title;
    this._description = props.description;
    this._category = props.category;
    this._level = props.level;
    this._duration = props.duration;
    this._creditsPerHour = props.creditsPerHour;
    this._tags = props.tags;
    this._imageUrl = props.imageUrl || null;
    this._status = props.status || 'pending';
    this._totalSessions = props.totalSessions || 0;
    this._rating = props.rating || 0;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    
    this.validate();
  }

  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
        throw new Error('Title is required');
    }
    if (!this._providerId) {
        throw new Error('Provider ID is required');
    }
    if (this._creditsPerHour < 0) {
        throw new Error('Credits cannot be negative');
    }
  }

  // Getters
  public get id(): string { return this._id; }
  public get providerId(): string { return this._providerId; }
  public get title(): string { return this._title; }
  public get description(): string { return this._description; }
  public get category(): string { return this._category; }
  public get level(): string { return this._level; }
  public get duration(): string { return this._duration; }
  public get creditsPerHour(): number { return this._creditsPerHour; }
  public get tags(): string[] { return this._tags; }
  public get imageUrl(): string | null { return this._imageUrl; }
  public get status(): SkillStatus { return this._status; }
  public get totalSessions(): number { return this._totalSessions; }
  public get rating(): number { return this._rating; }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      providerId: this._providerId,
      title: this._title,
      description: this._description,
      category: this._category,
      level: this._level,
      duration: this._duration,
      creditsPerHour: this._creditsPerHour,
      tags: this._tags,
      imageUrl: this._imageUrl,
      status: this._status,
      totalSessions: this._totalSessions,
      rating: this._rating,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}