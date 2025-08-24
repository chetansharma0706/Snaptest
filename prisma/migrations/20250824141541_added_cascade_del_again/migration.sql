-- DropForeignKey
ALTER TABLE "public"."AttemptAnswer" DROP CONSTRAINT "AttemptAnswer_attemptId_fkey";

-- AddForeignKey
ALTER TABLE "public"."AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "public"."Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
