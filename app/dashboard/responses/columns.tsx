"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ExternalLink } from "lucide-react"

const openInNewTab = (url:string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Response = {
    id: string
    name: string
    email: string
    testTitle: string
    score: string
}

export const columns: ColumnDef<Response>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "testTitle",
        header: "Test Title",
    },
    {
        accessorKey: "score",
        header: "Score",
    },
    {
        accessorKey: "id",
        header: "Details",
        cell: ({ row }) => {
            const id = row.original.id
            return (
                <Button
              variant="ghost"
              size="sm"
              onClick={() => openInNewTab(`/performance/${id}`)}
              className="gap-2 hover:bg-secondary bg-transparent"
            >
              <ExternalLink className="h-4 w-4"  />
            </Button>
            )
        },
    },
]