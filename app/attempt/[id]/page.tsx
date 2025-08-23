import { prisma } from "@/lib/prisma";
import TestPage from "./TestPage";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const testId = (await params).id
    const test = await prisma.quiz.findUnique({
        where: { id: testId, status: "PUBLISHED" },
        include: {
            questions: {
                include: {
                    options: true, // fetch options for each question
                },
            },
        },
    })

    const teacherName = await prisma.user.findUnique({
        where: { id: test?.createdBy },
        select: { name: true }
    })

    if (!test) {
        console.log("no test found")
        return notFound()
    }
    return (
        <TestPage test={test} teacherName={teacherName?.name}/>
    )
}