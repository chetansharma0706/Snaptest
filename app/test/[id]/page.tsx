import { prisma } from "@/lib/prisma"
import TestEditor from "./TestEditor"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) {
        return redirect('/')
    }
    const testId = (await params).id
    const test = await prisma.quiz.findUnique({
        where: { id: testId },
        include: {
            questions: {
                include: {
                    options: true, // fetch options for each question
                },
            },
        },
    })

    if (!test) {
        notFound()
    }
    return <TestEditor test={test} />
}