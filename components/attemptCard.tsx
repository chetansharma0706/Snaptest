"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, MessageCircleQuestionMark, ExternalLink, CheckCircle } from "lucide-react"
import { ShareUrlDialog } from "./ShareUrl"
import { useState } from "react"

export interface TestCardProps {
  id: string
  title: string
  description: string
  duration: string
  nQuestions: number
  timeAgo: string

}

export function AttemptCard({
  id,
  title,
  description,
  duration,
  nQuestions,
  timeAgo,
}: TestCardProps) {

  const [open, setOpen] = useState(false)

  function truncateText(text: string, maxLength: number): string {
    if (!text) return ""
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
  }



  const defaultIcon = <BookOpen className="h-5 w-5 text-primary" />
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const openInNewTab = (url:string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Card
      className={`p-5 hover:shadow-md transition-all duration-200 cursor-pointer group rounded-2xl`}
    >
      <ShareUrlDialog open={open} onOpenChange={setOpen} url={`${origin}/attempt/${id}`} />
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-start justify-center gap-3 sm:flex-1">
          {/* Icon */}
          <div className="hidden flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl md:flex items-center justify-center">
            {defaultIcon}
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-1 md:gap-2 text-card-foreground truncate">
                {truncateText(title, 50)}<CheckCircle className="h-4 md:h-6 w-4 md:w-6 text-success" />
              </h3>
            
            </div>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{truncateText(description , 50)}</p>
          </div>
        </div>

        <div className="flex">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 opacity-40 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {e.stopPropagation(); openInNewTab(`${origin}/performance/${id}`)}}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
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
        <div className="text-xs text-muted-foreground">{timeAgo}</div>
      </div>
    </Card>
  )
}
