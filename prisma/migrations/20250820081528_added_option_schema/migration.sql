/*
  Warnings:

  - You are about to drop the column `answer` on the `AttemptAnswer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correctOptionId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `optionId` to the `AttemptAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AttemptAnswer" DROP COLUMN "answer",
ADD COLUMN     "optionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "correctOptionId" TEXT;

-- CreateTable
CREATE TABLE "public"."Option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_correctOptionId_key" ON "public"."Question"("correctOptionId");

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_correctOptionId_fkey" FOREIGN KEY ("correctOptionId") REFERENCES "public"."Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
