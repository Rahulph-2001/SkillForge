/*
  Warnings:

  - You are about to drop the column `duration` on the `skills` table. All the data in the column will be lost.
  - Added the required column `duration_hours` to the `skills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "skills" DROP COLUMN "duration",
ADD COLUMN     "duration_hours" INTEGER NOT NULL,
ADD COLUMN     "mcq_passing_score" INTEGER DEFAULT 70,
ADD COLUMN     "mcq_score" INTEGER DEFAULT 0,
ADD COLUMN     "mcq_total_questions" INTEGER DEFAULT 0,
ADD COLUMN     "rejection_reason" TEXT,
ADD COLUMN     "verification_status" TEXT DEFAULT 'not_started',
ADD COLUMN     "verified_at" TIMESTAMPTZ(6),
ALTER COLUMN "status" SET DEFAULT 'pending-verification';

-- CreateTable
CREATE TABLE "skill_templates" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "credits_min" INTEGER NOT NULL,
    "credits_max" INTEGER NOT NULL,
    "mcq_count" INTEGER NOT NULL,
    "pass_range" INTEGER NOT NULL DEFAULT 70,
    "levels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "skill_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_questions" (
    "id" UUID NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_answer" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "skill_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_verification_attempts" (
    "id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "questions_asked" JSONB NOT NULL,
    "user_answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "time_taken" INTEGER,
    "attempted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_verification_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skill_templates_category_idx" ON "skill_templates"("category");

-- CreateIndex
CREATE INDEX "skill_templates_status_idx" ON "skill_templates"("status");

-- CreateIndex
CREATE INDEX "skill_templates_is_active_idx" ON "skill_templates"("is_active");

-- CreateIndex
CREATE INDEX "skill_questions_category_idx" ON "skill_questions"("category");

-- CreateIndex
CREATE INDEX "skill_questions_level_idx" ON "skill_questions"("level");

-- CreateIndex
CREATE INDEX "skill_questions_difficulty_idx" ON "skill_questions"("difficulty");

-- CreateIndex
CREATE INDEX "skill_questions_is_active_idx" ON "skill_questions"("is_active");

-- CreateIndex
CREATE INDEX "skill_verification_attempts_skill_id_idx" ON "skill_verification_attempts"("skill_id");

-- CreateIndex
CREATE INDEX "skill_verification_attempts_user_id_idx" ON "skill_verification_attempts"("user_id");

-- CreateIndex
CREATE INDEX "skill_verification_attempts_attempted_at_idx" ON "skill_verification_attempts"("attempted_at");

-- CreateIndex
CREATE INDEX "skills_verification_status_idx" ON "skills"("verification_status");

-- AddForeignKey
ALTER TABLE "skill_verification_attempts" ADD CONSTRAINT "skill_verification_attempts_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
