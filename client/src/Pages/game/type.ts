import type { GameMode, GameType, ModalType, QuizSet } from "@/config/gameConfig";

export type GameState = {
    gameMode: GameMode;
    activeModal: ModalType;
    currentQIndex: number;
    score: number;
    timer: number;
    uiCurrentZone: string | null;
    selectedGameType: GameType | null;
    selectedQuiz: QuizSet | null;
    customTimer: number;
    customQuizzes: QuizSet[];
    quizToEdit: QuizSet | null;
    quizToDelete: string | number | null;
    isDeleting: boolean;
    isMobileControlsVisible: boolean;
    pendingQuizSelect: QuizSet | null;
};