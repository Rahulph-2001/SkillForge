/*
  Warnings:

  - You are about to drop the column `phone_number` on the `users` table. All the data in the column will be lost.
  - The `subscription_plan` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `otp_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPlanType" AS ENUM ('free', 'starter', 'professional', 'enterprise');

-- CreateEnum
CREATE TYPE "PlanBadge" AS ENUM ('Free', 'Starter', 'Professional', 'Enterprise');

-- DropForeignKey
ALTER TABLE "otp_tokens" DROP CONSTRAINT "otp_tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone_number",
ALTER COLUMN "verification" SET DEFAULT '{"email_verified":false,"email_verified_at":null,"bank_details":{"account_number":null,"ifsc_code":null,"account_holder_name":null,"bank_name":null,"upi_id":null,"verified":false,"verified_at":null,"verification_method":null}}',
ALTER COLUMN "anti_fraud" SET DEFAULT '{"registration_ip":null,"last_login_ip":null,"account_age_days":0,"suspicious_activity_flags":[],"last_redemption_date":null,"redemption_count":0,"risk_score":0,"flagged_for_review":false}',
DROP COLUMN "subscription_plan",
ADD COLUMN     "subscription_plan" "SubscriptionPlanType" NOT NULL DEFAULT 'free',
ALTER COLUMN "settings" SET DEFAULT '{"marketing_emails":true,"notification_preferences":{"email":true,"push":true,"booking_notifications":true,"message_notifications":true,"credit_notifications":true,"community_notifications":true,"project_notifications":true},"privacy_settings":{"profile_visibility":"public","show_location":true,"show_email":false},"language":"en","timezone":"UTC"}';

-- DropTable
DROP TABLE "otp_tokens";

-- DropEnum
DROP TYPE "OTPType";

-- DropEnum
DROP TYPE "SubscriptionPlan";

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "project_posts" INTEGER,
    "community_posts" INTEGER,
    "badge" "PlanBadge" NOT NULL,
    "color" VARCHAR(50) NOT NULL DEFAULT 'blue',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "features" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE INDEX "subscription_plans_name_idx" ON "subscription_plans"("name");

-- CreateIndex
CREATE INDEX "subscription_plans_badge_idx" ON "subscription_plans"("badge");

-- CreateIndex
CREATE INDEX "subscription_plans_is_active_idx" ON "subscription_plans"("is_active");

-- CreateIndex
CREATE INDEX "subscription_plans_price_idx" ON "subscription_plans"("price");

-- CreateIndex
CREATE INDEX "users_subscription_plan_idx" ON "users"("subscription_plan");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
