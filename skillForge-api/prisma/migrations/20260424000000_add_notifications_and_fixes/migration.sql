-- CreateEnum
CREATE TYPE "ProjectPaymentRequestType" AS ENUM ('RELEASE', 'REFUND');

-- CreateEnum
CREATE TYPE "ProjectPaymentRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserWalletTransactionType" AS ENUM ('PROJECT_EARNING', 'SESSION_EARNING', 'SESSION_PAYMENT', 'CREDIT_REDEMPTION', 'WITHDRAWAL', 'REFUND', 'CREDIT_PURCHASE', 'COMMUNITY_JOIN', 'COMMUNITY_EARNING', 'PROJECT_PAYMENT', 'WITHDRAWAL_REQUEST', 'WITHDRAWAL_PROCESSED', 'WITHDRAWAL_REJECTED', 'CREDIT_REDEMPTION_SUCCESS');

-- CreateEnum
CREATE TYPE "UserWalletTransactionStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "ProjectApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('USER_REPORT', 'PROJECT_DISPUTE', 'COMMUNITY_CONTENT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SESSION_CONFIRMED', 'SESSION_DECLINED', 'SESSION_CANCELLED', 'SESSION_COMPLETED', 'RESCHEDULE_REQUESTED', 'RESCHEDULE_ACCEPTED', 'RESCHEDULE_DECLINED', 'NEW_MESSAGE', 'CREDITS_EARNED', 'CREDITS_RECEIVED', 'COMMUNITY_UPDATE', 'BOOKING_REQUEST', 'PROFILE_VERIFIED', 'PROJECT_APPLICATION_RECEIVED', 'PROJECT_APPLICATION_ACCEPTED', 'PROJECT_APPLICATION_REJECTED', 'PROJECT_COMPLETION_REQUESTED', 'PROJECT_COMPLETION_APPROVED', 'PROJECT_COMPLETION_REJECTED', 'SKILL_APPROVED', 'SKILL_REJECTED', 'SKILL_BLOCKED', 'INTERVIEW_SCHEDULED', 'SUBSCRIPTION_RENEWED', 'PAYMENT_RECEIVED', 'NEW_USER_REGISTERED', 'NEW_SKILL_PENDING', 'NEW_REPORT_SUBMITTED', 'WITHDRAWAL_REQUESTED', 'PROJECT_ESCROW_RELEASE_REQUESTED', 'NEW_PROJECT_CREATED', 'WITHDRAWAL_PROCESSED', 'WITHDRAWAL_REJECTED', 'CREDIT_REDEMPTION_SUCCESS');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED', 'FAILED');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'in_session';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProjectStatus" ADD VALUE 'Pending_Completion';
ALTER TYPE "ProjectStatus" ADD VALUE 'Payment_Pending';
ALTER TYPE "ProjectStatus" ADD VALUE 'Refund_Pending';

