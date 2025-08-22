/*
  Warnings:

  - You are about to drop the column `correctOptionId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_correctOptionId_fkey";

-- DropIndex
DROP INDEX "public"."Question_correctOptionId_key";

-- AlterTable
ALTER TABLE "public"."Attempt" ALTER COLUMN "score" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Option" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "correctOptionId";

-- AlterTable
ALTER TABLE "public"."Quiz" ALTER COLUMN "description" DROP NOT NULL;
