import { prisma } from "@/lib/prisma"
import AllTestsPage from "./AllTestPage"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
export default async function Tests() {

    const session = await auth();
    if (!session) return redirect("/")
    const userId = session?.user?.id

    const tests = await prisma.quiz.findMany({
        where: {
            createdBy: userId,
        },
        include: {
            questions: true,  // optional
            attempts: true,   // optional
        },
        orderBy: {
            createdAt: "desc", // 👈 newest first
        },
    })


    return (
        <>
            <AllTestsPage tests={tests} />
        </>
    )
}