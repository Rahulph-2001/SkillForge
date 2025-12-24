"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
const Email_1 = require("../../shared/value-objects/Email");
const Password_1 = require("../../shared/value-objects/Password");
const UserRole_1 = require("../enums/UserRole");
const env_1 = require("../../config/env");
class User {
    constructor(data) {
        this._id = data.id || this.generateId();
        this._name = data.name;
        this._email = data.email instanceof Email_1.Email ? data.email : new Email_1.Email(data.email);
        this._passwordHash = data.password instanceof Password_1.Password ? data.password.value : data.password;
        this._avatarUrl = data.avatarUrl || null;
        this._bio = data.bio || null;
        this._location = data.location || null;
        this._role = data.role || UserRole_1.UserRole.USER;
        const bonusCredits = data.bonus_credits || env_1.env.DEFAULT_BONUS_CREDITS;
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
            registration_ip: data.registration_ip || null,
            last_login_ip: null,
            account_age_days: 0,
            suspicious_activity_flags: [],
            last_redemption_date: null,
            redemption_count: 0,
            risk_score: 0,
            flagged_for_review: false,
        };
        this._subscriptionPlan = 'free';
        this._subscriptionValidUntil = null;
        this._subscriptionAutoRenew = false;
        this._subscriptionStartedAt = null;
        this._adminPermissions = this._role === UserRole_1.UserRole.ADMIN ? this.getDefaultAdminPermissions() : null;
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
    generateId() {
        return (0, uuid_1.v4)();
    }
    getDefaultAdminPermissions() {
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
    validate() {
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
    get id() { return this._id; }
    get name() { return this._name; }
    get email() { return this._email; }
    get passwordHash() { return this._passwordHash; }
    get avatarUrl() { return this._avatarUrl; }
    get role() { return this._role; }
    get credits() { return this._credits; }
    get verification() { return this._verification; }
    get antiFraud() { return this._antiFraud; }
    get isDeleted() { return this._isDeleted; }
    get isActive() { return this._isActive; }
    get subscriptionPlan() { return this._subscriptionPlan; }
    get subscriptionValidUntil() { return this._subscriptionValidUntil; }
    get subscriptionStartedAt() { return this._subscriptionStartedAt; }
    get settings() { return this._settings; }
    // Business Methods
    verifyEmail() {
        if (this._verification.email_verified) {
            throw new Error('Email is already verified');
        }
        this._verification.email_verified = true;
        this._verification.email_verified_at = new Date().toISOString();
        this._updatedAt = new Date();
    }
    updateLastLogin(ip) {
        this._antiFraud.last_login_ip = ip;
        const now = new Date();
        this._lastLogin = now;
        this._lastActive = now;
        this._updatedAt = now;
    }
    updateAvatar(avatarUrl) {
        this._avatarUrl = avatarUrl;
        this._updatedAt = new Date();
    }
    updateProfile(data) {
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
    suspend() {
        if (!this._isActive) {
            throw new Error('User is already suspended');
        }
        this._isActive = false;
        this._updatedAt = new Date();
    }
    activate() {
        if (this._isActive) {
            throw new Error('User is already active');
        }
        this._isActive = true;
        this._updatedAt = new Date();
    }
    updatePassword(passwordHash) {
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
    deductCredits(amount) {
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
    addCredits(amount, type = 'earned') {
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
    transferCredits(amount) {
        this.deductCredits(amount); // Will throw if insufficient
    }
    /**
     * Activate or update user subscription
     * @param planType - Subscription plan type
     * @param validUntil - Subscription validity end date
     * @param startedAt - Subscription start date (optional, defaults to now)
     * @param autoRenew - Enable auto-renewal (optional, defaults to false)
     */
    activateSubscription(planType, validUntil, startedAt, autoRenew = false) {
        this._subscriptionPlan = planType;
        this._subscriptionValidUntil = validUntil;
        this._subscriptionStartedAt = startedAt || new Date();
        this._subscriptionAutoRenew = autoRenew;
        this._updatedAt = new Date();
    }
    /**
     * Credit amount to user wallet
     * @param amount - Amount to credit (must be positive)
     */
    creditWallet(amount) {
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
    debitWallet(amount) {
        if (amount <= 0) {
            throw new Error('Debit amount must be positive');
        }
        if (this._walletBalance < amount) {
            throw new Error(`Insufficient wallet balance. Required: ${amount}, Available: ${this._walletBalance}`);
        }
        this._walletBalance -= amount;
        this._updatedAt = new Date();
    }
    toJSON() {
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
    static fromDatabaseRow(row) {
        // Create base User with minimal data (public props)
        const user = new User({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password_hash || row.passwordHash,
            role: row.role,
        });
        const userAny = user;
        userAny._avatarUrl = row.avatar_url || row.avatarUrl || null;
        userAny._bio = row.bio;
        userAny._location = row.location;
        userAny._credits = row.credits || 0;
        userAny._earnedCredits = row.earned_credits || row.earnedCredits || 0;
        userAny._bonusCredits = row.bonus_credits || row.bonusCredits || 0;
        userAny._purchasedCredits = row.purchased_credits || row.purchasedCredits || 0;
        userAny._walletBalance = parseFloat(String(row.wallet_balance || row.walletBalance || 0));
        userAny._skillsOffered = row.skills_offered || row.skillsOffered || [];
        userAny._skillsLearning = row.skills_learning || row.skillsLearning || [];
        userAny._rating = parseFloat(String(row.rating || 0));
        userAny._reviewCount = row.review_count || row.reviewCount || 0;
        userAny._totalSessionsCompleted = row.total_sessions_completed || row.totalSessionsCompleted || 0;
        userAny._memberSince = (row.member_since || row.memberSince) || new Date();
        userAny._verification = row.verification;
        userAny._antiFraud = row.anti_fraud || row.antiFraud;
        userAny._settings = row.settings;
        userAny._adminPermissions = row.admin_permissions || row.adminPermissions;
        userAny._subscriptionPlan = row.subscription_plan || row.subscriptionPlan || 'free';
        userAny._subscriptionValidUntil = (row.subscription_valid_until || row.subscriptionValidUntil) || null;
        userAny._subscriptionAutoRenew = row.subscription_auto_renew !== undefined
            ? row.subscription_auto_renew
            : (row.subscriptionAutoRenew || false);
        userAny._subscriptionStartedAt = (row.subscription_started_at || row.subscriptionStartedAt) || null;
        userAny._createdAt = (row.created_at || row.createdAt) || new Date();
        userAny._updatedAt = (row.updated_at || row.updatedAt) || new Date();
        userAny._lastLogin = (row.last_login || row.lastLogin) || null;
        userAny._lastActive = (row.last_active || row.lastActive) || null;
        userAny._isActive = row.is_active !== undefined
            ? row.is_active
            : (row.isActive !== undefined ? row.isActive : true);
        userAny._isDeleted = row.is_deleted || row.isDeleted || false;
        userAny._deletedAt = (row.deleted_at || row.deletedAt) || null;
        return user;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map