-- AlterTable
ALTER TABLE "VideoCallRoom" ADD COLUMN     "interview_id" UUID;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "is_suspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suspend_reason" TEXT,
ADD COLUMN     "suspended_at" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "credit_packages" (
    "id" UUID NOT NULL,
    "credits" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "credit_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSON,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_applications" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "applicant_id" UUID NOT NULL,
    "cover_letter" TEXT NOT NULL,
    "proposed_budget" DECIMAL(10,2),
    "proposed_duration" VARCHAR(100),
    "status" "ProjectApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "match_score" DECIMAL(5,2),
    "match_analysis" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "reviewed_at" TIMESTAMPTZ(6),

    CONSTRAINT "project_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_payment_requests" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "type" "ProjectPaymentRequestType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "requested_by" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "status" "ProjectPaymentRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requester_notes" TEXT,
    "admin_notes" TEXT,
    "processed_at" TIMESTAMPTZ(6),
    "processed_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_payment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "meeting_link" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "learner_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "review" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_wallet_transactions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "UserWalletTransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "source" VARCHAR(100) NOT NULL,
    "reference_id" UUID,
    "description" TEXT,
    "metadata" JSONB,
    "previous_balance" DECIMAL(10,2) NOT NULL,
    "new_balance" DECIMAL(10,2) NOT NULL,
    "status" "UserWalletTransactionStatus" NOT NULL DEFAULT 'COMPLETED',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "reporter_id" UUID NOT NULL,
    "type" "ReportType" NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "target_user_id" UUID,
    "project_id" UUID,
    "resolution" TEXT,
    "resolved_by" UUID,
    "resolved_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_messages" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "project_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" UUID NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updated_by" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawal_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "bank_details" JSONB NOT NULL,
    "admin_note" TEXT,
    "processed_by" UUID,
    "processed_at" TIMESTAMPTZ(6),
    "transaction_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "project_applications_project_id_idx" ON "project_applications"("project_id");

-- CreateIndex
CREATE INDEX "project_applications_applicant_id_idx" ON "project_applications"("applicant_id");

-- CreateIndex
CREATE INDEX "project_applications_status_idx" ON "project_applications"("status");

-- CreateIndex
CREATE INDEX "project_applications_match_score_idx" ON "project_applications"("match_score");

-- CreateIndex
CREATE INDEX "project_applications_created_at_idx" ON "project_applications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "project_applications_project_id_applicant_id_key" ON "project_applications"("project_id", "applicant_id");

-- CreateIndex
CREATE INDEX "project_payment_requests_project_id_idx" ON "project_payment_requests"("project_id");

-- CreateIndex
CREATE INDEX "project_payment_requests_status_idx" ON "project_payment_requests"("status");

-- CreateIndex
CREATE INDEX "project_payment_requests_type_idx" ON "project_payment_requests"("type");

-- CreateIndex
CREATE INDEX "interviews_application_id_idx" ON "interviews"("application_id");

-- CreateIndex
CREATE INDEX "interviews_scheduled_at_idx" ON "interviews"("scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_booking_id_key" ON "reviews"("booking_id");

-- CreateIndex
CREATE INDEX "reviews_provider_id_idx" ON "reviews"("provider_id");

-- CreateIndex
CREATE INDEX "reviews_learner_id_idx" ON "reviews"("learner_id");

-- CreateIndex
CREATE INDEX "reviews_skill_id_idx" ON "reviews"("skill_id");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_user_id_idx" ON "user_wallet_transactions"("user_id");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_type_idx" ON "user_wallet_transactions"("type");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_status_idx" ON "user_wallet_transactions"("status");

-- CreateIndex
CREATE INDEX "user_wallet_transactions_created_at_idx" ON "user_wallet_transactions"("created_at");

-- CreateIndex
CREATE INDEX "reports_reporter_id_idx" ON "reports"("reporter_id");

-- CreateIndex
CREATE INDEX "reports_target_user_id_idx" ON "reports"("target_user_id");

-- CreateIndex
CREATE INDEX "reports_project_id_idx" ON "reports"("project_id");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "reports"("type");

-- CreateIndex
CREATE INDEX "project_messages_project_id_idx" ON "project_messages"("project_id");

-- CreateIndex
CREATE INDEX "project_messages_created_at_idx" ON "project_messages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE INDEX "withdrawal_requests_user_id_idx" ON "withdrawal_requests"("user_id");

-- CreateIndex
CREATE INDEX "withdrawal_requests_status_idx" ON "withdrawal_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VideoCallRoom_interview_id_key" ON "VideoCallRoom"("interview_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_applications" ADD CONSTRAINT "project_applications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_applications" ADD CONSTRAINT "project_applications_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_payment_requests" ADD CONSTRAINT "project_payment_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCallRoom" ADD CONSTRAINT "VideoCallRoom_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "project_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wallet_transactions" ADD CONSTRAINT "user_wallet_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

