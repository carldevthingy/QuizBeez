import { type Question,  PlayArea } from "@/config/gameConfig";

const getQuestionSize = (text: string) => {
  if (text.length > 80) return "text-sm";
  if (text.length > 50) return "text-base";
  return "text-xl";
};

const getChoiceSize = (text: string) => {
  if (text.length > 40) return "text-xs leading-tight";
  if (text.length > 20) return "text-sm leading-tight";
  return "text-lg leading-tight";
};

const getZoneColorClass = (id: string) => {
  switch (id) {
    case "A":
      return "bg-[#F6E6B8] border-[#E0B84F]";
    case "B":
      return "bg-[#FECB56] border-[#D6A441]";
    case "C":
      return "bg-[#CFE6A8] border-[#8FAE5A]";
    case "D":
      return "bg-[#E7C2A8] border-[#C08A63]";
    default:
      return "bg-gray-100";
  }
};

const fmtTime = (s: number) => s.toString().padStart(2, "0");


export const GameOverlay = ({
  question,
  score,
  timer,
  uiCurrentZone,
}: {
  question: Question;
  score: number;
  timer: number;
  uiCurrentZone: string | null;
}) => (
  <>
    <div
      className="absolute top-0 left-0 bottom-0 bg-[#E8A87C] border-r-4 border-black p-6 flex flex-col z-10"
      style={{ width: `${PlayArea.leftPanelPct * 101}%` }}
    >
      <div className="bg-[#D35400] text-white p-5 rounded-lg border-b-8 border-[#A04000] shadow-lg mb-4 relative shrink-0">
        <div className="absolute -top-6 left-4 w-1 h-8 bg-black"></div>
        <div className="absolute -top-6 right-4 w-1 h-8 bg-black"></div>
        <h2
          className={`${getQuestionSize(question.text)} font-bold text-center leading-snug text-balance`}
        >
          {question.text}
        </h2>
      </div>
      <div className="text-center font-bold mb-2 text-[#6E2C00] opacity-80 animate-pulse shrink-0">
        STAND IN A ZONE
      </div>
      <div className="space-y-4 flex-1">
        {question.choices.map((c) => (
          <div
            key={c.label}
            className={`p-2 rounded-xl border-black/10 border-l-7 shadow-sm flex items-center transition-all duration-200 ${getZoneColorClass(c.label)} ${uiCurrentZone === c.label ? "scale-105 ring-4 ring-white brightness-110" : "opacity-90"}`}
          >
            <div className="w-10 h-10 rounded-full bg-black/20 text-black flex items-center justify-center font-bold mr-3 text-xl">
              {c.label}
            </div>
            <span
              className={`text-black font-bold wrap-break-word w-full ${getChoiceSize(c.text)}`}
            >
              {c.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-white/20 p-2 rounded text-[#6E2C00] font-bold text-center shrink-0">
        SCORE: {score}
      </div>
    </div>
    <div
      className={`absolute top-4 right-4 border-4 border-black opacity-80 rounded-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 ${timer <= 3 ? "bg-red-500" : "bg-white"}`}
    >
      <span
        className={`font-mono text-3xl font-bold tracking-widest ${timer <= 3 ? "text-white" : "text-gray-800"}`}
      >
        00:{fmtTime(timer)}
      </span>
    </div>
  </>
);
