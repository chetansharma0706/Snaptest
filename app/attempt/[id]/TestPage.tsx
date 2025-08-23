"use client"

import { TestStartInterface } from "@/components/TestStartScreen";
import { Option, Question } from "@prisma/client";
import { useReducer } from "react";

type TestState = {
    status: 'none' | 'ready' | 'active' | 'error' | 'finished';
    index: number;
    questions: Question[];
    selectedAnswers: Option[];
    score: number;
    secondsRemaining: number | null;
};

type Action =
  | { type: 'creatingQuiz' }
  | { type: 'dataReceived' }
  | { type: 'error' }
  | { type: 'startQuiz' }
  | { type: 'endQuiz' }
  | { type: 'nextQues' }
  | { type: 'prevQues' }
  | { type: 'selectQues'; payload: number }
//   | { type: 'answerQuestion'; payload: Answer }
  | { type: 'tick' };

function reducer(state: TestState, action: Action): TestState {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: state.questions,
        status: 'ready',
        secondsRemaining: state.secondsRemaining,
      };

    case 'error':
      return { ...state, status: 'error' };

    case 'startQuiz':
      return {
        ...state,
        questions: state.questions,
        status: 'active',
        secondsRemaining: state.secondsRemaining,
      };
    case 'endQuiz':
      return { ...state, questions: state.questions, status: 'finished' };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining !== null ? state.secondsRemaining - 1 : null,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    case 'nextQues':
      return {
        ...state,
        index:
          state.index < state.questions.length - 1
            ? state.index + 1
            : state.index,
      };

    case 'prevQues':
      return {
        ...state,
        index: state.index > 0 ? state.index - 1 : state.index,
      };

    case 'selectQues':
      return {
        ...state,
        index: action.payload,
      };
    // case 'answerQuestion': {
    //   const { questionIndex, selectedOption } = action.payload;
    //   const currentQuestion = state.questions[questionIndex];

    //   const prevAnswer = state.selectedAnswers.find(
    //     (ans) => ans.questionId === currentQuestion.id
    //   );

    //   let scoreAdjustment = 0;

    //   // If previously answered, remove old score
    //   if (prevAnswer) {
    //     const wasPrevCorrect =
    //       prevAnswer.selectedOption === currentQuestion.correctOption;
    //     if (wasPrevCorrect) scoreAdjustment -= 20;
    //   }

    //   // Add new score if correct
    //   const isNewCorrect = selectedOption === currentQuestion.correctOption;
    //   if (isNewCorrect) scoreAdjustment += 20;

    //   const updatedAnswers = prevAnswer
    //     ? state.selectedAnswers.map((ans) =>
    //         ans.questionIndex === questionIndex
    //           ? { ...ans, selectedOption }
    //           : ans
    //       )
    //     : [...state.selectedAnswers, { questionIndex, selectedOption }];

    //   return {
    //     ...state,
    //     selectedAnswers: updatedAnswers,
    //     score: state.score + scoreAdjustment,
    //   };
    // }

    default:
      throw new Error('Unknown action type');
  }
}


export default function TestPage({ test , teacherName }: { test: any , teacherName: string | null | undefined }) {
    console.log(test)
    const intialState: TestState = {
        questions: test.questions,
        //none , error , ready , active , finished
        status: "ready",
        index: 0,
        selectedAnswers: [],
        score: 0,
        secondsRemaining: test.timeLimit ? test.timeLimit * 60 : null,
    };

    const [state, dispatch] = useReducer(reducer, intialState);
  const { questions, status, index, score, selectedAnswers, secondsRemaining } =
    state;
    return (
        <>
            {status === "ready" && <TestStartInterface testTitle={test.title} testDescription={test.description} teacherName={teacherName} duration={`${test.timeLimit} min`} questionCount={test.questions.length} onStartTest={() => dispatch({ type: 'startQuiz' })} />}
                
        </>
    )
}