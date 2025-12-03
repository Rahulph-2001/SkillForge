-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reschedule_info" JSONB;

-- CreateIndex
CREATE INDEX "bookings_is_deleted_idx" ON "bookings"("is_deleted");
