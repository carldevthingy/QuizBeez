import type { OptionsModalProps } from "./OptionsModal";

interface PauseModalProps extends OptionsModalProps {
  onExit: () => void;
}
export const PauseModal = ({
  musicEnabled,
  setMusicEnabled,
  sfxEnabled,
  setSfxEnabled,
  onClose,
  onExit,
}: PauseModalProps) => (
  <div className="bg-white p-8 rounded-xl border-4 border-orange-500 shadow-2xl text-center w-96">
    <h2 className="text-4xl font-black mb-4 text-gray-800 tracking-widest">
      PAUSED
    </h2>
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
        <span className="font-bold text-gray-700">Music</span>
        <input
          type="checkbox"
          checked={musicEnabled}
          onChange={(e) => setMusicEnabled(e.target.checked)}
          className="w-6 h-6 accent-orange-500 cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
        <span className="font-bold text-gray-700">SFX</span>
        <input
          type="checkbox"
          checked={sfxEnabled}
          onChange={(e) => setSfxEnabled(e.target.checked)}
          className="w-6 h-6 accent-orange-500 cursor-pointer"
        />
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <button
        onClick={onClose}
        className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold border-b-4 border-green-700 hover:brightness-110 active:border-b-0 active:translate-y-1"
      >
        RESUME
      </button>
      <button
        onClick={onExit}
        className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold border-b-4 border-red-700 hover:brightness-110 active:border-b-0 active:translate-y-1"
      >
        QUIT TO MENU
      </button>
    </div>
  </div>
);
