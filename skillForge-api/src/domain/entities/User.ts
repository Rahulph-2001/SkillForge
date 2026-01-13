import { v4 as uuidv4 } from 'uuid';
import { Email } from '../../shared/value-objects/Email';
import { Password } from '../../shared/value-objects/Password';
import { UserRole } from '../enums/UserRole';
import { env } from '../../config/env';

export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type ProfileVisibility = 'public' | 'private';

export interface VerificationData {
  email_verified: boolean;
  email_verified_at: string | null;
  bank_details: {
    account_number: string | null;
    ifsc_code: string | null;
    account_holder_name: string | null;
    bank_name: string | null;
    upi_id: string | null;
    verified: boolean;
    verified_at: string | null;
    verification_method: string | null;
  };
}

export interface AntiFraudData {
  registration_ip: string | null;
  last_login_ip: string | null;
  account_age_days: number;
  suspicious_activity_flags: string[];
  last_redemption_date: string | null;
  redemption_count: number;
  risk_score: number;
  flaggedForReview: boolean;
}

export interface AdminPermissions {
  can_manage_users: boolean;
  can_manage_skills: boolean;
  can_manage_communities: boolean;
  can_manage_projects: boolean;
  can_manage_transactions: boolean;
  can_manage_reports: boolean;
  can_manage_subscriptions: boolean;
  can_view_analytics: boolean;
  can_approve_payments: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  booking_notifications: boolean;
  message_notifications: boolean;
  credit_notifications: boolean;
  community_notifications: boolean;
  project_notifications: boolean;
}

export interface PrivacySettings {
  profile_visibility: ProfileVisibility;
  show_location: boolean;
  show_email: boolean;
}

export interface UserSettings {
  marketing_emails: boolean;
  notification_preferences: NotificationPreferences;
  privacy_settings: PrivacySettings;
  language: string;
  timezone: string;
}

export interface CreateUserData {
  id?: string;
  name: string;
  email: Email | string;
  password: Password | string;
  role?: UserRole | 'user' | 'admin';
  bonusCredits?: number;
  registrationIp?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  location?: string | null;
}

export class User {
  private _id: string;
  private _name: string;
  private _email: Email;
  private _passwordHash: string;
  private _avatarUrl: string | null;
  private _bio: string | null;
  private _location: string | null;
  private _role: UserRole;
  private _credits: number;
  private _earnedCredits: number;
  private _bonusCredits: number;
  private _purchasedCredits: number;
  private _walletBalance: number;
  private _skillsOffered: string[];
  private _skillsLearning: string[];
  private _rating: number;
  private _reviewCount: number;
  private _totalSessionsCompleted: number;
  private _memberSince: Date;
  private _verification: VerificationData;
  private _antiFraud: AntiFraudData;
  private _subscriptionPlan: SubscriptionPlan;
  private _subscriptionValidUntil: Date | null;
  private _subscriptionAutoRenew: boolean;
  private _subscriptionStartedAt: Date | null;
  private _adminPermissions: AdminPermissions | null;
  private _settings: UserSettings;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _lastLogin: Date | null;
  private _lastActive: Date | null;
  private _isActive: boolean;
  private _isDeleted: boolean;
  private _deletedAt: Date | null;

