export interface OptionsModalProps {
  musicEnabled: boolean;
  setMusicEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  sfxEnabled: boolean;
  setSfxEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}
export const OptionsModal = ({
  musicEnabled,
  setMusicEnabled,
  sfxEnabled,
  setSfxEnabled,
  onClose,
}: OptionsModalProps) => (
  <div className="bg-white p-8 rounded-xl border-4 border-teal-500 shadow-2xl w-96 text-center">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">OPTIONS</h2>
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-4">
      <span className="text-xl font-bold text-gray-700">Music</span>
      <input
        type="checkbox"
        checked={musicEnabled}
        onChange={(e) => setMusicEnabled(e.target.checked)}
        className="w-6 h-6 accent-teal-500 cursor-pointer"
      />
    </div>
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-6">
      <span className="text-xl font-bold text-gray-700">SFX</span>
      <input
        type="checkbox"
        checked={sfxEnabled}
        onChange={(e) => setSfxEnabled(e.target.checked)}
        className="w-6 h-6 accent-teal-500 cursor-pointer"
      />
    </div>
    <button
      onClick={onClose}
      className="bg-teal-500 text-white px-6 py-2 rounded-lg font-bold border-b-4 border-teal-700 hover:brightness-110 active:border-b-0 active:translate-y-1"
    >
      CLOSE
    </button>
  </div>
);
