-- CreateIndex
CREATE INDEX "bookings_learner_id_skill_id_preferred_date_preferred_time_idx" ON "bookings"("learner_id", "skill_id", "preferred_date", "preferred_time");

-- CreateIndex
CREATE INDEX "bookings_provider_id_preferred_date_status_idx" ON "bookings"("provider_id", "preferred_date", "status");
