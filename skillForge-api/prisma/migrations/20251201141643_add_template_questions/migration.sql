-- CreateTable
CREATE TABLE "template_questions" (
    "id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_answer" INTEGER NOT NULL,
    "explanation" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "template_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_questions_template_id_idx" ON "template_questions"("template_id");

-- CreateIndex
CREATE INDEX "template_questions_level_idx" ON "template_questions"("level");

-- CreateIndex
CREATE INDEX "template_questions_is_active_idx" ON "template_questions"("is_active");

-- AddForeignKey
ALTER TABLE "template_questions" ADD CONSTRAINT "template_questions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "skill_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
