import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const attemptId = (await params).id
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

        console.log("Fetched attempt:", attempt)
        if (!attempt) {
            return new NextResponse("Attempt not found", { status: 404 })
        }
        return NextResponse.json(attempt)
    } catch (error) {
        console.error("Error fetching attempt:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

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

