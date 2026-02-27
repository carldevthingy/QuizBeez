export const ExitModal = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-white p-8 rounded-xl border-4 border-red-500 shadow-2xl text-center w-96">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Leave the Hive?</h2>
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => alert("Exited!")}
        className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold border-b-4 border-red-700 hover:brightness-110 active:border-b-0 active:translate-y-1"
      >
        YES
      </button>
      <button
        onClick={onClose}
        className="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold border-b-4 border-gray-600 hover:brightness-110 active:border-b-0 active:translate-y-1"
      >
        NO
      </button>
    </div>
  </div>
);
