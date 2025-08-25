import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const quizId = (await params).id
    const body = await req.json()
    const { title, description, timeLimit, questions, status } = body

    // Update quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title,
        description,
        timeLimit,
        status,

        // 📝 Strategy: delete existing Qs + re-create them
        questions: {
          deleteMany: {}, // removes old ones
          create: questions.map((q: any) => ({
            text: q.text,
            options: {
              create: q.options.map((opt: any, idx: number) => ({ text: opt.text, isCorrect: idx === q.correctOptionIndex })),
            },
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    })


    return NextResponse.json(updatedQuiz)
  } catch (error) {
    console.error("Error updating quiz:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quizId = (await params).id

    // 1. Delete AttemptAnswer linked to this quiz
    await prisma.attemptAnswer.deleteMany({
      where: { question: { quizId: quizId } }
    });

    // 2. Delete attempts of this quiz
    await prisma.attempt.deleteMany({
      where: { quizId: quizId }
    });

    // 3. Delete questions
    await prisma.question.deleteMany({
      where: { quizId: quizId }
    });


    // Make sure the test belongs to the user
    const deletedTest = await prisma.quiz.deleteMany({
      where: {
        id: quizId,
        createdBy: session.user.id,
      },
    })

    if (!deletedTest.count) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete test error:", error)
    return NextResponse.json({ error: "Failed to delete test" }, { status: 500 })
  }
}
