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
import { Button } from "./ui/button"
import { Loader2, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dispatch, SetStateAction } from "react"

import { FormEvent } from "react"

export default function DialogModal({
    open,
    setOpen,
    loading,
    handleSubmit,
    title,
    description
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
    title:string
    description:string
}) {
    return (
         <Dialog open={open} onOpenChange={setOpen}>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                        </DialogHeader>

                        <form className="grid gap-4" onSubmit={handleSubmit}>
                            {/* Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Enter test title"
                                    defaultValue="Untitled"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Write test instructions or notes for your students"
                                    required
                                />
                            </div>


                            {/* Time Limit Dropdown */}
                            <div className="grid gap-2">
                                <Label htmlFor="timelimit">Time Limit</Label>
                                <Select name="timeLimit">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time limit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => (i + 1) * 5).map((min) => (
                                            <SelectItem key={min} value={min.toString()}>
                                                {min} minutes
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus />}
                                    {loading ? "Creating..." : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
    )
}