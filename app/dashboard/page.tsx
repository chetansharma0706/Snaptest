import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import OverviewPage from "./OverviewPage";
export default async function Tests() {

    const session = await auth();
    if (!session) return redirect("/")
    const userId = session?.user?.id

    const data = await prisma.attempt.findMany({
        where: {
            userId: userId,
        },
        select:{
            id:true,
            score:true,
            createdAt:true,
            quiz:{
                select:{
                    id:true,
                    title:true,
                    description:true,
                    timeLimit:true,
                    questions:{
                        select:{id:true}
                    }
                }
            }
            
        },
        
        orderBy: {
            createdAt: "desc", // 👈 newest first
        },
    })


    return (
        <>
            <OverviewPage attempts={data} />
        </>
    )
}