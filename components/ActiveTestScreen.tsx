"use client"

import { Dispatch, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, Award, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { OptionType, QuestionType } from "@/lib/utils"
import { Action } from "@/app/attempt/[id]/TestPage"

interface ActiveTestScreenProps {
  testTitle: string;
  questions: QuestionType[];
  index: number;
  dispatch: Dispatch<Action>;
  score: number;
  selectedAnswers: Map<string, OptionType>;
  secondsRemaining: number | null;
  teacherName: string | null | undefined;
}

export default function ActiveTestScreen({
  testTitle,
  questions,
  index,
  dispatch,
  score,
  selectedAnswers,
  secondsRemaining,
  teacherName
}: ActiveTestScreenProps) {

  const currentQuestion = questions[index];
  const totalQuestions = questions.length;

  // Get current selected answer for this question
  const currentSelectedAnswer = selectedAnswers.get(currentQuestion.id);

  // Calculate progress
  const answeredCount = selectedAnswers.size;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);
  const questionProgressPercentage = Math.round(((index + 1) / totalQuestions) * 100);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    if(optionIndex === selectedAnswers.get(currentQuestion.id)?.optionIndex) {
      selectedAnswers.delete(currentQuestion.id);
    }else{
    dispatch({
      type: "answerQuestion",
      payload: {
        questionIndex: index,
        selectedOptionIndex: optionIndex
      }
    });
  }
  };

  // Navigation handlers
  const handlePrevious = () => {
    dispatch({ type: 'prevQues' });
  };

  const handleNext = () => {
    if (index === totalQuestions - 1) {
      // Last question - submit
      dispatch({ type: 'endQuiz' });
    } else {
      dispatch({ type: 'nextQues' });
    }
  };

  const handleQuestionSelect = (questionIndex: number) => {
    dispatch({ type: 'selectQues', payload: questionIndex });
  };

  // Get question status for styling
  const getQuestionStatus = (questionIndex: number) => {
    const question = questions[questionIndex];
    if (questionIndex === index) return 'current';
    if (selectedAnswers.has(question.id)) return 'answered';
    return 'unanswered';
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Question Navigation */}
        <div className="lg:hidden mb-6">
          <Card className="p-4 shadow-lg border-0 backdrop-blur-sm">
            <h3 className="font-semibold mb-3 text-center text-lg">Test Progress</h3>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-4 min-w-max px-2 pt-2">
                {questions.map((question, idx) => {
                  const status = getQuestionStatus(idx);
                  let btnClass = "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 text-sm font-medium shadow-sm flex-shrink-0 ";

                  if (status === "current") {
                    btnClass += "bg-blue-500 text-white ring-2 ring-blue-300 border-2 border-white shadow-lg scale-110";
                  } else if (status === "answered") {
                    btnClass += "bg-green-500 text-white hover:bg-green-600";
                  } else {
                    btnClass += "bg-gray-300 text-gray-700 hover:bg-gray-400";
                  }

                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionSelect(idx)}
                      className={btnClass}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Quiz Content */}
          <div className="lg:col-span-3">
            <Card className="p-6 md:p-8 shadow-lg border-0 backdrop-blur-sm">
              {/* Quiz Header */}
              <div className="mb-8 rounded-md">
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-3 md:gap-0">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                    {testTitle}
                  </h1>
                  <div className="flex items-center gap-1 md:gap-4 text-sm">
                    {secondsRemaining !== null && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 md:w-5 md:h-5" />
                        <span className='text-red-300 font-semibold text-sm md:text-xl'>
                          {formatTime(secondsRemaining)}
                        </span>
                      </div>
                    )}
                  
                  </div>
                </div>
                <div className="text-xs flex items-center gap-1 mb-2 text-muted-foreground">
                     Created by {teacherName}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted-foreground rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${questionProgressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-sm mt-2 flex items-center gap-1 text-muted-foreground">
                <Award className="w-4 h-4" />
                      {progressPercentage}% Complete
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Question {index + 1}/{totalQuestions}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl leading-relaxed mb-6 font-medium">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-10">
                {currentQuestion.options.map((option, optionIndex) => {
                  const isSelected = currentSelectedAnswer?.optionIndex === optionIndex;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(optionIndex)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md ${isSelected
                          ? "border-blue-500 shadow-md transform scale-[1.02]"
                          : "border-gray-200 hover:border-gray-300 transform hover:scale-[1.01] hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                        >
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="font-medium mr-2 text-gray-400">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <span className="text-sm md:text-base">{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={index === 0}
                  className="px-4 py-2 md:px-6 border-2 text-sm md:text-base disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="hidden md:block text-sm text-gray-400 text-center">
                  {currentSelectedAnswer
                    ? "Answer selected • Click another option to change"
                    : "Select an answer to continue"}
                </div>

                <Button
                  onClick={handleNext}
                  className="px-4 py-2 md:px-6 text-sm md:text-base"
                  variant={index === totalQuestions - 1 ? "default" : "default"}
                >
                  {index === totalQuestions - 1 ? "Submit Test" : "Next"}
                  {index !== totalQuestions - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </Card>
          </div>

          {/* Enhanced Sidebar - Hidden on mobile */}
          <div className="space-y-6 hidden lg:block">
            {/* Score Card */}
            <Card className="p-6 bg-secondary shadow-lg border-0">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">{answeredCount > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}%</div>
                <div className="text-xl text-muted-foreground mb-2">Completed</div>
                <div className="text-sm text-muted-foreground">{answeredCount} answered out of {totalQuestions} Questions</div>
              </div>
            </Card>

            {/* Question Progress */}
            <Card className="p-5 shadow-lg border-0">
              <h3 className="font-semibold mb-4 text-xl text-center">
                Question Progress
              </h3>
              <div className="space-y-2">
                {questions.map((question, questionIndex) => {
                  const status = getQuestionStatus(questionIndex);

                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionSelect(questionIndex)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-sm ${status === "current"
                          ? "bg-blue-100 border-2 border-blue-300 shadow-sm"
                          : status === "answered"
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-muted-foreground"
                        }`}
                    >
                      {status === "answered" ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : status === "current" ? (
                        <div className="w-6 h-6 bg-blue-500 rounded-full shadow-sm animate-pulse"></div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      )}
                      <span
                        className={`text-sm font-medium ${status === "answered"
                            ? "text-green-700"
                            : status === "current"
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                      >
                        Question {questionIndex + 1}
                      </span>
                      {status === "answered" && (
                        <div className="ml-auto text-xs text-green-600 font-medium">✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}