// import { useState } from 'react';
import { Question } from '@prisma/client';

const Options = ({
  dispatch,
  index,
  question,
  selectedAnswer,
}: {
  dispatch: any;
  index: number;
  question: Question;
  selectedAnswer: number | null;
}) => {
  // const [selectedAnswer, setSelectedAnswer] = useState(null);

  return (
    <div className="space-y-3 mb-8">
      {question.options.map((answer, i) => {
        const isSelected = selectedAnswer === i;

        return (
          <div
            key={i}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => {
              // setSelectedAnswer(i);
              dispatch({
                type: 'answerQuestion',
                payload: {
                  questionIndex: index,
                  selectedOption: i,
                },
              });
            }}
          >
            <p className="text-gray-800">{answer}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Options;
