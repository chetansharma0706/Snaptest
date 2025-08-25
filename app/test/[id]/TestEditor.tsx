"use client"

import { v4 as uuidv4 } from 'uuid';
import { useReducer, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { X, Plus, ChevronLeft, ChevronRight, Trash2, Sparkles, Loader2, SquarePen, Menu, Save, Upload, Share2, EllipsisVertical } from "lucide-react"
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { QuestionEditorSkeleton } from '@/components/QuestionEditorSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenu } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ShareUrlDialog } from '@/components/ShareUrl';


interface Option {
    text: string
}

interface Question {
    id: string
    text: string
    options: Option[]
    correctOptionIndex: number
    explanation?: string
}

type status = "DRAFT" | "PUBLISHED" | "BLOCKED"
const maxQuestions = 10


interface TestState {
    title: string
    description: string
    timeLimit: number | null
    questions: Question[]
    status: status
    saveLoading: boolean
    currentQuestionIndex: number,
    publishLoading: boolean
    aiLoading: boolean
    aiTopic: string
    aiDifficulty: 'easy' | 'medium' | 'hard'
    aiQuestionCount: number
    aiSubject: string
    aiGradeLevel: string
    aiAdditionalContext: string
}

type Actions =
    | { type: "SET_TITLE"; payload: string }
    | { type: "SET_DESCRIPTION"; payload: string }
    | { type: "SET_TIME_LIMIT"; payload: number }
    | { type: "SET_STATUS"; payload: status }
    | { type: "SET_SAVE_LOADING"; payload: boolean }
    | { type: "SET_PUB_LOADING"; payload: boolean }
    | { type: "SET_CURRENT_QUES_INDEX", payload: number }
    | { type: "SET_CURR_QUES"; payload: Partial<Question> }
    | { type: "SET_CURR_QUES_OPTION"; payload: { optionIndex: number; text: string } }
    | { type: "ADD_NEW_QUESTION" }
    | { type: "NAVIGATE_QUES"; payload: number }
    | { type: "GO_TO_NEXT_QUES" }
    | { type: "GO_TO_PREV_QUES" }
    | { type: "DEL_QUES" }
    | { type: "SET_QUESTIONS"; payload: Question[] }
    // AI related
    | { type: "SET_AI_LOADING"; payload: boolean }
    | { type: "SET_AI_TOPIC"; payload: string }
    | { type: "SET_AI_DIFFICULTY"; payload: 'easy' | 'medium' | 'hard' }
    | { type: "SET_AI_QUESTION_COUNT"; payload: number }
    | { type: "SET_AI_SUBJECT"; payload: string }
    | { type: "SET_AI_GRADE_LEVEL"; payload: string }
    | { type: "SET_AI_ADDITIONAL_CONTEXT"; payload: string }

const sampleQues = [
    {
        id: 1,
        text: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
    }
]

function reducer(state: TestState, actions: Actions): TestState {
    switch (actions.type) {
        case "SET_TITLE":
            return { ...state, title: actions.payload }
        case "SET_DESCRIPTION":
            return { ...state, description: actions.payload }
        case "SET_TIME_LIMIT":
            return { ...state, timeLimit: actions.payload }
        case "SET_STATUS":
            return { ...state, status: actions.payload }
        case "SET_SAVE_LOADING":
            return { ...state, saveLoading: actions.payload }
        case "SET_PUB_LOADING":
            return { ...state, publishLoading: actions.payload }
        case "SET_AI_LOADING":
            return { ...state, aiLoading: actions.payload }
        case "SET_AI_TOPIC":
            return { ...state, aiTopic: actions.payload }
        case "SET_AI_DIFFICULTY":
            return { ...state, aiDifficulty: actions.payload }
        case "SET_AI_QUESTION_COUNT":
            return { ...state, aiQuestionCount: actions.payload }
        case "SET_AI_SUBJECT":
            return { ...state, aiSubject: actions.payload }
        case "SET_AI_GRADE_LEVEL":
            return { ...state, aiGradeLevel: actions.payload }
        case "SET_AI_ADDITIONAL_CONTEXT":
            return { ...state, aiAdditionalContext: actions.payload }
        case "SET_CURRENT_QUES_INDEX":
            return { ...state, currentQuestionIndex: actions.payload }
        case "SET_QUESTIONS":
            return { ...state, questions: actions.payload }    
        case "SET_CURR_QUES": {
            const updatedQuestions = state.questions.map((q, index) =>
                index === state.currentQuestionIndex ? { ...q, ...actions.payload } : q
            )
            return { ...state, questions: updatedQuestions }
        }
        case "SET_CURR_QUES_OPTION": {
            const { optionIndex, text } = actions.payload
            const updatedQuestions = state.questions.map((q, idx) =>
                idx === state.currentQuestionIndex
                    ? {
                        ...q,
                        options: q.options.map((opt, i) =>
                            i === optionIndex ? { text } : opt
                        ),
                    }
                    : q
            )
            return { ...state, questions: updatedQuestions }
        }
        case "ADD_NEW_QUESTION": {
            if (state.questions.length >= maxQuestions) return state
            const newQuestion: Question = {
                id: uuidv4(),
                text: "",
                options: [
                    { text: "" },
                    { text: "" },
                    { text: "" },
                    { text: "" }
                ],
                correctOptionIndex: 0,
            }
            return {
                ...state,
                questions: [...state.questions, newQuestion],
                currentQuestionIndex: state.questions.length,
            }
        }
        case "NAVIGATE_QUES":
            return {
                ...state,
                currentQuestionIndex: actions.payload,
            }
        case "GO_TO_NEXT_QUES":
            if (state.currentQuestionIndex < state.questions.length - 1) {
                return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 }
            }
            return state
        case "GO_TO_PREV_QUES":
            if (state.currentQuestionIndex > 0) {
                return { ...state, currentQuestionIndex: state.currentQuestionIndex - 1 }
            }
            return state
        case "DEL_QUES": {
            if (state.questions.length <= 1) return state
            const newQuestions = state.questions.filter((_, idx) => idx !== state.currentQuestionIndex)
            let newIndex = state.currentQuestionIndex
            if (newIndex >= newQuestions.length) {
                newIndex = newQuestions.length - 1
            }
            return {
                ...state,
                questions: newQuestions,
                currentQuestionIndex: newIndex,
            }
        }
        default:
            return state
    }
}


