import { prisma } from "@/lib/prisma";
import PerformanceReport from "./PerformancePage";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  const attemptId = (await params).id
  if (!session && !userId) {
    // Not authenticated - redirect to login with return URL
    const currentUrl = encodeURIComponent(`/performance/${attemptId}`);
    redirect(`/?callbackUrl=${currentUrl}`);
    return;
  }
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      user: {
        select: {
          id: true,
          name: true,   // assuming your User model has `name`
          email: true,
        },
      },
      quiz: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          questions: {
            select: {
              id: true,
              text: true,
              options: {
                select: {
                  id: true,
                  text: true,
                  isCorrect: true, // ✅ this gives correct option info
                },
              },
            },
          },
        },
      },
      answers: {
        include: {
          option: true,   // the chosen option
          question: {
            select: {
              id: true,
              text: true,
              options: {
                select: {
                  id: true,
                  text: true,
                  isCorrect: true,
                },
              },
            },
          },
        },
      },
    },
  });


  if (!attempt) {
    return notFound()
  }

  const data = JSON.parse(JSON.stringify(attempt));



  return <PerformanceReport data={data} />;
}
