"use client"

import ActiveTestScreen from "@/components/ActiveTestScreen";
import { TestStartInterface } from "@/components/TestStartScreen";
import { OptionType, QuestionType } from "@/lib/utils";
import { useReducer, useEffect, useCallback, useRef } from "react";

type TestState = {
  status: 'none' | 'ready' | 'active' | 'error' | 'finished';
  index: number;
  questions: QuestionType[];
  selectedAnswers: Map<string, OptionType>; // Changed to Map for better performance
  score: number;
  secondsRemaining: number | null;
};

export type Action =
  | { type: 'creatingQuiz' }
  | { type: 'dataReceived' }
  | { type: 'error' }
  | { type: 'startQuiz' }
  | { type: 'endQuiz' }
  | { type: 'resetQuiz', payload?: { timeLimit?: number | null } } // Single action for all resets
  | { type: 'nextQues' }
  | { type: 'prevQues' }
  | { type: 'selectQues'; payload: number }
  | { type: 'answerQuestion'; payload: { questionIndex: number; selectedOptionIndex: number } }
  | { type: 'tick' };

function reducer(state: TestState, action: Action): TestState {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        status: 'ready',
      };

    case 'error':
      return { ...state, status: 'error' };

    case 'startQuiz':
      return {
        ...state,
        status: 'active',
      };

    case 'resetQuiz':
      // Reset to initial state - works for both manual resets and security violations
      return {
        questions: state.questions,
        status: 'ready',
        index: 0,
        selectedAnswers: new Map(),
        score: 0,
        secondsRemaining: action.payload?.timeLimit || null,
      };

    case 'endQuiz':
      return { ...state, status: 'finished' };

    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining !== null ? state.secondsRemaining - 1 : null,
        status: state.secondsRemaining === 1 ? 'finished' : state.status, // Changed from 0 to 1
      };

    case 'nextQues':
      return {
        ...state,
        index: state.index < state.questions.length - 1 ? state.index + 1 : state.index,
      };

    case 'prevQues':
      return {
        ...state,
        index: state.index > 0 ? state.index - 1 : state.index,
      };

    case 'selectQues':
      return {
        ...state,
        index: Math.max(0, Math.min(action.payload, state.questions.length - 1)),
      };

    case 'answerQuestion': {
      const { questionIndex, selectedOptionIndex } = action.payload;

      // Validate indices
      if (questionIndex < 0 || questionIndex >= state.questions.length) {
        return state;
      }

      const currentQuestion = state.questions[questionIndex];
      if (selectedOptionIndex < 0 || selectedOptionIndex >= currentQuestion.options.length) {
        return state;
      }

      const selectedOption = currentQuestion.options[selectedOptionIndex];

      // Create new Map with updated answer
      const updatedAnswers = new Map(state.selectedAnswers);
      updatedAnswers.set(currentQuestion.id, {
        ...selectedOption,
        questionId: currentQuestion.id,
        optionIndex: selectedOptionIndex
      });

      // Calculate score: count correct answers
      let newScore = 0;
      updatedAnswers.forEach((answer, questionId) => {
        const question = state.questions.find(q => q.id === questionId);
        if (question && answer.isCorrect) {
          newScore++;
        }
      });

      return {
        ...state,
        selectedAnswers: updatedAnswers,
        score: newScore,
      };
    }

    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
}

