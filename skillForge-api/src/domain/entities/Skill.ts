import { v4 as uuidv4 } from 'uuid';

export type SkillStatus = 'approved' | 'pending' | 'in-review' | 'rejected';

export interface CreateSkillProps {
  id?: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  tags: string[];
  imageUrl?: string | null;
  templateId?: string | null;
  status?: SkillStatus;
  verificationStatus?: string | null;
  mcqScore?: number | null;
  mcqTotalQuestions?: number | null;
  mcqPassingScore?: number | null;
  totalSessions?: number;
  rating?: number;
  isBlocked?: boolean;
  blockedReason?: string | null;
  blockedAt?: Date | null;
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
  private readonly _durationHours: number;
  private readonly _creditsPerHour: number;
  private readonly _tags: string[];
  private readonly _imageUrl: string | null;
  private readonly _templateId: string | null;
  private readonly _status: SkillStatus;
  private readonly _verificationStatus: string | null;
  private readonly _mcqScore: number | null;
  private readonly _mcqTotalQuestions: number | null;
  private readonly _mcqPassingScore: number | null;
  private readonly _totalSessions: number;
  private readonly _rating: number;
  private readonly _isBlocked: boolean;
  private readonly _blockedReason: string | null;
  private readonly _blockedAt: Date | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(props: CreateSkillProps) {
    this._id = props.id || uuidv4();
    this._providerId = props.providerId;
    this._title = props.title;
    this._description = props.description;
    this._category = props.category;
    this._level = props.level;
    this._durationHours = props.durationHours;
    this._creditsPerHour = props.creditsPerHour;
    this._tags = props.tags;
    this._imageUrl = props.imageUrl || null;
    this._templateId = props.templateId || null;
    this._status = props.status || 'pending';
    this._verificationStatus = props.verificationStatus || 'not_started';
    this._mcqScore = props.mcqScore || null;
    this._mcqTotalQuestions = props.mcqTotalQuestions || 7;
    this._mcqPassingScore = props.mcqPassingScore || 70;
    this._totalSessions = props.totalSessions || 0;
    this._rating = props.rating || 0;
    this._isBlocked = props.isBlocked || false;
    this._blockedReason = props.blockedReason || null;
    this._blockedAt = props.blockedAt || null;
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
  public get durationHours(): number { return this._durationHours; }
  public get creditsPerHour(): number { return this._creditsPerHour; }
  public get tags(): string[] { return this._tags; }
  public get imageUrl(): string | null { return this._imageUrl; }
  public get templateId(): string | null { return this._templateId; }
  public get status(): SkillStatus { return this._status; }
  public get verificationStatus(): string | null { return this._verificationStatus; }
  public get mcqScore(): number | null { return this._mcqScore; }
  public get mcqTotalQuestions(): number | null { return this._mcqTotalQuestions; }
  public get mcqPassingScore(): number | null { return this._mcqPassingScore; }
  public get totalSessions(): number { return this._totalSessions; }
  public get rating(): number { return this._rating; }
  public get isBlocked(): boolean { return this._isBlocked; }
  public get blockedReason(): string | null { return this._blockedReason; }
  public get blockedAt(): Date | null { return this._blockedAt; }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      providerId: this._providerId,
      title: this._title,
      description: this._description,
      category: this._category,
      level: this._level,
      durationHours: this._durationHours,
      creditsPerHour: this._creditsPerHour,
      tags: this._tags,
      imageUrl: this._imageUrl,
      templateId: this._templateId,
      status: this._status,
      verificationStatus: this._verificationStatus,
      mcqScore: this._mcqScore,
      mcqTotalQuestions: this._mcqTotalQuestions,
      mcqPassingScore: this._mcqPassingScore,
      totalSessions: this._totalSessions,
      rating: this._rating,
      isBlocked: this._isBlocked,
      blockedReason: this._blockedReason,
      blockedAt: this._blockedAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}