  constructor(data: CreateUserData) {
    this._id = data.id || this.generateId();
    this._name = data.name;
    this._email = data.email instanceof Email ? data.email : new Email(data.email);
    this._passwordHash = data.password instanceof Password ? data.password.value : data.password;
    this._avatarUrl = data.avatarUrl || null;
    this._bio = data.bio || null;
    this._location = data.location || null;
    this._role = (data.role as UserRole) || UserRole.USER;
    const bonusCredits = data.bonusCredits || env.DEFAULT_BONUS_CREDITS;
    this._credits = bonusCredits;
    this._earnedCredits = 0;
    this._bonusCredits = bonusCredits;
    this._purchasedCredits = 0;
    this._walletBalance = 0;
    this._skillsOffered = [];
    this._skillsLearning = [];
    this._rating = 0;
    this._reviewCount = 0;
    this._totalSessionsCompleted = 0;
    this._memberSince = new Date();
    this._verification = {
      email_verified: false,
      email_verified_at: null,
      bank_details: {
        account_number: null,
        ifsc_code: null,
        account_holder_name: null,
        bank_name: null,
        upi_id: null,
        verified: false,
        verified_at: null,
        verification_method: null,
      },
    };
    this._antiFraud = {
      registration_ip: data.registrationIp || null,
      last_login_ip: null,
      account_age_days: 0,
      suspicious_activity_flags: [],
      last_redemption_date: null,
      redemption_count: 0,
      risk_score: 0,
      flaggedForReview: false,
    };
    this._subscriptionPlan = 'free';
    this._subscriptionValidUntil = null;
    this._subscriptionAutoRenew = false;
    this._subscriptionStartedAt = null;
    this._adminPermissions = this._role === UserRole.ADMIN ? this.getDefaultAdminPermissions() : null;
    this._settings = {
      marketing_emails: true,
      notification_preferences: {
        email: true,
        push: true,
        booking_notifications: true,
        message_notifications: true,
        credit_notifications: true,
        community_notifications: true,
        project_notifications: true,
      },
      privacy_settings: {
        profile_visibility: 'public',
        show_location: true,
        show_email: false,
      },
      language: 'en',
      timezone: 'UTC',
    };
    const now = new Date();
    this._createdAt = now;
    this._updatedAt = now;
    this._lastLogin = null;
    this._lastActive = null;
    this._isActive = true;
    this._isDeleted = false;
    this._deletedAt = null;
    this.validate();
  }

  private generateId(): string {
    return uuidv4();
  }

  private getDefaultAdminPermissions(): AdminPermissions {
    return {
      can_manage_users: true,
      can_manage_skills: true,
      can_manage_communities: true,
      can_manage_projects: true,
      can_manage_transactions: true,
      can_manage_reports: true,
      can_manage_subscriptions: true,
      can_view_analytics: true,
      can_approve_payments: true,
    };
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!this._email) {
      throw new Error('Email is required');
    }
    if (!this._passwordHash || this._passwordHash.trim().length === 0) {
      throw new Error('Password hash is required');
    }
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get email(): Email { return this._email; }
  get passwordHash(): string { return this._passwordHash; }
  get avatarUrl(): string | null { return this._avatarUrl; }
  get bio(): string | null { return this._bio; }
  get location(): string | null { return this._location; }
  get role(): UserRole { return this._role; }
  get credits(): number { return this._credits; }
  get walletBalance(): number { return this._walletBalance; }
  get rating(): number { return this._rating; }
  get reviewCount(): number { return this._reviewCount; }
  get totalSessionsCompleted(): number { return this._totalSessionsCompleted; }
  get memberSince(): Date { return this._memberSince; }
  get verification(): VerificationData { return this._verification; }
  get antiFraud(): AntiFraudData { return this._antiFraud; }
  get isDeleted(): boolean { return this._isDeleted; }
  get isActive(): boolean { return this._isActive; }
  get subscriptionPlan(): SubscriptionPlan { return this._subscriptionPlan; }
  get subscriptionValidUntil(): Date | null { return this._subscriptionValidUntil; }
  get subscriptionStartedAt(): Date | null { return this._subscriptionStartedAt; }
  get settings(): UserSettings { return this._settings; }

  // Business Methods
  public verifyEmail(): void {
    if (this._verification.email_verified) {
      throw new Error('Email is already verified');
    }
    this._verification.email_verified = true;
    this._verification.email_verified_at = new Date().toISOString();
    this._updatedAt = new Date();
  }

  public updateLastLogin(ip: string): void {
    this._antiFraud.last_login_ip = ip;
    const now = new Date();
    this._lastLogin = now;
    this._lastActive = now;
    this._updatedAt = now;
  }

  public updateAvatar(avatarUrl: string | null): void {
    this._avatarUrl = avatarUrl;
    this._updatedAt = new Date();
  }

