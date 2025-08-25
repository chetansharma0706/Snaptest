"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Trophy, Target, BookOpen, UserIcon, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  text: string
  options: Option[]
}

interface Answer {
  id: string
  attemptId: string
  questionId: string
  optionId: string
  question: Question
  option: Option
}

interface Quiz {
  id: string
  title: string
  description: string
  createdAt: string
  questions: Question[]
}

interface AttemptData {
  id: string
  userId: string
  quizId: string
  score: number
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  quiz: Quiz
  answers: Answer[]
}

interface PerformanceReportProps {
  data: AttemptData
}

export default function PerformanceReport({ data }: PerformanceReportProps) {
  const totalQuestions = data.quiz.questions.length
  const correctAnswers = data.score
  const incorrectAnswers = totalQuestions - correctAnswers
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success"
    if (percentage >= 60) return "text-foreground"
    return "text-destructive"
  }

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "default"
    if (percentage >= 60) return "secondary"
    return "destructive"
  }

  function truncateText(text: string, maxLength: number): string {
    if (!text) return ""
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-foreground" />
          <h1 className="text-3xl font-bold text-foreground">Performance Report</h1>
        </div>

        {/* Participant Information Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Participant</p>
                    <p className="text-lg font-semibold text-foreground">{data.user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground">{data.user.email}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Quiz Completed</p>
                <p className="text-lg font-medium text-foreground">{data.quiz.title}</p>
                <p className="text-sm text-muted-foreground">{formatDate(data.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold text-success">{correctAnswers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
                <p className="text-2xl font-bold text-destructive">{incorrectAnswers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className={cn("text-2xl font-bold", getScoreColor(scorePercentage))}>{scorePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Overall Performance</h3>
            <Badge variant={getScoreBadgeVariant(scorePercentage)}>{scorePercentage}% Complete</Badge>
          </div>
          <Progress value={scorePercentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{correctAnswers} correct</span>
            <span>{incorrectAnswers} incorrect</span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Question-by-Question Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {data.quiz.questions.map((question, index) => {
              const answer = data.answers.find((ans) => ans.questionId === question.id)
              const isCorrect = answer ? answer.option.isCorrect : false
              const correctOption = question.options.find((opt) => opt.isCorrect)

              return (
                <div key={question.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive" />
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        <h4 className="text-lg font-medium text-foreground mb-3">{question.text}</h4>
                      </div>

                      <div className="space-y-2">
                        {answer && (
                          <div className="flex flex-col md:flex-row  md:items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Your Answer:</span>
                            <Badge
                              variant={answer.option.isCorrect ? "default" : "destructive"}
                              className="font-normal"
                            >
                              {truncateText(answer.option.text.trim(), 30)}
                            </Badge>
                          </div>
                        )}

                        {!isCorrect && correctOption && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Correct Answer:</span>
                            <Badge variant="default" className="font-normal bg-success text-success-foreground">
                              {truncateText(correctOption.text.trim(),30)}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* All Options Display */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground mb-2">All Options:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {question.options.map((option, optIndex) => {
                            const isUserChoice = answer ? option.id === answer.optionId : false
                            const isCorrectOption = option.isCorrect

                            return (
                              <div
                                key={option.id}
                                className={cn(
                                  "p-3 rounded-lg border text-sm",
                                  isCorrectOption && "bg-success/10 border-success/20",
                                  isUserChoice && !isCorrectOption && "bg-destructive/10 border-destructive/20",
                                  !isUserChoice && !isCorrectOption && "bg-muted/50 border-border",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-muted-foreground">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span
                                    className={cn(
                                      isCorrectOption && "text-success font-medium",
                                      isUserChoice && !isCorrectOption && "text-destructive font-medium",
                                    )}
                                  >
                                    {option.text.trim()}
                                  </span>
                                  {isCorrectOption && <CheckCircle className="h-4 w-4 text-success ml-auto" />}
                                  {isUserChoice && !isCorrectOption && (
                                    <XCircle className="h-4 w-4 text-destructive ml-auto" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
