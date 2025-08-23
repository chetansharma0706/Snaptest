const QuizHeader = ({
  totalQuestions,
  index,
}: {
  totalQuestions: number;
  index: number;
}) => {
  const progress = Math.round(((index + 1) / totalQuestions) * 100); // to show percentage
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">React Quiz</h2>
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-900 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 font-medium">{progress}%</span>
      </div>
    </div>
  );
};

export default QuizHeader;
