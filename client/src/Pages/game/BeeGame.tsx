import { useCallback, useEffect, useRef, useState } from "react";
import {
  Canvas,
  QUESTION_TIMER_SECONDS,
  type GameMode,
  type ModalType,
  type Question,
  type QuizSet,
  type GameType,
} from "@/config/gameConfig";
import { useGameEngine } from "@/hooks/game/useGameEngine";
import { useAudio } from "@/hooks/game/useAudio";
import {
  MenuOverlay,
  GameOverlay,
  GameOverScreen,
  LoadingOverlay,
} from "@/components/game/overlays";
import {
  ModalOverlay,
  CustomMenuModal,
  DeleteConfirmationModal,
  ExitModal,
  OptionsModal,
  PauseModal,
  ReadyConfirmationModal,
  SelectModeModal,
  SelectQuizModal,
  CreateQuizForm,
} from "@/components/game/modals";
import { useAuth } from "@/context/AuthContext.ts";
import { FaUserCog } from "react-icons/fa";
import { Joystick } from "@/components/game/Joystick";
import { ActionButton } from "@/components/game/ActionButton";

const BeeGame = () => {
  const [gameMode, setGameMode] = useState<GameMode>("loading");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(QUESTION_TIMER_SECONDS);
  const [uiCurrentZone, setUiCurrentZone] = useState<string | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(
    null,
  );
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSet | null>(null);
  const [customTimer, setCustomTimer] = useState(15);

  // Custom Quiz States
  const [customQuizzes, setCustomQuizzes] = useState<QuizSet[]>([]);
  const [quizToEdit, setQuizToEdit] = useState<QuizSet | null>(null);
  // Deleting custom quiz
  const [quizToDelete, setQuizToDelete] = useState<string | number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // auth
  const { user, logout: handleLogout } = useAuth();

  const [isMobileControlsVisible, setIsMobileControlsVisible] = useState(false);

  // Audio Hook
  const {
    loadAudio,
    playSfx,
    playBgm,
    musicEnabled,
    setMusicEnabled,
    sfxEnabled,
    setSfxEnabled,
  } = useAudio();

  // --- Refs ---
  const gameModeRef = useRef<GameMode>("loading");
  const currentQRef = useRef<Question | null>(null);
  const activeModalRef = useRef<ModalType>(null);
  const timerRef = useRef(timer);

  const isInitialized = useRef(false);

  //isMobile check
  useEffect(() => {
  const checkTouch = () => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    setIsMobileControlsVisible(hasTouch);
  };

  checkTouch();
  }, []);

  // --- Sync Refs ---
  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);

  useEffect(() => {
    if (selectedQuiz && selectedQuiz.questions[currentQIndex]) {
      currentQRef.current = selectedQuiz.questions[currentQIndex];
    }
  }, [currentQIndex, selectedQuiz]);

  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  // --- Init ---
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
        setGameMode("menu");
        playBgm();
      }, 500);
    };

    initGame();
  }, [loadAudio, playBgm]);

  // --- Fetch quizzes of user ---
  useEffect(() => {
    if (!user) return;

    const fetchQuizzes = async () => {
      try {
        const quizResponse = await fetch("/api/quizzes", {
          method: "GET",
          credentials: "include",
        });

        if (quizResponse.ok) {
          const data = await quizResponse.json();
          setCustomQuizzes(data);
        } else {
          console.error(
            "Failed to fetch quizzes. Status:",
            quizResponse.status,
          );
        }
      } catch (error) {
        console.error("Failed to load custom quizzes from server", error);
      }
    };

    fetchQuizzes();
  }, [user]);

  // --- Callbacks passed to engine ---
  const handleZoneEnter = useCallback((zone: string | null) => {
    setUiCurrentZone(zone);
  }, []);

  const handleMenuSelect = useCallback((id: string) => {
    if (id === "start") setActiveModal("select_mode");
    else setActiveModal(id as ModalType);
  }, []);

  const toggleOptions = useCallback(() => {
    if (activeModalRef.current) {
      setActiveModal(null);
    } else {
      if (gameModeRef.current === "quiz") {
        setActiveModal("pause");
      }
    }
  }, []);

