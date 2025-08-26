import { prisma } from "@/lib/prisma";
import TestPage from "./TestPage";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const testId = (await params).id;
  const userId = session?.user?.id;

  if (!session && !userId) {
    // Not authenticated - redirect to login with return URL
    const currentUrl = encodeURIComponent(`/attempt/${testId}`);
    redirect(`/?callbackUrl=${currentUrl}`);
    return;
  }

  // ✅ Check if already attempted
  const existingAttempt = await prisma.attempt.findFirst({
    where: {
      quizId: testId,
      userId: userId,
    },
    // include: {
    //   answers: true,
    // },
  });

  if (existingAttempt) {
    // Already attempted → redirect or custom page
    redirect(`/attempt/thanks/${existingAttempt.id}`);
    return;
  }

  // Fetch the quiz/test
  const test = await prisma.quiz.findUnique({
    where: { id: testId, status: "PUBLISHED" },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  // If test doesn't exist, show 404
  if (!test) {
    console.log("No test found");
    return notFound();
  }

  // Now we safely fetch the teacher
  const teacher = test.createdBy
    ? await prisma.user.findUnique({
        where: { id: test.createdBy },
        select: { name: true },
      })
    : null;

  const teacherName = teacher?.name || "Anonymous";

  return <TestPage test={test} teacherName={teacherName} />;
}
