import type { GameType, ModalType, QuizSet } from "@/config/gameConfig";
import { QUESTION_TIMER_SECONDS } from "@/config/gameConfig";
import type { GameState } from "./type";

export type GameAction =
    | { type: "LOADING_DONE" }
    | { type: "SET_ACTIVE_MODAL"; payload: ModalType }
    | { type: "SET_ZONE"; payload: string | null }
    | { type: "SET_MOBILE_VISIBLE"; payload: boolean }
    | { type: "SELECT_GAME_TYPE"; payload: GameType | null }
    | { type: "SELECT_QUIZ"; payload: QuizSet }
    | { type: "CONFIRM_QUIZ_SELECT" }
    | { type: "START_GAME" }
    | { type: "EXIT_TO_MENU" }
    | { type: "SCORE_POINT" }
    | { type: "NEXT_QUESTION"; payload: { customTimer: number } }
    | { type: "GAME_OVER" }
    | { type: "TICK_TIMER" }
    | { type: "SET_CUSTOM_TIMER"; payload: number }
    | { type: "SET_CUSTOM_QUIZZES"; payload: QuizSet[] }
    | { type: "SAVE_CUSTOM_QUIZ"; payload: QuizSet }
    | { type: "SET_QUIZ_TO_EDIT"; payload: QuizSet | null }
    | { type: "PROMPT_DELETE"; payload: string | number }
    | { type: "DELETE_SUCCESS" }
    | { type: "DELETE_CANCEL" }
    | { type: "SET_DELETING"; payload: boolean }
    | { type: "CLOSE_MODAL" };

// ─── Reducer ────

export function createInitialState(): GameState {
    return {
        gameMode: "loading",
        activeModal: null,
        currentQIndex: 0,
        score: 0,
        timer: QUESTION_TIMER_SECONDS,
        uiCurrentZone: null,
        selectedGameType: null,
        selectedQuiz: null,
        customTimer: 15,
        customQuizzes: [],
        quizToEdit: null,
        quizToDelete: null,
        isDeleting: false,
        isMobileControlsVisible: false,
        pendingQuizSelect: null,
    };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case "LOADING_DONE":
            return { ...state, gameMode: "menu" };

        case "SET_ACTIVE_MODAL":
            return { ...state, activeModal: action.payload };

        case "SET_ZONE":
            return { ...state, uiCurrentZone: action.payload };

        case "SET_MOBILE_VISIBLE":
            return { ...state, isMobileControlsVisible: action.payload };

        case "SELECT_GAME_TYPE":
            return { ...state, selectedGameType: action.payload };

        case "SELECT_QUIZ":
            return {
                ...state,
                selectedQuiz: action.payload,
                pendingQuizSelect: action.payload,
            };

        case "CONFIRM_QUIZ_SELECT":
            return {
                ...state,
                pendingQuizSelect: null,
                activeModal: "ready_confirmation",
            };

        case "START_GAME":
            return {
                ...state,
                activeModal: null,
                gameMode: "quiz",
                score: 0,
                currentQIndex: 0,
                timer: state.customTimer,
            };

        case "EXIT_TO_MENU":
            return {
                ...state,
                gameMode: "menu",
                activeModal: null,
                selectedQuiz: null,
                selectedGameType: null,
                score: 0,
                currentQIndex: 0,
            };

        case "SCORE_POINT":
            return { ...state, score: state.score + 1 };

        case "NEXT_QUESTION":
            return {
                ...state,
                currentQIndex: state.currentQIndex + 1,
                timer: action.payload.customTimer,
            };

        case "GAME_OVER":
            return { ...state, gameMode: "gameover", activeModal: null };

        case "TICK_TIMER":
            return { ...state, timer: state.timer - 1 };

        case "SET_CUSTOM_TIMER":
            return { ...state, customTimer: action.payload };

        case "SET_CUSTOM_QUIZZES":
            return { ...state, customQuizzes: action.payload };

        case "SAVE_CUSTOM_QUIZ": {
            const isEditing = !!state.quizToEdit?.id;
            const updated = isEditing
                ? state.customQuizzes.map((q) =>
                    q.id === action.payload.id ? action.payload : q,
                )
                : [...state.customQuizzes, action.payload];
            return {
                ...state,
                customQuizzes: updated,
                quizToEdit: null,
                activeModal: "custom_menu",
            };
        }

        case "SET_QUIZ_TO_EDIT":
            return { ...state, quizToEdit: action.payload };

        case "PROMPT_DELETE":
            return {
                ...state,
                quizToDelete: action.payload,
                activeModal: "delete_confirmation",
            };

        case "DELETE_SUCCESS":
            return {
                ...state,
                customQuizzes: state.customQuizzes.filter(
                    (q) => q.id !== state.quizToDelete,
                ),
                quizToDelete: null,
                isDeleting: false,
                activeModal: "custom_menu",
            };

        case "DELETE_CANCEL":
            return { ...state, quizToDelete: null, activeModal: "custom_menu" };

        case "SET_DELETING":
            return { ...state, isDeleting: action.payload };

        case "CLOSE_MODAL":
            return {
                ...state,
                activeModal: null,
                ...(state.gameMode !== "quiz" && {
                    selectedGameType: null,
                    selectedQuiz: null,
                    quizToEdit: null,
                }),
            };

        default:
            return state;
    }
}