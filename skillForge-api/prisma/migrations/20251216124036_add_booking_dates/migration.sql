-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "end_at" TIMESTAMPTZ(6),
ADD COLUMN     "start_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "bookings_provider_id_start_at_end_at_idx" ON "bookings"("provider_id", "start_at", "end_at");
