import { QUIZ_SETS, type QuizSet } from "@/config/gameConfig";

interface SelectQuizModalProps {
  onSelectQuiz: (quiz: QuizSet) => void;
  onBack: () => void;
}
export const SelectQuizModal = ({
  onSelectQuiz,
  onBack,
}: SelectQuizModalProps) => (
  <div className="bg-white p-6 rounded-xl border-4 border-yellow-400 shadow-2xl text-center w-125 max-h-125 flex flex-col">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">CHOOSE A QUIZ</h2>
    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
      {QUIZ_SETS.map((quiz) => (
        <div
          key={quiz.id}
          onClick={() => onSelectQuiz(quiz)}
          className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-blue-50 cursor-pointer text-left transition-all group"
        >
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-yellow-600">
            {quiz.title}
          </h3>
          <p className="text-sm text-gray-500">{quiz.description}</p>
          <span className="text-xs font-bold text-gray-400 mt-2 block">
            {quiz.questions.length} Questions
          </span>
        </div>
      ))}
    </div>
    <button
      onClick={onBack}
      className="mt-4 text-gray-500 font-bold hover:underline"
    >
      Back
    </button>
  </div>
);
