"use client"
import { AttemptCard } from "@/components/attemptCard"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"



export default function OverviewPage({ attempts }: { attempts: any }) {

    const { data : session  } = useSession()
    const userName = session?.user?.name
    const welcomeMess = userName ? `Welcome, ${userName.split(" ")[0]}!` : "Welcome Dear"


    function timeAgo(date: Date): string {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

        const intervals: { [key: string]: number } = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60,
        }

        if (seconds < 60) return "just now"

        for (const key in intervals) {
            const value = Math.floor(seconds / intervals[key])
            if (value >= 1) {
                return value === 1 ? `${value} ${key} ago` : `${value} ${key}s ago`
            }
        }

        return "just now"
    }



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
                                <BreadcrumbPage>{welcomeMess}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 px-10 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        {attempts.length !== 0 ? <h1 className="text-2xl font-semibold text-foreground">Recently Completed Tests</h1> :
                            <h2 className="text-xl font-semibold text-foreground">No tests Attempted yet.</h2>}
                    </div>


                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    {attempts && attempts.map((attempt: any, index: number) => {
                        return (

                            <AttemptCard key={index} id={attempt.id} title={attempt.quiz.title} description={attempt.quiz.description} nQuestions={attempt.quiz.questions.length} duration={attempt.quiz.timeLimit} timeAgo={timeAgo(attempt.createdAt)} />
                        )

                    })}
                </div>
            </div>
        </>
    )
}

// const data: {
//     id: string;
//     createdAt: Date;
//     quiz: {
//         id: string;
//         title: string;
//         description: string | null;
// timeLimit: number | null;
//         questions: {
//             id: string;
//         }[];
//     };
//     score: number;
// }[]