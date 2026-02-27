interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onExit: () => void;
}


export const GameOverScreen = ({
  score,
  onRestart,
  onExit,
}: GameOverScreenProps) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 animate-[fadeIn_0.4s_ease-out_forwards] opacity-0">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-yellow-400 mb-4 drop-shadow-md">
        GAME OVER
      </h1>
      <p className="text-white text-3xl mb-8 font-mono">Final Score: {score}</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRestart}
          className="bg-white text-black px-8 py-3 rounded-full font-bold text-xl border-b-4 border-gray-400 hover:bg-yellow-400 hover:border-yellow-600 transition-all active:border-b-0 active:translate-y-1"
        >
          PLAY AGAIN
        </button>
        <button
          onClick={onExit}
          className="bg-red-500 text-white px-8 py-3 rounded-full font-bold text-xl border-b-4 border-red-700 hover:brightness-110 transition-all active:border-b-0 active:translate-y-1"
        >
          EXIT TO MENU
        </button>
      </div>
    </div>
  </div>
);