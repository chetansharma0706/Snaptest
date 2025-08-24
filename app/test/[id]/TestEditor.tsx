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
    aiPrompt: string
    aiLoading: boolean
    publishLoading: boolean

}

type Actions =
    | { type: "SET_TITLE"; payload: string }
    | { type: "SET_DESCRIPTION"; payload: string }
    | { type: "SET_AI_PROMPT"; payload: string }
    | { type: "SET_TIME_LIMIT"; payload: number }
    | { type: "SET_STATUS"; payload: status }
    | { type: "SET_SAVE_LOADING"; payload: boolean }
    | { type: "SET_PUB_LOADING"; payload: boolean }
    | { type: "SET_AI_LOADING"; payload: boolean }
    | { type: "SET_CURRENT_QUES_INDEX", payload: number }
    | { type: "SET_CURR_QUES"; payload: Partial<Question> }
    | { type: "SET_CURR_QUES_OPTION"; payload: { optionIndex: number; text: string } }
    | { type: "ADD_NEW_QUESTION" }
    | { type: "NAVIGATE_QUES"; payload: number }
    | { type: "GO_TO_NEXT_QUES" }
    | { type: "GO_TO_PREV_QUES" }
    | { type: "DEL_QUES" }

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
        case "SET_AI_PROMPT":
            return { ...state, aiPrompt: actions.payload }
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
        case "SET_CURRENT_QUES_INDEX":
            return { ...state, currentQuestionIndex: actions.payload }
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
        aiPrompt: "",
        aiLoading: false,
        publishLoading: false
    }


    const [state, dispatch] = useReducer(reducer, intialState)
    const { title, description, questions, saveLoading, publishLoading, currentQuestionIndex, timeLimit, status, aiPrompt, aiLoading } = state

    console.log(test)

    const currentQuestion = questions[currentQuestionIndex]

    function cleanQuestions(questions: any[]) {
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
                if(type === "PUBLISH"){
                alert("Test Published Successfully!")}else{
                    alert("Test Unpublished Successfully!")
                }
            } else {
                console.log("Something went wrong")
            }

        } catch (error) {
            console.error("Something went wrong", error)
        } finally {
            dispatch({ type: "SET_PUB_LOADING", payload: false })
            if(type === "PUBLISH") return setOpen(true)

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
                        {/* Desktop: show buttons normally */}
                        <div className="hidden sm:flex items-center gap-3">
                            <Button onClick={() => dispatch({ type: "SET_AI_LOADING", payload: !aiLoading })}>
                                Start AI
                            </Button>

                            <Dialog>
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
                                    <div className="grid gap-4">
                                        <Textarea
                                            id="aiprompt"
                                            name="aiprompt"
                                            placeholder="Describe your topic and let AI build a quiz for you."
                                            value={aiPrompt}
                                            onChange={(e) => dispatch({ type: "SET_AI_PROMPT", payload: e.target.value })}
                                            className="h-30"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>

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
                                    {publishLoading ? <Loader2 className="animate-spin h-6 w-6" /> :<EllipsisVertical size={20}/>}

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
                                    <DropdownMenuItem onClick={() => dispatch({ type: "SET_AI_LOADING", payload: !aiLoading })}>
                                        Start AI
                                    </DropdownMenuItem>
                                    <Separator />
                                    <DropdownMenuItem>
                                        <Dialog>
                                            <DialogTrigger className='flex items-center gap-2'>
                                                AI <Sparkles size={5} />
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
                                                <div className="grid gap-4">
                                                    <Textarea
                                                        id="aiprompt"
                                                        name="aiprompt"
                                                        placeholder="Describe your topic and let AI build a quiz for you."
                                                        value={aiPrompt}
                                                        onChange={(e) => dispatch({ type: "SET_AI_PROMPT", payload: e.target.value })}
                                                        className="h-30"
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </DropdownMenuItem>
                                    <Separator />

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
                            {/* Left Navigation Arrow */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatch({ type: "GO_TO_PREV_QUES" })}
                                disabled={currentQuestionIndex === 0}
                                className="absolute left-[150px] md:left-[-60px] bottom-[20px] md:top-1/2 md:-translate-y-1/2  h-10 w-10 p-0 rounded-full shadow-md z-10 bg-background border-2 hover:bg-accent disabled:opacity-30"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>

                            {/* Right Navigation Arrow */}
                            {currentQuestionIndex === questions.length - 1 && questions.length < maxQuestions ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => dispatch({ type: "ADD_NEW_QUESTION" })}
                                    className="absolute right-[150px] sm:right-[-20px] md:right-[-60px] bottom-[20px] md:top-1/2 md:-translate-y-1/2 h-10 px-4 rounded-full shadow-md z-10 bg-background border-2 hover:bg-accent text-xs"
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
                                    className="absolute right-[150px] sm:right-[-20px] md:right-[-60px] bottom-[20px] md:top-1/2 md:-translate-y-1/2 h-10 w-10 p-0 rounded-full shadow-md z-10 bg-background border-2 hover:bg-accent disabled:opacity-30"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            )}

                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-8 mb-10 md:mb-0">
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
