import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface QuestionType {
    id: string;
    qindex: number;
    text: string;
    options: OptionType[];
    correctOptionIndex: number;
}

export interface OptionType {
    id: string;
    qindex: number;
    optionIndex: number;
    questionId: string;
    text: string;
    isCorrect: boolean;
}