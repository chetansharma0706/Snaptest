"use client"
import DialogModal from "@/components/dialogModal"
import { ShareUrlDialog } from "@/components/ShareUrl"
import { TestCard } from "@/components/testCard"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import test from "node:test"
import { FormEvent, useState } from "react"


export default function AllTestsPage({ tests }: { tests: any }) {
    console.log(tests)
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)
    const router = useRouter()


    async function handleDelete(id: string) {
        try {
            console.log(id)

            // Fire API request to delete test
            const response = await fetch(`/api/tests/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                },
            })

            if (response.ok) {
                router.push(`/dashboard/tests`)
            } else {
                console.log("Failed to delete test")
                alert("Failed to delete test")

            }
        } catch (error) {
            console.log("Error: ", error)
        }

    }

    function timeAgo(date: Date): string {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

        const intervals: { [key: string]: number } = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        }

        for (const key in intervals) {
            const value = Math.floor(seconds / intervals[key])
            if (value > 0) {
                if (key === "second" && value < 60) return "just now"
                return value === 1 ? `${value} ${key} ago` : `${value} ${key}s ago`
            }
        }

        return "just now"
    }


    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            timeLimit: formData.get("timeLimit"),
        }

        try {
            // Create a promise that resolves in at least 3 seconds
            const delay = new Promise((resolve) => setTimeout(resolve, 3000))

            // Fire API request and delay in parallel
            const [response] = await Promise.all([
                fetch("/api/tests/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(data),
                }),
                delay,
            ])

            if (response.ok) {
                const test = await response.json()
                router.push(`/test/${test.id}`)
            } else {
                console.log("Failed to create test")
                router.push("/dashboard")
            }
        } catch (error) {
            console.log("Error: ", error)
        } finally {
            setLoading(false)
            console.log(data)
            setOpen(false)
        }
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
                                <BreadcrumbPage>All Tests</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 px-10 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        {tests.length !== 0 ? <h1 className="text-2xl font-semibold text-foreground">All Created Tests</h1> :
                            <h2 className="text-xl font-semibold text-foreground">No tests created yet. Start by creating your first test!</h2>}
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg" onClick={() => setOpen(true)}>Create new Test <Plus /></Button>
                    <DialogModal open={open} setOpen={setOpen} loading={loading} handleSubmit={handleSubmit} description="Fill in the details below to create a new test." title="Create Test" />

                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    {tests && tests.map((test: any, index: number) => {
                        return (
                            <>

                                <TestCard
                                    id={test.id}
                                    key={index}
                                    title={test.title}
                                    description={test.description}
                                    duration={test.timeLimit}
                                    nQuestions={test.questions.length}
                                    status={test.status}
                                    nResponses={test.attempts.length}
                                    timeAgo={timeAgo(test.createdAt)}
                                    onEdit={() => { router.push(`/test/${test.id}`) }}
                                    onDelete={() => handleDelete(test.id)}
                                 />
                            </>
                        )

                    })}
                </div>
            </div>
        </>
    )
}