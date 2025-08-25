/*
  Warnings:

  - You are about to drop the column `Explaination` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "Explaination",
ADD COLUMN     "explanation" TEXT DEFAULT '';
