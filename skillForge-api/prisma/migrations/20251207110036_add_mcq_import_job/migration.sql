-- CreateTable
CREATE TABLE "mcq_import_jobs" (
    "id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_path" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "total_rows" INTEGER NOT NULL DEFAULT 0,
    "processed_rows" INTEGER NOT NULL DEFAULT 0,
    "successful_rows" INTEGER NOT NULL DEFAULT 0,
    "failed_rows" INTEGER NOT NULL DEFAULT 0,
    "error_file_path" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "mcq_import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mcq_import_jobs_template_id_idx" ON "mcq_import_jobs"("template_id");

-- CreateIndex
CREATE INDEX "mcq_import_jobs_admin_id_idx" ON "mcq_import_jobs"("admin_id");
