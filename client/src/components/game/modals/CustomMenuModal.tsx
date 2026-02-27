import type { GameType, QuizSet } from "@/config/gameConfig";

interface CustomMenuModalProps {
  customQuizzes: QuizSet[];
  onSelectMode: (mode: GameType) => void;
  onSelectQuiz: (quiz: QuizSet) => void;
  onEditCustom: (quiz: QuizSet) => void;
  onDeleteCustom: (quizId: string) => void;
}

export const CustomMenuModal = ({
  customQuizzes,
  onSelectMode,
  onSelectQuiz,
  onEditCustom,
  onDeleteCustom,
}: CustomMenuModalProps) => (
  <div className="bg-white p-6 rounded-xl border-4 border-purple-500 shadow-2xl text-center w-125 max-h-150 flex flex-col">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">YOUR CUSTOM HIVES</h2>

    <button
      onClick={() => onSelectMode("custom_new")}
      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold border-b-4 border-purple-700 hover:brightness-110 mb-4 w-full shrink-0 transition-all"
    >
      + CREATE NEW QUIZ
    </button>

    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
      {customQuizzes.length === 0 ? (
        <div className="text-gray-500 italic py-10">
          You haven't created any quizzes yet.
        </div>
      ) : (
        customQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 text-left transition-all group bg-white"
          >
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-500">{quiz.description}</p>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              {quiz.questions.length} Questions
            </p>

            <div className="flex gap-2 font-bold">
              <button
                onClick={() => onSelectQuiz(quiz)}
                className="flex-1 bg-green-500 text-white text-sm py-2 rounded hover:bg-green-600 hover:shadow-md transition-all"
              >
                PLAY
              </button>
              <button
                onClick={() => onEditCustom(quiz)}
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 hover:shadow-md transition-all"
              >
                EDIT
              </button>
              <button
                onClick={() => onDeleteCustom(quiz.id)}
                className="bg-red-400 text-white text-sm px-4 py-2 rounded hover:bg-red-500 hover:shadow-md transition-all"
              >
                DELETE
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    <button
      onClick={() => onSelectMode("selection")}
      className="mt-4 text-gray-500 font-bold hover:underline shrink-0 transition-colors"
    >
      Back
    </button>
  </div>
);
