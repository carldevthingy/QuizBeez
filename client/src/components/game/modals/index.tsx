export { CustomMenuModal } from "./CustomMenuModal";
export { DeleteConfirmationModal } from "./DeleteConfirmationModal";
export { ExitModal } from "./ExitModal";
export { OptionsModal } from "./OptionsModal";
export { PauseModal } from "./PauseModal";
export { ReadyConfirmationModal } from "./ReadyConfirmationModal";
export { SelectModeModal } from "./SelectModeModal";
export { SelectQuizModal } from "./SelectQuizModal";
export { CreateQuizForm } from "./CreateQuizForm";

export const ModalOverlay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-20">
    {children}
  </div>
);
