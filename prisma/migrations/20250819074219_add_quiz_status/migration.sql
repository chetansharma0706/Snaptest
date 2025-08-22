-- CreateEnum
CREATE TYPE "public"."QuizStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'BLOCKED');

-- AlterTable
ALTER TABLE "public"."Quiz" ADD COLUMN     "status" "public"."QuizStatus" NOT NULL DEFAULT 'DRAFT';
