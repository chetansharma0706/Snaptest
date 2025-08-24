import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const attemptId = (await params).id
        const body = await req.json()
        const { answers, score } = body

        // Update attempt
        const updatedAttempt = await prisma.attempt.update({
            where: { id: attemptId },
            data: {
                score,
                answers: {
                    create: answers.map((a: any) => ({
                        questionId: a.questionId,
                        optionId: a.optionId,
                    })),
                },
            },
        });



        return NextResponse.json(updatedAttempt)
    } catch (error) {
        console.error("Error updating attempt:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

