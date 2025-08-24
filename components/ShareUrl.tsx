"use client"

import type React from "react"

import { Dispatch, SetStateAction, useState } from "react"
import { Copy, Check, Share2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShareUrlDialogProps {
  url?: string
  title?: string
  children?: React.ReactNode
  open?:boolean
  onOpenChange?:Dispatch<SetStateAction<boolean>>
}

export function ShareUrlDialog({
  url = window?.location?.href || "https://example.com",
  title = "Share This URL",
  children,
  open = false,
  onOpenChange
}: ShareUrlDialogProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      console.log( "URL copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.log(err)
    }
  }

  const openInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children} 
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans font-semibold text-foreground">{title}</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground">
            Copy the link below or open it in a new tab
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL Copy Section */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium text-foreground">
              URL
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="url"
                value={url}
                readOnly
                className="flex-1 bg-muted/50 text-muted-foreground font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Actions</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="w-full gap-2 hover:bg-secondary bg-transparent"
            >
              <ExternalLink className="h-4 w-4"  />
              Open in New Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
