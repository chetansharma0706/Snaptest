"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Clock, Users, BookOpen, MoreHorizontal, Edit, Share, Trash2, MessageCircleQuestionMark } from "lucide-react"
import { ShareUrlDialog } from "./ShareUrl"
import { useState } from "react"

export interface TestCardProps {
  id: string
  title: string
  description: string
  duration: string
  nQuestions: number
  status: "DRAFT" | "BLOCKED" | "PUBLISHED"
  nResponses?: number
  timeAgo: string
  icon?: React.ReactNode
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
}

export function TestCard({
  id,
  title,
  description,
  duration,
  nQuestions,
  status,
  nResponses,
  timeAgo,
  icon,
  onEdit,
  onShare,
  onDelete,
}: TestCardProps) {

  const [open, setOpen] = useState(false)

  function truncateText(text: string, maxLength: number): string {
    if (!text) return ""
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800"
      case "DRAFT":
        return "bg-blue-100 text-blue-800"
      case "BLOCKED":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const defaultIcon = <BookOpen className="h-5 w-5 text-primary" />

  return (
    <Card
      className={`p-5 hover:shadow-md transition-all duration-200 cursor-pointer group rounded-2xl`}
    >
      <ShareUrlDialog open={open} onOpenChange={setOpen} url={`${window.location.origin}/attempt/${id}`} />
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-start justify-center gap-3 sm:flex-1">
          {/* Icon */}
          {/* <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            {icon || defaultIcon}
          </div> */}

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground truncate">
                {truncateText(title, 20)}
              </h3>
              <Badge variant="secondary" className={`text-xs ${getStatusColor(status)}`}>
                {status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{truncateText(description , 20)}</p>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Test
                </DropdownMenuItem>
              )}
              {status === "PUBLISHED" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(true)
                  }}
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share Test
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Test
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {duration !== null && <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{duration} min</span>
        </div>}
        <div className="flex items-center gap-1">
          <MessageCircleQuestionMark  className="h-4 w-4" />
          <span>{nQuestions} questions</span>
        </div>
        {nResponses !== undefined && (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{nResponses} responses</span></div>
        )}
        <div className="text-xs text-muted-foreground">{timeAgo}</div>
      </div>
    </Card>
  )
}
