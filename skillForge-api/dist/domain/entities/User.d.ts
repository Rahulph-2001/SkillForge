import { Email } from '../../shared/value-objects/Email';
import { Password } from '../../shared/value-objects/Password';
import { UserRole } from '../enums/UserRole';
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
    flagged_for_review: boolean;
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
    bonus_credits?: number;
    registration_ip?: string;
    avatarUrl?: string | null;
    bio?: string | null;
    location?: string | null;
}
export declare class User {
    private _id;
    private _name;
    private _email;
    private _passwordHash;
    private _avatarUrl;
    private _bio;
    private _location;
    private _role;
    private _credits;
    private _earnedCredits;
    private _bonusCredits;
    private _purchasedCredits;
    private _walletBalance;
    private _skillsOffered;
    private _skillsLearning;
    private _rating;
    private _reviewCount;
    private _totalSessionsCompleted;
    private _memberSince;
    private _verification;
    private _antiFraud;
    private _subscriptionPlan;
    private _subscriptionValidUntil;
    private _subscriptionAutoRenew;
    private _subscriptionStartedAt;
    private _adminPermissions;
    private _settings;
    private _createdAt;
    private _updatedAt;
    private _lastLogin;
    private _lastActive;
    private _isActive;
    private _isDeleted;
    private _deletedAt;
    constructor(data: CreateUserData);
    private generateId;
    private getDefaultAdminPermissions;
    private validate;
    get id(): string;
    get name(): string;
    get email(): Email;
    get passwordHash(): string;
    get avatarUrl(): string | null;
    get role(): UserRole;
    get credits(): number;
    get verification(): VerificationData;
    get antiFraud(): AntiFraudData;
    get isDeleted(): boolean;
    get isActive(): boolean;
    get subscriptionPlan(): SubscriptionPlan;
    get settings(): UserSettings;
    verifyEmail(): void;
    updateLastLogin(ip: string): void;
    updateAvatar(avatarUrl: string | null): void;
    updateProfile(data: {
        name?: string;
        bio?: string | null;
        location?: string | null;
        avatarUrl?: string | null;
    }): void;
    suspend(): void;
    activate(): void;
    updatePassword(passwordHash: string): void;
    toJSON(): Record<string, unknown>;
    static fromDatabaseRow(row: Record<string, unknown>): User;
}
//# sourceMappingURL=User.d.ts.map