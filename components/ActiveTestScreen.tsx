import Options from './Options';
import QuizHeader from './QuizHeader';
import Timer from './Timer';
import { Button } from './ui/button';
import { Option, Question } from '@prisma/client';

const MainQuizScreen = ({
  dispatch,
  questions,
  index,
  selectedAnswers,
  secondsRemaining,
}: {
  dispatch: any;
  questions: Question[];
  index: number;
  selectedAnswers: Option[];
  secondsRemaining: number;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Quiz Content - Left Side */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Quiz Header */}
          <QuizHeader totalQuestions={questions.length} index={index} />
          {/* Question */}
          <Question question={questions[index]} index={index} />

          {/* Answer Options */}
          <Options
            question={questions[index]}
            index={index}
            dispatch={dispatch}
            selectedAnswer={selectedAnswers[index]?.selectedOption ?? null}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              className="px-8 py-2 bg-transparent"
              onClick={() => dispatch({ type: 'prevQues' })}
              disabled={index === 0}
            >
              Previous
            </Button>
            <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
            <Button
              className="px-8 py-2"
              onClick={() =>
                index === questions.length - 1
                  ? dispatch({ type: 'endQuiz' })
                  : dispatch({ type: 'nextQues' })
              }
            >
              {index === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Right Side */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Score Display */}

          {/* Question Tracker */}
          <div className="space-y-2">
            {questions.map((question) => (
              <div
                key={question.qIndex}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  question.qIndex === index
                    ? 'border border-orange-500 bg-orange-500/10'
                    : ''
                }`}
                onClick={() =>
                  dispatch({
                    type: 'selectQues',
                    payload: question.qIndex,
                  })
                }
              >
                <span className="font-medium">
                  Question {question.qIndex + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Question Tracker */}
          {/* <div className="space-y-2">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                question.status === 'correct'
                  ? 'bg-green-100 text-green-800'
                  : question.status === 'incorrect'
                  ? 'bg-red-100 text-red-800'
                  : question.status === 'current'
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="font-medium">
                Question {question.id}
              </span>
              {question.status === 'correct' && (
                <Check className="h-5 w-5 text-green-600" />
              )}
              {question.status === 'incorrect' && (
                <X className="h-5 w-5 text-red-600" />
              )}
            </div>
          ))}
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default MainQuizScreen;
