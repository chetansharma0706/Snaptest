import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function Responses() {
    const session = await auth();

    if (!session || !session?.user?.id) {
        return redirect("/");
    }

    const fetchData = await prisma.quiz.findMany({
        where:{
            createdBy: session.user.id,
            status:"PUBLISHED"
        },
        select:{
            title:true,
            questions:{
                select:{id:true}
            },

            attempts:{
                select:{
                    id:true,
                    user:{
                        select:{
                            name:true,
                            email:true,
                            
                        },
                    },
                    score:true
                }
            }
        }
    })
    const data = fetchData.flatMap(quiz =>
        quiz.attempts.map(a => ({
            id: a.id,
            name: a.user?.name ?? "",
            email: a.user?.email ?? "",
            testTitle: quiz.title,
            score: `${a.score} / ${quiz.questions.length}`,
        }))
    );

    return (
        <>
            <header className="flex h-16 shrink-0 mt-1 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Responses</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="container mx-auto py-10 px-10">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}