export default function TestEditor({ test }: { test: any }) {
    const [open, setOpen] = useState(false)
    const [aiDialogOpen, setAiDialogOpen] = useState(false)
    const router = useRouter();

    console.log(test.status)

    const intialState: TestState = {
        title: test.title,
        description: test.description,
        timeLimit: test.timeLimit,
        questions: test.questions.length === 0 ? sampleQues : test.questions,
        status: test.status,
        saveLoading: false,
        currentQuestionIndex: 0,
        publishLoading: false,
        // AI related
        aiLoading: false,
        aiTopic: "",
        aiDifficulty: "medium",
        aiQuestionCount: 1,
        aiSubject: "",
        aiGradeLevel: "",
        aiAdditionalContext: ""
    }


    const [state, dispatch] = useReducer(reducer, intialState)
    const { title, description, questions, saveLoading, publishLoading, currentQuestionIndex, timeLimit, status,
        // AI related
        aiLoading, aiTopic, aiSubject, aiGradeLevel, aiDifficulty, aiQuestionCount, aiAdditionalContext } = state

    console.log(test)

    const currentQuestion = questions[currentQuestionIndex]

    function cleanQuestions(questions: Question[]) {
        return questions.filter(q => {
            // Check for empty question text
            if (!q.text || q.text.trim() === "") return false;

            // Check if any option is empty
            if (!q.options || q.options.some((opt: Option) => !opt || opt.text.trim() === "")) {
                return false;
            }

            return true;
        });
    }

    // Usage
    const cleanedQuestions = cleanQuestions(questions);
    const data = {
        title: title,
        description: description,
        questions: cleanedQuestions,
        timeLimit: timeLimit,
        status: status,
    }

    const generateAiQues = async () => {
        dispatch({ type: "SET_AI_LOADING", payload: true })
        setAiDialogOpen(false)
        try {
            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: aiTopic,
                    difficulty: aiDifficulty,
                    questionCount: aiQuestionCount,
                    subject: aiSubject,
                    gradeLevel: aiGradeLevel,
                    additionalContext: aiAdditionalContext
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                const generatedQuestions = data.questions.map((q: any) => ({
                    id: uuidv4(),
                    text: q.question,
                    options: q.options.map((opt: string) => ({ text: opt })),
                    correctOptionIndex: q.correctAnswer - 1,
                    explanation: q.explanation || ""
                }))

                // Merge with existing questions but limit to maxQuestions
                const combinedQuestions = [...cleanedQuestions, ...generatedQuestions].slice(0, maxQuestions)

                dispatch({ type: "SET_QUESTIONS", payload: combinedQuestions })
                // Update the questions in state
                dispatch({ type: "SET_AI_LOADING", payload: false })
                dispatch({ type: "SET_AI_TOPIC", payload: "" })
                dispatch({ type: "SET_AI_SUBJECT", payload: "" })
                dispatch({ type: "SET_AI_GRADE_LEVEL", payload: "" })
                dispatch({ type: "SET_AI_QUESTION_COUNT", payload: 1 })
                dispatch({ type: "SET_AI_ADDITIONAL_CONTEXT", payload: "" })

            } else {
                console.error('Failed to generate questions');
                alert("Something went wrong. Please try again.")
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            alert("Error generating questions. Please try again.")
        } finally {
            dispatch({ type: "SET_AI_LOADING", payload: false })
            setOpen(false)
        }
    }

    async function handleSave() {
        dispatch({ type: "SET_SAVE_LOADING", payload: true })
        console.log(status)
        try {

            const response = await fetch(`/api/tests/${test.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)

            })

            if (response.ok) {
                alert("Test Saved Successfully!")
            } else {
                console.log("Error in saving test")
            }

        } catch (error) {
            console.error("Error in saving test", error)
        } finally {
            dispatch({ type: "SET_SAVE_LOADING", payload: false })
        }

    }

    async function handlePublish(type: string) {
        dispatch({ type: "SET_PUB_LOADING", payload: true })
        const newStatus = type === "PUBLISH" ? "PUBLISHED" : "DRAFT"
        dispatch({ type: "SET_STATUS", payload: newStatus })
        try {

            const response = await fetch(`/api/tests/${test.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, status: newStatus })

            })

            if (response.ok) {
                if (type === "PUBLISH") {
                    alert("Test Published Successfully!")
                } else {
                    alert("Test Unpublished Successfully!")
                }
            } else {
                console.log("Something went wrong")
            }

        } catch (error) {
            console.error("Something went wrong", error)
        } finally {
            dispatch({ type: "SET_PUB_LOADING", payload: false })
            if (type === "PUBLISH") return setOpen(true)

        }
    }


    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border px-6 py-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex-1 max-w-md">

                        <Dialog>
                            {!aiLoading ?
                                <DialogTrigger asChild>
                                    <h2 className='font-semibold flex items-center gap-2 cursor-pointer'>{title} <SquarePen size={15} /></h2>
                                </DialogTrigger> : <Skeleton className='w-30 md:w-100 h-8' />}
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Test</DialogTitle>
                                    <DialogDescription>
                                        Update the test details
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                    {/* Title */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Enter test title"
                                            value={title}
                                            onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Write test instructions or notes for your students"
                                            value={description}
                                            onChange={(e) => dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })}
                                        />
                                    </div>

                                    {/* Time Limit Dropdown */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="timelimit">Time Limit</Label>
                                        <Select name="timeLimit" value={timeLimit?.toString()} onValueChange={(value) => dispatch({ type: "SET_TIME_LIMIT", payload: parseInt(value) })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time limit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 2 }, (_, i) => (i + 1) * 5).map((min) => (
                                                    <SelectItem key={min} value={min.toString()}>
                                                        {min} minutes
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    

                    <div className="flex items-center gap-3">
                          <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" disabled={aiLoading}>
                                        AI <Sparkles size={12} />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="flex gap-2">
                                            Create Test with AI <Sparkles size={15} />
                                        </DialogTitle>
                                        <DialogDescription>
                                            Save time—AI will generate questions in seconds.
                                        </DialogDescription>
                                    </DialogHeader>

                                    {/* AI Form */}
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="ai-topic">Topic</Label>
                                            <Input
                                                id="ai-topic"
                                                name="ai-topic"
                                                placeholder="e.g. Photosynthesis"
                                                value={aiTopic}
                                                onChange={(e) => dispatch({ type: "SET_AI_TOPIC", payload: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ai-grade-level">Grade Level</Label>
                                            <Input
                                                id="ai-grade-level"
                                                name="ai-grade-level"
                                                placeholder="e.g. 7"
                                                value={aiGradeLevel}
                                                onChange={(e) => dispatch({ type: "SET_AI_GRADE_LEVEL", payload: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ai-difficulty">Difficulty</Label>
                                            <Select
                                                name="ai-difficulty"
                                                value={aiDifficulty}
                                                onValueChange={(value) => dispatch({ type: "SET_AI_DIFFICULTY", payload: value as 'easy' | 'medium' | 'hard' })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="easy">Easy</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="hard">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ai-question-count">Number of Questions</Label>
                                            <Input
                                                id="ai-question-count"
                                                name="ai-question-count"
                                                type="number"
                                                min={1}
                                                max={Math.min(5, maxQuestions - questions.length > 0 ? maxQuestions - questions.length : 1)}
                                                value={aiQuestionCount}
                                                onChange={(e) => {
                                                    let value = Number(e.target.value);
                                                    const maxAllowed = Math.min(5, maxQuestions - questions.length > 0 ? maxQuestions - questions.length : 1);
                                                    if (isNaN(value) || value < 1) value = 1;
                                                    if (value > maxAllowed) value = maxAllowed;
                                                    dispatch({ type: "SET_AI_QUESTION_COUNT", payload: value });
                                                }}
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                Max: {maxQuestions - questions.length > 0 ? maxQuestions - questions.length : 1}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid gap-4">
                                        <Textarea
                                            id="aiprompt"
                                            name="aiprompt"
                                            placeholder="Describe your topic and let AI build a quiz for you."
                                            value={aiAdditionalContext}
                                            onChange={(e) => dispatch({ type: "SET_AI_ADDITIONAL_CONTEXT", payload: e.target.value })}
                                            className="h-30"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button disabled={aiTopic.trim() === "" || aiLoading} onClick={generateAiQues}>{aiLoading ? <>Generating... <Loader2 className="animate-spin h-4 w-4" /></> : "Generate Questions"}</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        {/* Desktop: show buttons normally */}
                        <div className="hidden sm:flex items-center gap-3">
                        
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={questions.length < 1 || saveLoading || publishLoading || aiLoading}
                                onClick={handleSave}
                            >
                                {saveLoading && <Loader2 className="animate-spin h-4 w-4" />}
                                {saveLoading ? "Saving..." : "Save"}
                                <Save />
                            </Button>
                            {status === "PUBLISHED" && <><ShareUrlDialog open={open} onOpenChange={setOpen} url={`${window.location.origin}/attempt/${test.id}`}><Button variant="ghost" disabled={saveLoading || publishLoading || aiLoading}>
                                <Share2 size={8} />
                            </Button></ShareUrlDialog>

                            </>}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild disabled={publishLoading}>
                                    {publishLoading ? <Loader2 className="animate-spin h-6 w-6" /> : <EllipsisVertical size={20} />}

                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {status === "PUBLISHED" ? (
                                        <DropdownMenuItem disabled={cleanedQuestions.length < 3 || publishLoading || saveLoading || aiLoading} onClick={() => handlePublish("UNPUBLISH")}>
                                            {publishLoading && <Loader2 className="animate-spin h-4 w-4" />}
                                            {publishLoading ? "Unpublishing..." : "Unpublish"} <Upload size={8} />
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem disabled={cleanedQuestions.length < 3 || publishLoading || saveLoading || aiLoading} onClick={() => handlePublish("PUBLISH")}>
                                            {publishLoading && <Loader2 className="animate-spin h-4 w-4" />}
                                            {publishLoading ? "Publishing..." : "Publish"} <Upload size={8} />
                                        </DropdownMenuItem>
                                    )}
                                    <Separator />

                                    <DropdownMenuItem onClick={() => router.push("/")} disabled={saveLoading || publishLoading || aiLoading}>
                                        Close  <X className="h-4 w-4" />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>

                        {/* Mobile: collapse into dropdown */}
                        <div className="sm:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Menu />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        disabled={questions.length < 1 || saveLoading || publishLoading || aiLoading}
                                        onClick={handleSave}
                                    >
                                        {saveLoading && <Loader2 className="animate-spin h-4 w-4" />}
                                        {saveLoading ? "Saving..." : "Save"}
                                        <Save />
                                    </DropdownMenuItem>
                                    <Separator />
                                    {status === "PUBLISHED" && <><ShareUrlDialog open={open} onOpenChange={setOpen} url={`${window.location.origin}/attempt/${test.id}`}><Button variant="ghost" disabled={saveLoading || publishLoading || aiLoading}>
                                        Share <Share2 size={8} />
                                    </Button></ShareUrlDialog>
                                        <Separator />
                                    </>}

                                    {status === "PUBLISHED" ? (
                                        <DropdownMenuItem disabled={cleanedQuestions.length < 3 || publishLoading || saveLoading || aiLoading} onClick={() => handlePublish("UNPUBLISH")}>
                                            {publishLoading && <Loader2 className="animate-spin h-4 w-4" />}
                                            {publishLoading ? "Unpublishing..." : "Unpublish"} <Upload size={8} />
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem disabled={cleanedQuestions.length < 3 || publishLoading || saveLoading || aiLoading} onClick={() => handlePublish("PUBLISH")}>
                                            {publishLoading && <Loader2 className="animate-spin h-4 w-4" />}
                                            {publishLoading ? "Publishing..." : "Publish"} <Upload size={8} />
                                        </DropdownMenuItem>
                                    )}
                                    <Separator />

                                    <DropdownMenuItem onClick={() => router.push("/")} disabled={saveLoading || publishLoading || aiLoading}>
                                        Close <X />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            {aiLoading ? <QuestionEditorSkeleton /> :
                <>
                    <main className="flex-1 px-6 py-8">
                        <div className="max-w-4xl mx-auto relative">
                            {/* === Side Arrows (md+ only) === */}
                            <div className="hidden lg:block">
                                {/* Left Arrow */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => dispatch({ type: "GO_TO_PREV_QUES" })}
                                    disabled={currentQuestionIndex === 0}
                                    className="absolute left-[-60px] top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-full shadow-md z-10 bg-background border-2 hover:bg-accent disabled:opacity-30"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                {/* Right Arrow */}
                                {currentQuestionIndex === questions.length - 1 && questions.length < maxQuestions ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => dispatch({ type: "ADD_NEW_QUESTION" })}
                                        className="absolute right-[-60px] top-1/2 -translate-y-1/2 h-10 px-4 rounded-full shadow-md z-10 bg-background border-2 hover:bg-accent text-xs"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        New
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => dispatch({ type: "GO_TO_NEXT_QUES" })}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        className="absolute right-[-60px] top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-full shadow-md z-10 bg-background border-2 hover:bg-accent disabled:opacity-30"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            {/* === Bottom Arrows (sm only) === */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2  w-2/3 flex justify-between items-center lg:hidden">
                                {/* Left Arrow */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => dispatch({ type: "GO_TO_PREV_QUES" })}
                                    disabled={currentQuestionIndex === 0}
                                    className="h-10 w-10 p-0 rounded-full shadow-md bg-background border-2 hover:bg-accent disabled:opacity-30"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                {/* Right Arrow or Add */}
                                {currentQuestionIndex === questions.length - 1 && questions.length < maxQuestions ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => dispatch({ type: "ADD_NEW_QUESTION" })}
                                        className="h-10 px-4 rounded-full shadow-md bg-background border-2 hover:bg-accent text-xs"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        New
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => dispatch({ type: "GO_TO_NEXT_QUES" })}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        className="h-10 w-10 p-0 rounded-full shadow-md bg-background border-2 hover:bg-accent disabled:opacity-30"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-8 mb-10 lg:mb-0">
                                    <div className="space-y-6">
                                        {/* Question Number with Navigation */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    Question {currentQuestionIndex + 1} of {maxQuestions}
                                                </span>
                                            </div>
                                            {questions.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => dispatch({ type: "DEL_QUES" })}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Question Text */}
                                        <div className="space-y-2">
                                            <Label htmlFor="question-text" className="text-sm font-medium">
                                                Question
                                            </Label>
                                            <Textarea
                                                id="question-text"
                                                value={currentQuestion.text || ""}
                                                onChange={(e) => dispatch({ type: "SET_CURR_QUES", payload: { text: e.target.value } })}
                                                placeholder="Enter your question here..."
                                                className="min-h-[100px] resize-none"
                                            />
                                        </div>

                                        {/* Answer Options */}
                                        <div className="space-y-4">
                                            <Label className="text-sm font-medium">Answer Options</Label>
                                            <RadioGroup
                                                value={currentQuestion.correctOptionIndex.toString()}
                                                onValueChange={(value) => dispatch({ type: "SET_CURR_QUES", payload: { correctOptionIndex: Number.parseInt(value) } })}
                                                className="space-y-3"
                                            >
                                                {currentQuestion.options.map((option, index) => (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                                        <div className="flex-1">
                                                            <Input
                                                                value={option.text}
                                                                onChange={(e) => dispatch({ type: "SET_CURR_QUES_OPTION", payload: { optionIndex: index, text: e.target.value } })}
                                                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                                                className="border-input"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            <p className="text-xs text-muted-foreground">
                                                Select the correct answer by clicking the radio button
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>

                    <footer className="border-t border-border px-6 py-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {questions.map((question, index) => (
                                    <Button
                                        key={index}
                                        variant={index === currentQuestionIndex ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => dispatch({ type: "NAVIGATE_QUES", payload: index })}
                                        className="min-w-[40px] h-8 text-xs"
                                    >
                                        {index + 1}
                                    </Button>
                                ))}

                                {questions.length < maxQuestions && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => dispatch({ type: "ADD_NEW_QUESTION" })}
                                        className="min-w-[40px] h-8 border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            <div className="mt-2 text-xs text-muted-foreground">
                                {questions.length} of {maxQuestions} questions
                            </div>
                        </div>
                    </footer>
                </>
            }
        </div>
    )
}