  public updateProfile(data: {
    name?: string;
    bio?: string | null;
    location?: string | null;
    avatarUrl?: string | null;
  }): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Name cannot be empty');
      }
      this._name = data.name;
    }
    if (data.bio !== undefined) {
      this._bio = data.bio;
    }
    if (data.location !== undefined) {
      this._location = data.location;
    }
    if (data.avatarUrl !== undefined) {
      this._avatarUrl = data.avatarUrl;
    }
    this._updatedAt = new Date();
  }

  public suspend(): void {
    if (!this._isActive) {
      throw new Error('User is already suspended');
    }
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public activate(): void {
    if (this._isActive) {
      throw new Error('User is already active');
    }
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public updatePassword(passwordHash: string): void {
    if (!passwordHash || passwordHash.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }
    this._passwordHash = passwordHash;
    this._updatedAt = new Date();
  }

  /**
   * Deduct credits from user account
   * @param amount - Amount of credits to deduct
   * @throws Error if insufficient credits
   */
  public deductCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive');
    }
    if (this._credits < amount) {
      throw new Error(`Insufficient credits. Required: ${amount}, Available: ${this._credits}`);
    }
    this._credits -= amount;
    this._updatedAt = new Date();
  }

  /**
   * Add credits to user account
   * @param amount - Amount of credits to add
   * @param type - Type of credit (earned, bonus, purchased)
   */
  public addCredits(amount: number, type: 'earned' | 'bonus' | 'purchased' = 'earned'): void {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive');
    }
    this._credits += amount;

    switch (type) {
      case 'earned':
        this._earnedCredits += amount;
        break;
      case 'bonus':
        this._bonusCredits += amount;
        break;
      case 'purchased':
        this._purchasedCredits += amount;
        break;
    }

    this._updatedAt = new Date();
  }

  /**
   * Transfer credits to another user (for internal transactions)
   * @param amount - Amount to transfer
   */
  public transferCredits(amount: number): void {
    this.deductCredits(amount); // Will throw if insufficient
  }

  /**
   * Activate or update user subscription
   * @param planType - Subscription plan type
   * @param validUntil - Subscription validity end date
   * @param startedAt - Subscription start date (optional, defaults to now)
   * @param autoRenew - Enable auto-renewal (optional, defaults to false)
   */
  public activateSubscription(
    planType: SubscriptionPlan,
    validUntil: Date,
    startedAt?: Date,
    autoRenew: boolean = false
  ): void {
    this._subscriptionPlan = planType;
    this._subscriptionValidUntil = validUntil;
    this._subscriptionStartedAt = startedAt || new Date();
    this._subscriptionAutoRenew = autoRenew;
    this._updatedAt = new Date();
  }

  /**
   * Deactivate/expire subscription (called when subscription period ends)
   */
  public deactivateSubscription(): void {
    this._subscriptionPlan = 'free';
    this._subscriptionValidUntil = null;
    this._subscriptionAutoRenew = false;
    this._updatedAt = new Date();
  }

  /**
   * Credit amount to user wallet
   * @param amount - Amount to credit (must be positive)
   */
  public creditWallet(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive');
    }
    this._walletBalance += amount;
    this._updatedAt = new Date();
  }

  /**
   * Debit amount from user wallet
   * @param amount - Amount to debit
   * @throws Error if insufficient balance
   */
  public debitWallet(amount: number): void {
    if (amount <= 0) {
      throw new Error('Debit amount must be positive');
    }
    if (this._walletBalance < amount) {
      throw new Error(`Insufficient wallet balance. Required: ${amount}, Available: ${this._walletBalance}`);
    }
    this._walletBalance -= amount;
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      email: this._email.value,
      password_hash: this._passwordHash,
      avatar_url: this._avatarUrl,
      bio: this._bio,
      location: this._location,
      role: this._role,
      credits: this._credits,
      earned_credits: this._earnedCredits,
      bonus_credits: this._bonusCredits,
      purchased_credits: this._purchasedCredits,
      wallet_balance: this._walletBalance,
      skills_offered: this._skillsOffered,
      skills_learning: this._skillsLearning,
      rating: this._rating,
      review_count: this._reviewCount,
      total_sessions_completed: this._totalSessionsCompleted,
      member_since: this._memberSince,
      verification: this._verification,
      anti_fraud: this._antiFraud,
      subscription_plan: this._subscriptionPlan,
      subscription_valid_until: this._subscriptionValidUntil,
      subscription_auto_renew: this._subscriptionAutoRenew,
      subscription_started_at: this._subscriptionStartedAt,
      admin_permissions: this._adminPermissions,
      settings: this._settings,
      created_at: this._createdAt,
      updated_at: this._updatedAt,
      last_login: this._lastLogin,
      last_active: this._lastActive,
      is_active: this._isActive,
      is_deleted: this._isDeleted,
      deleted_at: this._deletedAt,
    };
  }


  public static fromDatabaseRow(row: Record<string, unknown>): User {
    // Create base User with minimal data (public props)
    const user = new User({
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      password: (row.password_hash as string) || (row.passwordHash as string),
      role: row.role as UserRole,
    });


    const userAny = user as unknown as Record<string, unknown>;


    userAny._avatarUrl = (row.avatar_url as string) || (row.avatarUrl as string) || null;
    userAny._bio = row.bio as string | null;
    userAny._location = row.location as string | null;
    userAny._credits = (row.credits as number) || 0;
    userAny._earnedCredits = (row.earned_credits as number) || (row.earnedCredits as number) || 0;
    userAny._bonusCredits = (row.bonus_credits as number) || (row.bonusCredits as number) || 0;
    userAny._purchasedCredits = (row.purchased_credits as number) || (row.purchasedCredits as number) || 0;
    userAny._walletBalance = parseFloat(String(row.wallet_balance || row.walletBalance || 0));
    userAny._skillsOffered = (row.skills_offered as string[]) || (row.skillsOffered as string[]) || [];
    userAny._skillsLearning = (row.skills_learning as string[]) || (row.skillsLearning as string[]) || [];
    userAny._rating = parseFloat(String(row.rating || 0));
    userAny._reviewCount = (row.review_count as number) || (row.reviewCount as number) || 0;
    userAny._totalSessionsCompleted = (row.total_sessions_completed as number) || (row.totalSessionsCompleted as number) || 0;
    userAny._memberSince = (row.member_since as Date || row.memberSince as Date) || new Date();
    userAny._verification = row.verification as VerificationData;
    // Normalize antiFraud data - handle both snake_case (from DB) and camelCase formats
    const antiFraudData = (row.anti_fraud as any) || (row.antiFraud as any);
    if (antiFraudData) {
      // Convert flagged_for_review (snake_case) to flaggedForReview (camelCase) if present
      if (antiFraudData.flagged_for_review !== undefined && antiFraudData.flaggedForReview === undefined) {
        antiFraudData.flaggedForReview = antiFraudData.flagged_for_review;
        delete antiFraudData.flagged_for_review;
      }
      userAny._antiFraud = antiFraudData as AntiFraudData;
    } else {
      // Default antiFraud data if not present
      userAny._antiFraud = {
        registration_ip: null,
        last_login_ip: null,
        account_age_days: 0,
        suspicious_activity_flags: [],
        last_redemption_date: null,
        redemption_count: 0,
        risk_score: 0,
        flaggedForReview: false,
      };
    }
    userAny._settings = row.settings as UserSettings;
    userAny._adminPermissions = (row.admin_permissions as AdminPermissions) || (row.adminPermissions as AdminPermissions);
    userAny._subscriptionPlan = (row.subscription_plan as SubscriptionPlan) || (row.subscriptionPlan as SubscriptionPlan) || 'free';
    userAny._subscriptionValidUntil = (row.subscription_valid_until as Date || row.subscriptionValidUntil as Date) || null;
    userAny._subscriptionAutoRenew = (row.subscription_auto_renew as boolean) !== undefined
      ? (row.subscription_auto_renew as boolean)
      : ((row.subscriptionAutoRenew as boolean) || false);
    userAny._subscriptionStartedAt = (row.subscription_started_at as Date || row.subscriptionStartedAt as Date) || null;
    userAny._createdAt = (row.created_at as Date || row.createdAt as Date) || new Date();
    userAny._updatedAt = (row.updated_at as Date || row.updatedAt as Date) || new Date();
    userAny._lastLogin = (row.last_login as Date || row.lastLogin as Date) || null;
    userAny._lastActive = (row.last_active as Date || row.lastActive as Date) || null;
    userAny._isActive = (row.is_active as boolean) !== undefined
      ? (row.is_active as boolean)
      : ((row.isActive as boolean) !== undefined ? (row.isActive as boolean) : true);
    userAny._isDeleted = (row.is_deleted as boolean) || (row.isDeleted as boolean) || false;
    userAny._deletedAt = (row.deleted_at as Date || row.deletedAt as Date) || null;


    return user;
  }
}