import { useCallback, useEffect, useRef, useReducer, useState } from "react";
import { Canvas, type ModalType, type Question } from "@/config/gameConfig";
import { useGameEngine } from "@/hooks/game/useGameEngine";
import { useAudio } from "@/hooks/game/useAudio";
import {
  MenuOverlay,
  GameOverlay,
  GameOverScreen,
  LoadingOverlay,
} from "@/components/game/overlays";

import { useAuth } from "@/context/AuthContext.ts";
import { FaUserCog } from "react-icons/fa";
import { Joystick } from "@/components/game/mobile/Joystick";
import { ActionButton } from "@/components/game/mobile/ActionButton";
import { createInitialState, gameReducer } from "./GameReducer";
import { ModalRouter } from "@/components/game/modals/ModalRouter";

const BeeGame = () => {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState,
  );
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { user, logout: handleLogout } = useAuth();
  const {
    loadAudio,
    playSfx,
    playBgm,
    musicEnabled,
    setMusicEnabled,
    sfxEnabled,
    setSfxEnabled,
  } = useAudio();

  const gameModeRef = useRef(state.gameMode);
  const activeModalRef = useRef(state.activeModal);
  const timerRef = useRef(state.timer);
  const currentQRef = useRef<Question | null>(null);
  const selectedQuizRef = useRef(state.selectedQuiz);
  const currentQIndexRef = useRef(state.currentQIndex);
  const customTimerRef = useRef(state.customTimer);
  const submissionRef = useRef<((zone: string | null) => void) | null>(null);
  const isInitialized = useRef(false);

  // Update during render
  useEffect(() => {
    gameModeRef.current = state.gameMode;
    activeModalRef.current = state.activeModal;
    timerRef.current = state.timer;
    selectedQuizRef.current = state.selectedQuiz;
    currentQIndexRef.current = state.currentQIndex;
    customTimerRef.current = state.customTimer;

    if (state.selectedQuiz) {
      currentQRef.current =
        state.selectedQuiz.questions[state.currentQIndex] ?? null;
    } else {
      currentQRef.current = null;
    }
  }, [state]);

  // ─── Mobile Detection ────
  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    dispatch({ type: "SET_MOBILE_VISIBLE", payload: hasTouch });
  }, []);

  // ─── Init ──────
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initGame = async () => {
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => Math.min(prev + 5, 90));
      }, 50);

      await loadAudio();

      clearInterval(progressInterval);
      setLoadingProgress(100);

      setTimeout(() => {
        dispatch({ type: "LOADING_DONE" });
        playBgm();
      }, 500);
    };

    initGame();
  }, [loadAudio, playBgm]);

  // ─── Quiz Select → Modal ────────
  useEffect(() => {
    if (state.pendingQuizSelect) {
      dispatch({ type: "CONFIRM_QUIZ_SELECT" });
    }
  }, [state.pendingQuizSelect]);

  // ─── Engine Callbacks ─────────────
  const handleZoneEnter = useCallback((zone: string | null) => {
    dispatch({ type: "SET_ZONE", payload: zone });
  }, []);

  const handleMenuSelect = useCallback((id: string) => {
    if (id === "start") {
      dispatch({ type: "SET_ACTIVE_MODAL", payload: "select_mode" });
    } else {
      dispatch({ type: "SET_ACTIVE_MODAL", payload: id as ModalType });
    }
  }, []);

  const toggleOptions = useCallback(() => {
    if (activeModalRef.current) {
      dispatch({ type: "SET_ACTIVE_MODAL", payload: null });
    } else if (gameModeRef.current === "quiz") {
      dispatch({ type: "SET_ACTIVE_MODAL", payload: "pause" });
    }
  }, []);

  const {
    canvasRef,
    resetBeePosition,
    getCurrentZone,
    triggerFeedback,
    moveBee,
    pressEnter,
  } = useGameEngine(
    state.gameMode,
    state.activeModal,
    state.selectedQuiz
      ? state.selectedQuiz.questions[state.currentQIndex]
      : null,
    handleZoneEnter,
    handleMenuSelect,
    toggleOptions,
    playSfx,
    submissionRef,
  );

  const handleAnswerSubmission = useCallback(
    (choiceId: string | null) => {
      const currentQuestion = currentQRef.current;
      if (!currentQuestion) return;

      const isCorrect = choiceId === currentQuestion.correct;
      triggerFeedback(isCorrect);
      playSfx(isCorrect ? "correct" : "wrong");

      if (isCorrect) dispatch({ type: "SCORE_POINT" });

      const quiz = selectedQuizRef.current;
      if (quiz && currentQIndexRef.current < quiz.questions.length - 1) {
        dispatch({
          type: "NEXT_QUESTION",
          payload: { customTimer: customTimerRef.current },
        });
      } else {
        dispatch({ type: "GAME_OVER" });
        playSfx("win");
      }
    },
    [triggerFeedback, playSfx],
  );

  useEffect(() => {
    submissionRef.current = handleAnswerSubmission;
  }, [handleAnswerSubmission]);

  useEffect(() => {
    if (state.gameMode !== "quiz") return;

    const interval = window.setInterval(() => {
      if (timerRef.current <= 0) {
        const finalZone = getCurrentZone();
        submissionRef.current?.(finalZone);
      } else {
        dispatch({ type: "TICK_TIMER" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.gameMode, getCurrentZone]);

  // ─── UI Action Handlers ─────
  const selectGameMode = useCallback((mode: string) => {
    if (mode === "preset") {
      dispatch({ type: "SELECT_GAME_TYPE", payload: "preset" });
      dispatch({ type: "SET_ACTIVE_MODAL", payload: "select_quiz" });
    } else if (mode === "custom") {
      dispatch({ type: "SELECT_GAME_TYPE", payload: "custom" });
      dispatch({ type: "SET_ACTIVE_MODAL", payload: "custom_menu" });
    } else if (mode === "custom_new") {
      dispatch({ type: "SET_QUIZ_TO_EDIT", payload: null });
      dispatch({ type: "SET_ACTIVE_MODAL", payload: "create_quiz" });
    } else if (mode === "selection") {
      dispatch({ type: "SELECT_GAME_TYPE", payload: null });
      dispatch({ type: "SET_QUIZ_TO_EDIT", payload: null });
      dispatch({ type: "SET_ACTIVE_MODAL", payload: "select_mode" });
    }
  }, []);

  const startGame = useCallback(() => {
    if (!state.selectedQuiz) return;
    dispatch({ type: "START_GAME" });
    resetBeePosition();
  }, [state.selectedQuiz, resetBeePosition]);

  const handleExitToMenu = useCallback(() => {
    dispatch({ type: "EXIT_TO_MENU" });
    resetBeePosition();
    playBgm();
  }, [resetBeePosition, playBgm]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#fffcf3]">
      {/* NAV BAR */}
      <nav className="top-0 pt-6 px-4 z-40">
        <div className="min-w-195 max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto bg-white px-4 md:px-6 py-3 rounded-full shadow-xl flex items-center justify-between border-2 border-black relative">
          <a
            href="/"
            className="font-black text-lg md:text-xl text-black decoration-transparent"
          >
            QuizBeez
          </a>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative group">
                <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm transition-transform hover:text-yellow-400">
                  <FaUserCog size={24} />
                </button>
                <div className="absolute right-0 mt-0 w-40 bg-white border-2 border-black rounded-lg shadow-xl hidden group-hover:block group-focus-within:block overflow-hidden">
                  <a
                    href="/profile"
                    className="block px-4 py-3 text-black font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 font-semibold hover:bg-red-50 hover:cursor-pointer transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="/user/login"
                className="bg-black border text-white px-6 py-2 rounded-full font-bold text-sm transition-transform shrink-0 hover:text-yellow-400 decoration-transparent"
              >
                LOGIN
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* GAME CONTAINER */}
      <div
        className="relative w-200 h-150 mx-auto mt-5 border-4 border-gray-800 rounded-xl overflow-hidden bg-gray-900 shadow-2xl"
        onClick={() => playBgm()}
      >
        <canvas
          ref={canvasRef}
          width={Canvas.width}
          height={Canvas.height}
          className="block bg-[#fdf6e3]"
        />

        {state.gameMode === "loading" && (
          <LoadingOverlay progress={loadingProgress} />
        )}
        {state.gameMode === "menu" && <MenuOverlay />}

        {(state.gameMode === "quiz" || state.gameMode === "gameover") &&
          state.selectedQuiz && (
            <GameOverlay
              question={state.selectedQuiz.questions[state.currentQIndex]}
              score={state.score}
              timer={state.timer}
              uiCurrentZone={state.uiCurrentZone}
            />
          )}

        {state.isMobileControlsVisible &&
          (state.gameMode === "menu" || state.gameMode === "quiz") &&
          !state.activeModal && (
            <>
              <Joystick onMove={moveBee} />
              <ActionButton onTap={pressEnter} />
            </>
          )}

        {state.activeModal && (
          <ModalRouter
            state={state}
            isLoggedIn={!!user}
            dispatch={dispatch}
            onSelectMode={selectGameMode}
            onStartGame={startGame}
            onExitToMenu={handleExitToMenu}
            musicEnabled={musicEnabled}
            setMusicEnabled={(v) =>
              setMusicEnabled(typeof v === "function" ? musicEnabled : v)
            }
            sfxEnabled={sfxEnabled}
            setSfxEnabled={(v) =>
              setSfxEnabled(typeof v === "function" ? sfxEnabled : v)
            }
          />
        )}

        {state.gameMode === "gameover" && (
          <GameOverScreen
            score={state.score}
            onRestart={startGame}
            onExit={handleExitToMenu}
          />
        )}
      </div>

      <div className="min-w-195">
        <div className="mx-auto mt-6 text-center max-w-2xl px-4">
          <p className="text-gray-700 font-medium md:text-lg bg-white/50 py-3 px-6 rounded-2xl border-2 border-gray-200 shadow-sm">
            Fly around using{" "}
            <span className="font-black text-gray-700 tracking-widest">
              WASD
            </span>
            . Answer questions by standing in what you think is the correct spot
            when the timer runs out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeeGame;
