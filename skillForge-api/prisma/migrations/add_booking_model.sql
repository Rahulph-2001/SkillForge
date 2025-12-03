-- CreateEnum for BookingStatus
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'rejected', 'completed', 'cancelled');

-- CreateTable for Bookings
CREATE TABLE "bookings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "learner_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "preferred_date" DATE NOT NULL,
    "preferred_time" VARCHAR(5) NOT NULL,
    "message" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "session_cost" INTEGER NOT NULL,
    "confirmed_date" TIMESTAMPTZ(6),
    "confirmed_time" VARCHAR(5),
    "rejection_reason" TEXT,
    "cancelled_reason" TEXT,
    "cancelled_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookings_learner_id_idx" ON "bookings"("learner_id");
CREATE INDEX "bookings_skill_id_idx" ON "bookings"("skill_id");
CREATE INDEX "bookings_provider_id_idx" ON "bookings"("provider_id");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
CREATE INDEX "bookings_preferred_date_idx" ON "bookings"("preferred_date");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
