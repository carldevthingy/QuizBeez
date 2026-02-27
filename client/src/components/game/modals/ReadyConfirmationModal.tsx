import type { QuizSet } from "@/config/gameConfig";

interface ReadyConfirmationModalProps {
  selectedQuiz: QuizSet;
  customTimer: number;
  setCustomTimer: React.Dispatch<React.SetStateAction<number>>;
  onStart: () => void;
  onChangeQuiz: () => void;
}
export const ReadyConfirmationModal = ({
  selectedQuiz,
  customTimer,
  setCustomTimer,
  onStart,
  onChangeQuiz,
}: ReadyConfirmationModalProps) => (
  <div className="bg-white p-8 rounded-xl border-4 border-green-400 shadow-2xl text-center animate-bounce-in w-100">
    <h2 className="text-xl font-bold text-gray-500 mb-1">SELECTED:</h2>
    <h3 className="text-2xl font-black mb-6 text-gray-800 uppercase leading-none">
      {selectedQuiz.title}
    </h3>
    <div className="bg-gray-100 p-4 rounded-lg mb-6 border-2 border-gray-200">
      <label className="block text-gray-600 font-bold text-sm mb-2 uppercase tracking-wider">
        Seconds per Question
      </label>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setCustomTimer(Math.max(3, customTimer - 1))}
          className="w-10 h-10 bg-gray-300 rounded-full font-bold text-xl hover:bg-gray-400 transition"
        >
          -
        </button>
        <input
          type="number"
          min="3"
          max="20"
          value={customTimer}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) setCustomTimer(Math.min(20, Math.max(3, val)));
          }}
          className="w-20 text-center font-mono text-3xl font-bold bg-white border-2 border-gray-300 rounded-md p-1 focus:border-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => setCustomTimer(Math.min(20, customTimer + 1))}
          className="w-10 h-10 bg-gray-300 rounded-full font-bold text-xl hover:bg-gray-400 transition"
        >
          +
        </button>
      </div>
    </div>
    <button
      onClick={onStart}
      className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold text-xl border-b-4 border-yellow-600 hover:brightness-110 active:border-b-0 active:translate-y-1 w-full"
    >
      START GAME
    </button>
    <button
      onClick={onChangeQuiz}
      className="block mt-4 text-gray-500 font-bold hover:underline mx-auto"
    >
      Change Quiz
    </button>
  </div>
);
