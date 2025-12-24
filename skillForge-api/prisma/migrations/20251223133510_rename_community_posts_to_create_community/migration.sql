/*
  Warnings:

  - You are about to drop the column `community_posts` on the `subscription_plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_plans" DROP COLUMN "community_posts",
ADD COLUMN     "create_community" INTEGER;
