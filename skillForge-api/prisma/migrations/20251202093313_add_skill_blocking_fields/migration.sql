-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "blocked_at" TIMESTAMPTZ(6),
ADD COLUMN     "blocked_reason" TEXT,
ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT false;
