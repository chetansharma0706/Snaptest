"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import DialogModal from "@/components/dialogModal"

export default function Overview() {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
            <header className="flex h-16 shrink-0 mt-1 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
                                <BreadcrumbPage>Overview</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                 <Button className="mr-4 max-[375px]:hidden cursor-pointer" onClick={()=>setOpen(true)}>
                            <Plus /> Create
                        </Button>
                        <DialogModal open={open} setOpen={setOpen} loading={loading} handleSubmit={handleSubmit} description="Fill in the details below to create a new test." title="Create Test" />




            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
        </>
    )
}