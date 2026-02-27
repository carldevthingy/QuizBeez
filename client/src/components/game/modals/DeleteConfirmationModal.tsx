interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmationModal = ({
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationModalProps) => (
  <div className="bg-white p-8 rounded-xl border-4 border-red-500 shadow-2xl text-center w-100 flex flex-col">
    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-3xl">⚠️</span>
    </div>
    <h2 className="text-2xl font-bold mb-2 text-gray-800">DELETE THIS HIVE?</h2>
    <p className="text-gray-600 font-medium mb-8">
      Are you sure you want to delete this custom quiz? This action cannot be
      undone.
    </p>

    <div className="flex gap-4 shrink-0">
      <button
        onClick={onConfirm}
        disabled={isDeleting}
        className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 hover:shadow-md transition-all text-sm disabled:opacity-50 disabled:cursor-wait"
      >
        {isDeleting ? "DELETING..." : "YES, DELETE"}
      </button>
      <button
        onClick={onCancel}
        disabled={isDeleting}
        className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 hover:shadow-md transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        CANCEL
      </button>
    </div>
  </div>
);
