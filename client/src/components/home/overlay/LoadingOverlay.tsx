export const LoadingOverlay = () => {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-transparent items-center justify-center">
      <img
        src="/game/loader.png"
        alt="Loading..."
        className="w-lg h-lg landscape:w-30 landscape:h-xs"
      />
      <h1 className="font-title text-5xl landscape:text-sm text-dark-yellow">
        Loading...
      </h1>
    </div>
  );
};
