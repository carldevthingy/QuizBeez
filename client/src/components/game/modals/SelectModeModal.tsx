import type { GameType } from "@/config/gameConfig";

interface SelectModeModalProps {
  isLoggedIn: boolean;
  selectedGameType: GameType | null;
  onSelectMode: (mode: GameType) => void;
  onClose: () => void;
}

export const SelectModeModal = ({
  isLoggedIn,
  selectedGameType,
  onSelectMode,
  onClose,
}: SelectModeModalProps) => (
  <div className="bg-white p-8 rounded-xl border-4 border-yellow-400 shadow-2xl text-center">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">SELECT GAME MODE</h2>
    <div className="flex gap-4">
      <div
        onClick={() => onSelectMode("preset")}
        className={`w-40 h-52 bg-yellow-100 border-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-300 transition-all hover:scale-105 ${selectedGameType === "preset" ? "border-blue-500 ring-4 ring-blue-300" : "border-yellow-500"}`}
      >
        <h3 className="font-bold text-gray-700 text-xl">
          Preset
          <br />
          Quizzes
        </h3>
      </div>
      <div
        onClick={() => {
          if (isLoggedIn) onSelectMode("custom");
        }}
        className={`w-40 h-52 border-4 rounded-lg flex flex-col items-center justify-center transition-all ${isLoggedIn ? "bg-purple-100 cursor-pointer hover:bg-purple-300 hover:scale-105 border-purple-500" : "bg-gray-100 cursor-not-allowed border-gray-300 opacity-70 grayscale"}`}
      >
        <h3
          className={`font-bold text-xl ${isLoggedIn ? "text-gray-800" : "text-gray-500"}`}
        >
          Custom Quiz <br />
          <span className="text-[12px] font-normal">Create your own!</span>
        </h3>
        {!isLoggedIn && (
          <span className="text-xs font-bold text-red-500 mt-3 px-2 leading-tight">
            (Must be logged in)
          </span>
        )}
      </div>

      <div
        className={`w-40 h-52 border-4 rounded-lg flex flex-col items-center justify-center transition-all bg-gray-100 cursor-not-allowed border-gray-300 opacity-70 grayscale`}
      >
        <h3 className={`font-bold text-xl text-gray-500`}>Multiplayer</h3>
        <span className="text-xs font-bold text-red-500 mt-3 px-2 leading-tight">
          (Work in Progress)
        </span>
      </div>
    </div>

    <button
      onClick={onClose}
      className="mt-6 text-red-500 font-bold hover:underline"
    >
      CLOSE
    </button>
  </div>
);
