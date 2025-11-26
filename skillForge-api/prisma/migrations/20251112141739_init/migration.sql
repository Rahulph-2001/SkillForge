-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('free', 'starter', 'professional', 'enterprise');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('email', 'sms', 'phone');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "location" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "phone_number" VARCHAR(20),
    "credits" INTEGER NOT NULL DEFAULT 0,
    "earned_credits" INTEGER NOT NULL DEFAULT 0,
    "bonus_credits" INTEGER NOT NULL DEFAULT 0,
    "purchased_credits" INTEGER NOT NULL DEFAULT 0,
    "wallet_balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "skills_offered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skills_learning" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rating" DECIMAL(3,2) DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "total_sessions_completed" INTEGER NOT NULL DEFAULT 0,
    "member_since" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verification" JSONB NOT NULL DEFAULT '{"email_verified":false,"email_verified_at":null,"phone_verified":false,"phone_verified_at":null,"bank_details":{"account_number":null,"ifsc_code":null,"account_holder_name":null,"bank_name":null,"upi_id":null,"verified":false,"verified_at":null,"verification_method":null}}',
    "anti_fraud" JSONB NOT NULL DEFAULT '{"device_fingerprint":null,"registration_ip":null,"last_login_ip":null,"account_age_days":0,"suspicious_activity_flags":[],"last_redemption_date":null,"redemption_count":0,"risk_score":0,"flagged_for_review":false}',
    "subscription_plan" "SubscriptionPlan" NOT NULL DEFAULT 'free',
    "subscription_valid_until" TIMESTAMPTZ(6),
    "subscription_auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "subscription_started_at" TIMESTAMPTZ(6),
    "admin_permissions" JSONB,
    "settings" JSONB NOT NULL DEFAULT '{"marketing_emails":true,"notification_preferences":{"email":true,"sms":true,"push":true,"booking_notifications":true,"message_notifications":true,"credit_notifications":true,"community_notifications":true,"project_notifications":true},"privacy_settings":{"profile_visibility":"public","show_location":true,"show_email":false,"show_phone":false},"language":"en","timezone":"UTC"}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "last_login" TIMESTAMPTZ(6),
    "last_active" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "otp_type" "OTPType" NOT NULL,
    "contact_info" VARCHAR(255) NOT NULL,
    "otp_code" VARCHAR(255) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),

    CONSTRAINT "otp_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_subscription_plan_idx" ON "users"("subscription_plan");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "users_is_deleted_idx" ON "users"("is_deleted");

-- CreateIndex
CREATE INDEX "otp_tokens_user_id_idx" ON "otp_tokens"("user_id");

-- CreateIndex
CREATE INDEX "otp_tokens_expires_at_idx" ON "otp_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "otp_tokens_is_verified_idx" ON "otp_tokens"("is_verified");

-- CreateIndex
CREATE INDEX "otp_tokens_contact_info_idx" ON "otp_tokens"("contact_info");

-- AddForeignKey
ALTER TABLE "otp_tokens" ADD CONSTRAINT "otp_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
