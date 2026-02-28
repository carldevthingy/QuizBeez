export const ActionButton = ({ onTap }: {onTap: () => void}) => {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onTap();
      }}
      className="absolute bottom-10 right-10 w-24 h-24 bg-light-yellow border-4 border-dark-yellow rounded-full shadow-2xl active:scale-90 active:bg-yellow-500 transition-all flex items-center justify-center z-50 touch-none select-none group"
    >
      <div className="flex flex-col items-center justify-center">
        <span className="font-black text-black text-lg leading-none">Select</span>
        <span className="text-[10px] font-bold text-black/60 uppercase tracking-tighter">Enter</span>
      </div>

      <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-110 group-active:scale-100 transition-transform" />
    </button>
  );
};