const submissionRef = useRef<((zone: string | null) => void) | null>(null);

  // --- Init engine ---
  const { canvasRef, resetBeePosition, getCurrentZone, triggerFeedback, moveBee, pressEnter } =
    useGameEngine(
      gameMode,
      activeModal,
      selectedQuiz ? selectedQuiz.questions[currentQIndex] : null,
      handleZoneEnter,
      handleMenuSelect,
      toggleOptions,
      playSfx,
      submissionRef
    );

  // --- Game Logic ---
  const handleAnswerSubmission = useCallback(
    (choiceId: string | null) => {
      if (!selectedQuiz || !currentQRef.current) return;

      const currentQuestion = currentQRef.current;
      const isCorrect = choiceId === currentQuestion.correct;

      triggerFeedback(isCorrect);

      if (isCorrect) playSfx("correct");
      else playSfx("wrong");

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      if (currentQIndex < selectedQuiz.questions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setTimer(customTimer);
      } else {
        setGameMode("gameover");
        playSfx("win");
        if (activeModalRef.current) setActiveModal(null);
      }
    },
    [currentQIndex, triggerFeedback, selectedQuiz, customTimer, playSfx],
  );

  useEffect(() => {
      submissionRef.current = handleAnswerSubmission;
  }, [handleAnswerSubmission]);

  // --- Timer Logic ---
  useEffect(() => {
    if (gameMode !== "quiz") return;

    const interval = window.setInterval(() => {
      if (gameMode !== "quiz") {
        if (activeModalRef.current) return;
      }

      if (timerRef.current <= 0) {
        const finalZone = getCurrentZone();
        handleAnswerSubmission(finalZone);
      } else {
        setTimer((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode, handleAnswerSubmission, getCurrentZone]);

  // --- UI Actions & Custom Quiz Logic ---
  const selectGameMode = (mode: string) => {
    if (mode === "preset") {
      setSelectedGameType("preset");
      setActiveModal("select_quiz");
    } else if (mode === "custom") {
      setSelectedGameType("custom");
      setActiveModal("custom_menu");
    } else if (mode === "custom_new") {
      setQuizToEdit(null);
      setActiveModal("create_quiz");
    } else if (mode === "selection") {
      setSelectedGameType(null);
      setQuizToEdit(null);
      setActiveModal("select_mode");
    }
  };

  const handleEditCustom = (quiz: QuizSet) => {
    setQuizToEdit(quiz);
    setActiveModal("create_quiz");
  };

  // --- only handles local state updates ---
  const handleSaveCustomQuiz = (savedQuiz: QuizSet) => {
    const isEditing = !!quizToEdit && !!quizToEdit.id;

    let updatedQuizzes;
    if (isEditing) {
      updatedQuizzes = customQuizzes.map((q) =>
        q.id === savedQuiz.id ? savedQuiz : q,
      );
    } else {
      updatedQuizzes = [...customQuizzes, savedQuiz];
    }

    setCustomQuizzes(updatedQuizzes);
    setQuizToEdit(null);
    setActiveModal("custom_menu");
  };

  // --- DELETING QUIZ ---
  const promptDeleteCustom = (id: string | number) => {
    setQuizToDelete(id);
    setActiveModal("delete_confirmation");
  };

  const confirmDeleteCustom = async () => {
    if (!quizToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/quizzes/${quizToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete quiz");

      const updatedQuizzes = customQuizzes.filter((q) => q.id !== quizToDelete);
      setCustomQuizzes(updatedQuizzes);

      setActiveModal("custom_menu");
    } catch (err) {
      console.error(err);
      alert("Error deleting quiz. Please try again.");
    } finally {
      setIsDeleting(false);
      setQuizToDelete(null);
    }
  };

  const selectQuiz = (quiz: QuizSet) => {
    setSelectedQuiz(quiz);
    setTimeout(() => {
      setActiveModal("ready_confirmation");
    }, 200);
  };

  const startGame = () => {
    if (!selectedQuiz) return;
    setActiveModal(null);
    setGameMode("quiz");
    setScore(0);
    setCurrentQIndex(0);
    resetBeePosition();
    setTimer(customTimer);
  };

  const handleExitToMenu = () => {
    setGameMode("menu");
    setActiveModal(null);
    setSelectedQuiz(null);
    setSelectedGameType(null);
    setScore(0);
    setCurrentQIndex(0);
    resetBeePosition();
    playBgm();
  };

  const closeModal = () => {
    setActiveModal(null);
    if (gameMode !== "quiz") {
      setSelectedGameType(null);
      setSelectedQuiz(null);
      setQuizToEdit(null);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#fffcf3]">
      {/* --- NAV BAR --- */}
      <nav className="top-0 pt-6 px-4 z-40">
        <div className="min-w-195 max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto bg-white px-4 md:px-6 py-3 rounded-full shadow-xl flex items-center justify-between border-2 border-black relative">
          <a
            href="/"
            className="font-black text-lg md:text-xl text-black decoration-transparent "
          >
            QuizBeez
          </a>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative group">
                {/* Profile Button */}
                <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm transition-transform hover:text-yellow-400">
                  <FaUserCog size={24} />
                </button>

                {/* Dropdown Menu */}
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
                href="/auth/login"
                className="bg-black border text-white px-6 py-2 rounded-full font-bold text-sm transition-transform shrink-0 hover:text-yellow-400 decoration-transparent"
              >
                LOGIN
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* --- GAME CONTAINER --- */}
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

        {gameMode === "loading" && (
          <LoadingOverlay progress={loadingProgress} />
        )}
        {gameMode === "menu" && <MenuOverlay />}

        {(gameMode === "quiz" || gameMode === "gameover") && selectedQuiz && (
          <GameOverlay
            question={selectedQuiz.questions[currentQIndex]}
            score={score}
            timer={timer}
            uiCurrentZone={uiCurrentZone}
          />
        )}

        {/* JOYSTICK AND ACTION BUTTON FOR MOBILE */}
        {(isMobileControlsVisible && gameMode === "menu") || gameMode === "quiz"
          ? !activeModal && (
              <>
                <Joystick onMove={moveBee} />
                <ActionButton onTap={pressEnter} />
              </>
            )
          : null}

        {/* --- MODAL RENDERING --- */}
        {activeModal && (
          <ModalOverlay>
            {activeModal === "select_mode" && (
              <SelectModeModal
                isLoggedIn={!!user}
                selectedGameType={selectedGameType}
                onSelectMode={selectGameMode}
                onClose={closeModal}
              />
            )}
            {activeModal === "select_quiz" && (
              <SelectQuizModal
                onSelectQuiz={selectQuiz}
                onBack={() => selectGameMode("selection")}
              />
            )}
            {activeModal === "custom_menu" && (
              <CustomMenuModal
                customQuizzes={customQuizzes}
                onSelectMode={selectGameMode}
                onSelectQuiz={selectQuiz}
                onEditCustom={handleEditCustom}
                onDeleteCustom={promptDeleteCustom}
              />
            )}
            {activeModal === "delete_confirmation" && (
              <DeleteConfirmationModal
                onConfirm={confirmDeleteCustom}
                onCancel={() => {
                  setQuizToDelete(null);
                  setActiveModal("custom_menu");
                }}
                isDeleting={isDeleting}
              />
            )}
            {activeModal === "create_quiz" && (
              <CreateQuizForm
                initialData={quizToEdit}
                onSave={handleSaveCustomQuiz}
                onCancel={() => selectGameMode("custom")}
              />
            )}
            {activeModal === "ready_confirmation" && selectedQuiz && (
              <ReadyConfirmationModal
                selectedQuiz={selectedQuiz}
                customTimer={customTimer}
                setCustomTimer={setCustomTimer}
                onStart={startGame}
                onChangeQuiz={() => selectGameMode("selection")}
              />
            )}
            {activeModal === "options" && (
              <OptionsModal
                musicEnabled={musicEnabled}
                setMusicEnabled={setMusicEnabled}
                sfxEnabled={sfxEnabled}
                setSfxEnabled={setSfxEnabled}
                onClose={closeModal}
              />
            )}
            {activeModal === "exit" && <ExitModal onClose={closeModal} />}
            {activeModal === "pause" && (
              <PauseModal
                musicEnabled={musicEnabled}
                setMusicEnabled={setMusicEnabled}
                sfxEnabled={sfxEnabled}
                setSfxEnabled={setSfxEnabled}
                onClose={closeModal}
                onExit={handleExitToMenu}
              />
            )}
          </ModalOverlay>
        )}

        {gameMode === "gameover" && (
          <GameOverScreen
            score={score}
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
