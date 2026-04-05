import type { GameAction } from "@/Pages/game/GameReducer";
import type { GameState } from "@/Pages/game/type";
import { type Dispatch, type SetStateAction } from "react";
import * as Modals from "@/components/game/modals";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { QuizSet } from "@/config/gameConfig";
import type { AiGeneratedQuiz } from "./CreateQuizForm";

type ModalRouterProps = {
  state: GameState;
  isLoggedIn: boolean;
  dispatch: React.Dispatch<GameAction>;
  onSelectMode: (mode: string) => void;
  onStartGame: () => void;
  onExitToMenu: () => void;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  setMusicEnabled: Dispatch<SetStateAction<boolean>>;
  setSfxEnabled: Dispatch<SetStateAction<boolean>>;
};

export const ModalRouter = ({
  state,
  isLoggedIn,
  dispatch,
  onSelectMode,
  onStartGame,
  onExitToMenu,
  musicEnabled,
  setMusicEnabled,
  sfxEnabled,
  setSfxEnabled,
}: ModalRouterProps) => {
  const queryClient = useQueryClient();

  const {
    activeModal,
    selectedQuiz,
    selectedGameType,
    customTimer,
    quizToEdit,
    isDeleting,
    quizToDelete,
  } = state;

  const closeModal = () => dispatch({ type: "CLOSE_MODAL" });

  /// FETCH QUIEZZES
  const { data: customQuizzes } = useQuery({
    queryKey: ["customQuizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: isLoggedIn,
  });

  // SAVING QUIEZZES
  const saveMutation = useMutation({
    mutationFn: async (quiz: QuizSet) => {
      const isEditing = !!quiz.id && !String(quiz.id).startsWith("custom_");
      const res = await fetch(
        isEditing ? `/api/quizzes/${quiz.id}` : "/api/quizzes",
        {
          method: isEditing ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quiz),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customQuizzes"] });
      dispatch({ type: "SAVE_CUSTOM_QUIZ", payload: data });
    },
    onError: () => alert("Could not save quiz."),
  });

  // DELETING
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customQuizzes"] });
      dispatch({ type: "DELETE_SUCCESS" });
    },
    onError: () => {
      alert("Could not delete hive.");
      dispatch({ type: "SET_DELETING", payload: false });
    },
  });

  const handleConfirmDelete = () => {
    if (!quizToDelete) return;
    dispatch({ type: "SET_DELETING", payload: true });
    deleteMutation.mutate(quizToDelete);
  };

  // GENERATING QUESTIONS USING AI
  const aiMutation = useMutation({
    mutationFn: async (text: string): Promise<AiGeneratedQuiz | "ERROR"> => {
      const res = await fetch("/api/quizzes/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to generate quiz.");
      }
      return res.json();
    },
  });

  return (
    <Modals.ModalOverlay>
      {activeModal === "select_mode" && (
        <Modals.SelectModeModal
          isLoggedIn={isLoggedIn}
          selectedGameType={selectedGameType}
          onSelectMode={onSelectMode}
          onClose={closeModal}
        />
      )}

      {activeModal === "select_quiz" && (
        <Modals.SelectQuizModal
          onSelectQuiz={(quiz) =>
            dispatch({ type: "SELECT_QUIZ", payload: quiz })
          }
          onBack={() => onSelectMode("selection")}
        />
      )}

      {activeModal === "custom_menu" && (
        <Modals.CustomMenuModal
          customQuizzes={customQuizzes || []}
          onSelectMode={onSelectMode}
          onSelectQuiz={(quiz) =>
            dispatch({ type: "SELECT_QUIZ", payload: quiz })
          }
          onEditCustom={(quiz) => {
            dispatch({ type: "SET_QUIZ_TO_EDIT", payload: quiz });
            dispatch({ type: "SET_ACTIVE_MODAL", payload: "create_quiz" });
          }}
          onDeleteCustom={(id) =>
            dispatch({ type: "PROMPT_DELETE", payload: id })
          }
        />
      )}

      {activeModal === "delete_confirmation" && (
        <Modals.DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={() => dispatch({ type: "DELETE_CANCEL" })}
          isDeleting={isDeleting}
        />
      )}

      {activeModal === "create_quiz" && (
        <Modals.CreateQuizForm
          initialData={quizToEdit}
          onSave={(quiz) => saveMutation.mutate(quiz)}
          isLoading={saveMutation.isPending}
          onAiGenerate={(text) => aiMutation.mutateAsync(text)}
          isAiLoading={aiMutation.isPending}
          aiError={aiMutation.error?.message ?? null}
          onCancel={() => onSelectMode("custom")}
        />
      )}

      {activeModal === "ready_confirmation" && selectedQuiz && (
        <Modals.ReadyConfirmationModal
          selectedQuiz={selectedQuiz}
          customTimer={customTimer}
          setCustomTimer={(v) => {
            const value = typeof v === "function" ? v(state.customTimer) : v;
            dispatch({ type: "SET_CUSTOM_TIMER", payload: value });
          }}
          onStart={onStartGame}
          onChangeQuiz={() => onSelectMode("selection")}
        />
      )}

      {activeModal === "options" && (
        <Modals.OptionsModal
          musicEnabled={musicEnabled}
          setMusicEnabled={setMusicEnabled}
          sfxEnabled={sfxEnabled}
          setSfxEnabled={setSfxEnabled}
          onClose={closeModal}
        />
      )}

      {activeModal === "exit" && <Modals.ExitModal onClose={closeModal} />}

      {activeModal === "pause" && (
        <Modals.PauseModal
          musicEnabled={musicEnabled}
          setMusicEnabled={setMusicEnabled}
          sfxEnabled={sfxEnabled}
          setSfxEnabled={setSfxEnabled}
          onClose={closeModal}
          onExit={onExitToMenu}
        />
      )}
    </Modals.ModalOverlay>
  );
};