export default function TestPage({
  test,
  teacherName
}: {
  test: any;
  teacherName: string | null | undefined;
}) {
  const initialState: TestState = {
    questions: test.questions,
    status: "ready",
    index: 0,
    selectedAnswers: new Map(),
    score: 0,
    secondsRemaining: test.timeLimit ? test.timeLimit * 60 : null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, score, selectedAnswers, secondsRemaining } = state;

  const initialTimeLimit = test.timeLimit ? test.timeLimit * 60 : null;

  // Refs to track focus state
  const isTabFocusedRef = useRef(true);
  const hasLeftTabRef = useRef(false);

  // Tab switching and focus detection
  const handleVisibilityChange = useCallback(() => {
    if (status !== 'active') return;

    if (document.hidden) {
      // User switched away from tab
      isTabFocusedRef.current = false;
      hasLeftTabRef.current = true;
      console.log('Tab switched away - Test will be reset');
      dispatch({ type: 'resetQuiz', payload: { timeLimit: initialTimeLimit } });
    } else {
      // User returned to tab
      isTabFocusedRef.current = true;
    }
  }, [status]);

  const handleWindowFocus = useCallback(() => {
    if (status !== 'active') return;

    if (hasLeftTabRef.current) {
      // User returned after leaving - reset test
      console.log('Window focus returned after leaving - Test reset');
      dispatch({ type: 'resetQuiz', payload: { timeLimit: initialTimeLimit } });
    }
    isTabFocusedRef.current = true;
  }, [status]);

  const handleWindowBlur = useCallback(() => {
    if (status !== 'active') return;

    isTabFocusedRef.current = false;
    hasLeftTabRef.current = true;
    console.log('Window lost focus - Test will be reset');
    dispatch({ type: 'resetQuiz', payload: { timeLimit: initialTimeLimit } });
  }, [status]);

  // Prevent common cheating methods
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'active') return;

    // Prevent F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C, etc.
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'u') ||
      (e.ctrlKey && e.key === 's') ||
      (e.key === 'F5') ||
      (e.ctrlKey && e.key === 'r')
    ) {
      e.preventDefault();
      dispatch({ type: 'resetQuiz', payload: { timeLimit: initialTimeLimit } });
    }
  }, [status]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (status === 'active') {
      e.preventDefault();
    }
  }, [status]);

  // Set up event listeners
  useEffect(() => {
    if (status === 'active') {
      // Reset tracking when test becomes active
      hasLeftTabRef.current = false;
      isTabFocusedRef.current = true;

      // Add event listeners for tab switching detection
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleWindowFocus);
      window.addEventListener('blur', handleWindowBlur);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('contextmenu', handleContextMenu);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('blur', handleWindowBlur);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [status, handleVisibilityChange, handleWindowFocus, handleWindowBlur, handleKeyDown, handleContextMenu]);

  // Timer effect
  useEffect(() => {
    if (status !== 'active' || secondsRemaining === null) return;

    const timer = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, secondsRemaining]);

  // Auto-finish when time runs out
  useEffect(() => {
    if (secondsRemaining === 0 && status === 'active') {
      dispatch({ type: 'endQuiz' });
    }
  }, [secondsRemaining, status]);

  console.log('Current score:', score);
  console.log('Selected answers:', Array.from(selectedAnswers.entries()));

  return (
    <>
      {status === "ready" && (
        <TestStartInterface
          testTitle={test.title}
          testDescription={test.description}
          teacherName={teacherName}
          duration={test.timeLimit ? `${test.timeLimit} min` : 'No time limit'}
          questionCount={test.questions.length}
          onStartTest={() => dispatch({ type: 'startQuiz' })}
        />
      )}

      {status === "active" && (
        <div>
          {/* Warning Banner */}
          <div className="bg-red-600 text-white p-3 text-center text-sm font-medium">
            ⚠️ WARNING: Do not switch tabs, minimize window, or leave this page. The test will be reset if you do.
          </div>

          <ActiveTestScreen
            testTitle={test.title}
            questions={questions}
            index={index}
            dispatch={dispatch}
            score={score}
            selectedAnswers={selectedAnswers}
            secondsRemaining={secondsRemaining}
            teacherName={teacherName}
          />
        </div>
      )}

      {status === "finished" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Completed!</h1>
            <p className="text-xl text-gray-600 mb-4">
              Your Score: {score} out of {questions.length}
            </p>
            <p className="text-lg text-gray-500 mb-6">
              {Math.round((score / questions.length) * 100)}% Correct
            </p>
            <div className="text-sm text-gray-400">
              Answered: {selectedAnswers.size} of {questions.length} questions
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-red-50 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-900 mb-4">Test Reset</h1>
            <p className="text-red-700 mb-4">
              The test has been reset because you switched tabs or left the page.
            </p>
            <button
              onClick={() => dispatch({ type: 'resetQuiz' })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Start New Attempt
            </button>
          </div>
        </div>
      )}
    </>
  );
}