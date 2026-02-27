export const LoadingOverlay = ({ progress }: { progress: number }) => (
  <div className="absolute inset-0 bg-[#fdf6e3] z-50 flex flex-col items-center justify-center">
    <div className="w-32 h-32 mb-8 animate-bounce">
      <div className="text-6xl text-center"><img src="/game/loader.png" alt="loading" /></div>
    </div>
    <h1 className="text-4xl font-bold text-[#8B4513] mb-4">LOADING HIVE...</h1>
    <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden border-2 border-[#8B4513]">
      <div
        className="h-full bg-yellow-400 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="mt-2 font-mono text-[#8B4513] font-bold">{progress}%</p>
  </div>
);