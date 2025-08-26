"use client"

import ActiveTestScreen from "@/components/ActiveTestScreen";
import { TestStartInterface } from "@/components/TestStartScreen";
import { OptionType, QuestionType } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useReducer, useEffect, useCallback, useRef, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
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
  | { type: 'resetQuiz'} // Single action for all resets
  | { type: 'nextQues' }
  | { type: 'prevQues' }
  | { type: 'selectQues'; payload: number }
  | { type: 'answerQuestion'; payload: { questionIndex: number; selectedOptionIndex: number } }
  | { type: 'tick' }

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
        ...state,
        questions: state.questions,
        status: 'ready',
        index: 0,
        selectedAnswers: new Map(),
        score: 0,
      };

    case 'endQuiz': {
      
      return { ...state, status: 'finished' };
    }

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
  const [loading, setLoading] = useState(false);
  const initialState: TestState = {
    questions: test.questions,
    status: "ready",
    index: 0,
    selectedAnswers: new Map(),
    score: 0,
    secondsRemaining: test.timeLimit ? test.timeLimit * 60 : null,
  };

  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, score, selectedAnswers, secondsRemaining } = state;

  const initialTimeLimit = test.timeLimit ? test.timeLimit * 60 : null;

const handleAttempt = async () => {
  if (!window.confirm("Are you sure you want to submit the test?")) return;

  try {
    setLoading(true);
    dispatch({ type: 'endQuiz' });

    // Step 1: Create attempt
    const response = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId: test.id, userId })
    });

    if (!response.ok) {
      console.error('Failed to record attempt');
      dispatch({type:"error"})
      return;
    }

    const attempt = await response.json();

    // Step 2: Save answers
    const secondRes = await fetch(`/api/attempts/${attempt.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: test.id,
        userId,
        answers: Array.from(selectedAnswers.entries()).map(([questionId, option]) => ({
          attemptId: attempt.id,
          questionId,
          optionId: option.id,
        })),
        score,
      })
    });

    if (!secondRes.ok) {
      console.error('Failed to record answers');
      dispatch({type:"error"})
      return;
    }

    console.log('Answers recorded successfully');
    router.push(`/attempt/thanks/${attempt.id}`);
    
  } catch (error) {
    console.error('Error occurred while recording attempt:', error);
  } finally {
    setLoading(false);
  }
};

const handleAttemptbyTimeOver = async () => {

  try {

    // Step 1: Create attempt
    const response = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId: test.id, userId })
    });

    if (!response.ok) {
      console.error('Failed to record attempt');
      dispatch({type:"error"})
      return;
    }

    const attempt = await response.json();

    // Step 2: Save answers
    const secondRes = await fetch(`/api/attempts/${attempt.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: test.id,
        userId,
        answers: Array.from(selectedAnswers.entries()).map(([questionId, option]) => ({
          attemptId: attempt.id,
          questionId,
          optionId: option.id,
        })),
        score,
      })
    });

    if (!secondRes.ok) {
      console.error('Failed to record answers');
      dispatch({type:"error"})
      return;
    }

    console.log('Answers recorded successfully');
    router.push(`/attempt/thanks/${attempt.id}`);
    
  } catch (error) {
    console.error('Error occurred while recording attempt:', error);
  } finally {
    setLoading(false);
  }
};

  // Refs to track focus state and timers
  const isTabFocusedRef = useRef(true);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to clear the reset timer
  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
      // console.log('Reset timer cleared - user returned within 5 seconds');
    }
  }, []);

  // Function to start the reset timer
  const startResetTimer = useCallback(() => {
    if (status !== 'active') return;
    
    // Clear any existing timer first
    clearResetTimer();
    
    console.log('Starting 5-second reset timer...');
    resetTimerRef.current = setTimeout(() => {
      // console.log('5 seconds elapsed - Resetting test');
      dispatch({ type: 'resetQuiz' });
      resetTimerRef.current = null;
    }, 5000); // 5 seconds
  }, [status, clearResetTimer, initialTimeLimit]);

  // Tab switching and focus detection
  const handleVisibilityChange = useCallback(() => {
    if (status !== 'active') return;

    if (document.hidden) {
      // User switched away from tab
      isTabFocusedRef.current = false;
      // console.log('Tab switched away - Starting 5-second timer');
      startResetTimer();
    } else {
      // User returned to tab
      isTabFocusedRef.current = true;
      // console.log('Tab is now visible - Clearing timer');
      clearResetTimer();
    }
  }, [status, startResetTimer, clearResetTimer]);

  const handleWindowFocus = useCallback(() => {
    if (status !== 'active') return;

    isTabFocusedRef.current = true;
    // console.log('Window gained focus - Clearing timer');
    clearResetTimer();
  }, [status, clearResetTimer]);

  const handleWindowBlur = useCallback(() => {
    if (status !== 'active') return;

    isTabFocusedRef.current = false;
    console.log('Window lost focus - Starting 5-second timer');
    startResetTimer();
  }, [status, startResetTimer]);

  // Prevent common cheating methods
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'active' && status !== 'ready') return;
    // console.log('Key down detected:', e.key);
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
      dispatch({ type: 'resetQuiz' });
    }
  }, [status]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    // console.log('Context menu (right-click) detected');
    // Disable right-click context menu
    if (status === 'active' || status === 'ready') {
      e.preventDefault();
    }
  }, [status]);

  // Set up event listeners
  useEffect(() => {
    if (status === 'active') {
      // Reset tracking when test becomes active
      isTabFocusedRef.current = true;
      clearResetTimer(); // Clear any existing timers

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

        // Clear timer when component unmounts or status changes
        clearResetTimer();
      }
    } else {
      // For non-active statuses, only add/remove keydown and contextmenu listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('contextmenu', handleContextMenu);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('contextmenu', handleContextMenu);
        clearResetTimer();
      };
    }
  }, [status, handleVisibilityChange, handleWindowFocus, handleWindowBlur, handleKeyDown, handleContextMenu, clearResetTimer]);

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
      // End the quiz and submit answers when time is up
      dispatch({ type: 'endQuiz' });
      handleAttemptbyTimeOver();
    }
  }, [secondsRemaining, status]);

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
            ⚠️ WARNING: Do not switch tabs, minimize window, or leave this page for more than 5 seconds. The test will be reset if you do.
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
            handleAttempt={handleAttempt}
            loadingSubmit={loading}
          />
        </div>
      )}

      {status === "finished" && <LoadingScreen message="Test finished. Submitting your answers..." />}

      {status === "error" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-red-50 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-900 mb-4">Something went wrong</h1>
            <p className="text-red-700 mb-4">
              There was an error processing your request. Please attempt to submit your answers again.
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