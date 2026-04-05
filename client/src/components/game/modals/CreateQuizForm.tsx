import type { Question, QuizSet } from "@/config/gameConfig";
import { useState } from "react";

export interface AiGeneratedQuiz {
  title: string;
  description: string;
  questions: Question[];
}

interface CreateQuizProps {
  initialData: QuizSet | null;
  onSave: (q: QuizSet) => void;
  onCancel: () => void;
  onAiGenerate: (text: string) => Promise<AiGeneratedQuiz | "ERROR">;
  isAiLoading: boolean;
  aiError: string | null;
  isLoading: boolean;
}

export const CreateQuizForm = ({
  initialData,
  onSave,
  onAiGenerate,
  onCancel,
  isAiLoading,
  aiError,
  isLoading,
}: CreateQuizProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || [
      {
        id: 1,
        text: "",
        choices: [
          { label: "A", text: "" },
          { label: "B", text: "" },
        ],
        correct: "A",
      },
    ],
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [shakeButton, setShakeButton] = useState(false);

  // --- AI Generator State ---
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiText, setAiText] = useState("");

  const handleFormError = (message: string) => {
    setFormError(message);
    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 800);
    setTimeout(() => {
      setFormError("");
    }, 3000);
  };

  // --- AI Generation Logic (Using gemini API) ---
  const handleAiGenerate = async () => {
    if (!aiText.trim()) {
      handleFormError("Please paste some text for the AI to generate a quiz.");
      return;
    }

    try {
      const data = await onAiGenerate(aiText);

      if (data === "ERROR") {
        handleFormError("Can't generate questions without material");
        return;
      }

      setTitle(data.title);
      setDesc(data.description);
      setQuestions(
        data.questions.map((q, i) => ({
          id: i + 1,
          text: q.text,
          choices: q.choices,
          correct: q.correct,
        })),
      );

      setShowAiPanel(false);
      console.log(aiError);
      // setAiText(aiError ? aiError : "");
    } catch (err) {
      handleFormError(
        err instanceof Error ? err.message : "AI generation failed.",
      );
    }
  };

  // --- Form Handlers ---
  const handleQChange = (idx: number, field: string, val: string) => {
    const newQ = [...questions];
    if (field === "text") newQ[idx].text = val;
    else if (field === "correct") newQ[idx].correct = val;
    setQuestions(newQ);
  };

  const handleChoiceChange = (qIdx: number, cIdx: number, val: string) => {
    const newQ = [...questions];
    newQ[qIdx].choices[cIdx].text = val;
    setQuestions(newQ);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: "",
        choices: [
          { label: "A", text: "" },
          { label: "B", text: "" },
        ],
        correct: "A",
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    const newQ = questions.filter((_, i) => i !== idx);
    const reIndexed = newQ.map((q, i) => ({ ...q, id: i + 1 }));
    setQuestions(reIndexed);
  };

  const addChoice = (qIdx: number) => {
    const newQ = [...questions];
    const currentChoices = newQ[qIdx].choices;
    if (currentChoices.length >= 4) return;
    const nextLabel = String.fromCharCode(65 + currentChoices.length);
    newQ[qIdx].choices.push({ label: nextLabel, text: "" });
    setQuestions(newQ);
  };

  const removeChoice = (qIdx: number) => {
    const newQ = [...questions];
    const currentChoices = newQ[qIdx].choices;
    if (currentChoices.length <= 2) return;

    const removedLabel = currentChoices[currentChoices.length - 1].label;
    newQ[qIdx].choices.pop();
    if (newQ[qIdx].correct === removedLabel) newQ[qIdx].correct = "A";
    setQuestions(newQ);
  };

  const handleSave = () => {
    if (
      !title ||
      questions.some((q) => !q.text || q.choices.some((c) => !c.text))
    ) {
      handleFormError("Please fill in all fields!");
      return;
    }

    const payload = {
      id: initialData ? initialData.id : `custom_${Date.now()}`,
      title,
      description: desc || "Custom Quiz",
      questions,
      isCustom: true,
    };

    onSave(payload);
  };

  return (
    <div className="bg-white p-6 rounded-xl border-4 border-purple-500 shadow-2xl w-175 h-137.5 flex flex-col relative">
      {/* Loading Overlay */}
      {(isLoading || isAiLoading) && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 rounded-xl flex items-center justify-center flex-col gap-2">
          <span className="text-purple-700 font-bold text-2xl animate-pulse drop-shadow-sm">
            {isAiLoading ? "AI is weaving your Hive..." : "Saving Hive..."}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialData ? "EDIT YOUR HIVE" : "CREATE YOUR HIVE"}
        </h2>

        {/* AI Toggle Button */}
        <button
          onClick={() => setShowAiPanel(!showAiPanel)}
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:opacity-90 transition-all text-sm flex items-center gap-2"
        >
          AI GENERATOR
        </button>
      </div>

      {/* AI Panel Expansion */}
      {showAiPanel && (
        <div className="mb-4 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg animate__animated animate__fadeIn">
          <p className="text-xs font-bold text-indigo-800 mb-2 uppercase tracking-wide">
            Generate questions from text, notes, or articles
          </p>
          <textarea
            className="w-full border-2 border-indigo-100 rounded-md p-3 mb-3 text-sm focus:border-indigo-400 outline-none resize-none bg-white custom-scrollbar"
            rows={4}
            placeholder="Paste your source material here..."
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleAiGenerate}
              disabled={!aiText.trim() || isAiLoading}
              className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Generate Quiz
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <input
          className="w-full border-2 border-gray-200 rounded-lg p-3 mb-2 font-bold text-lg text-gray-800 placeholder-gray-400 focus:border-purple-500 outline-none transition-all"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border-2 border-gray-200 rounded-lg p-3 mb-4 text-sm text-gray-700 placeholder-gray-400 focus:border-purple-500 outline-none transition-all"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="p-4 border-2 border-gray-200 rounded-lg mb-4 hover:border-purple-400 hover:bg-purple-50 transition-all relative group bg-white"
          >
            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(qIdx)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 font-bold text-xs bg-white hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                ✕ REMOVE
              </button>
            )}

            <div className="flex items-center gap-4 mb-3">
              <span className="font-bold text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                Question {qIdx + 1}
              </span>
              <select
                className="border-2 border-gray-200 rounded-md text-sm bg-white px-2 py-1 font-bold text-gray-600 focus:border-purple-500 outline-none cursor-pointer transition-colors"
                value={q.correct}
                onChange={(e) => handleQChange(qIdx, "correct", e.target.value)}
              >
                {q.choices.map((c) => (
                  <option key={c.label} value={c.label}>
                    Correct: {c.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              className="w-full border-2 border-gray-200 rounded-md p-2 mb-3 text-sm focus:border-purple-500 outline-none transition-all"
              placeholder="Question Text..."
              value={q.text}
              onChange={(e) => handleQChange(qIdx, "text", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              {q.choices.map((c, cIdx) => (
                <div key={c.label} className="flex items-center">
                  <span className="font-bold text-gray-500 mr-2 text-xs w-4">
                    {c.label}
                  </span>
                  <input
                    className="w-full border-2 border-gray-200 rounded-md p-2 text-xs focus:border-purple-500 outline-none transition-all"
                    placeholder={`Option ${c.label}`}
                    value={c.text}
                    onChange={(e) =>
                      handleChoiceChange(qIdx, cIdx, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 text-xs">
              {q.choices.length < 4 && (
                <button
                  onClick={() => addChoice(qIdx)}
                  className="text-purple-500 hover:text-purple-700 font-bold transition-colors"
                >
                  + Add Option
                </button>
              )}
              {q.choices.length > 2 && (
                <button
                  onClick={() => removeChoice(qIdx)}
                  className="text-red-400 hover:text-red-600 font-bold transition-colors"
                >
                  - Remove Option
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="w-full bg-purple-50 text-purple-600 font-bold py-3 rounded-lg border-2 border-dashed border-purple-300 hover:bg-purple-100 hover:border-purple-400 transition-all"
        >
          + ADD QUESTION
        </button>
      </div>

      {formError && (
        <div className="mt-2 text-red-500 font-bold text-sm text-center animate__animated animate__fadeIn">
          {formError}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex gap-3 mt-2 pt-4 border-t-2 border-gray-100 shrink-0">
        <button
          onClick={handleSave}
          disabled={isLoading || isAiLoading}
          className={`flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 hover:shadow-md transition-all text-sm disabled:opacity-50 disabled:cursor-wait ${shakeButton ? "animate__animated animate__shakeX" : ""}`}
        >
          {"SAVE QUIZ"}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading || isAiLoading}
          className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-300 hover:shadow-md transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};
