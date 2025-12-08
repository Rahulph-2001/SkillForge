/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_created_at_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- DropIndex
DROP INDEX "users_subscription_plan_idx";

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "is_admin_blocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deleted_at";

-- CreateTable
CREATE TABLE "provider_availability" (
    "id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "weekly_schedule" JSONB NOT NULL,
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'UTC',
    "buffer_time" INTEGER NOT NULL DEFAULT 15,
    "max_sessions_per_day" INTEGER,
    "min_advance_booking" INTEGER NOT NULL DEFAULT 24,
    "max_advance_booking" INTEGER NOT NULL DEFAULT 30,
    "auto_accept" BOOLEAN NOT NULL DEFAULT false,
    "blocked_dates" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "provider_availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_availability_provider_id_key" ON "provider_availability"("provider_id");

-- CreateIndex
CREATE INDEX "provider_availability_provider_id_idx" ON "provider_availability"("provider_id");

-- AddForeignKey
ALTER TABLE "provider_availability" ADD CONSTRAINT "provider_availability_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
