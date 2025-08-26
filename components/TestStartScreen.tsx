"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, FileText, Play } from "lucide-react"

interface TestStartInterfaceProps {
  testTitle: string
  testDescription: string
  teacherName: string | null | undefined
  duration?: string
  questionCount?: number
  onStartTest: () => void
}

export function TestStartInterface({
  testTitle,
  testDescription,
  teacherName,
  duration = "60 minutes",
  questionCount = 25,
  onStartTest,
}: TestStartInterfaceProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-16">
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="space-y-2">
              <CardTitle className="text-xl md:text-4xl font-heading font-bold text-foreground leading-tight">
                {testTitle}
              </CardTitle>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Created by {teacherName}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <Clock className="h-3 w-3" />
                {duration}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <FileText className="h-3 w-3" />
                {questionCount} questions
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="text-center">
              <CardDescription className="text-base leading-relaxed max-w-lg mx-auto">
                {testDescription}
              </CardDescription>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Instructions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  Read each question carefully before selecting your answer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  You can navigate between questions using the navigation buttons
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  Make sure to submit your test before the time runs out
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  Once submitted, you cannot make changes to your answers
                </li>
              </ul>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={onStartTest}
                size="lg"
                className="px-12 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
