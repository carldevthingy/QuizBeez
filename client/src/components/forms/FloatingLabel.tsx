interface Props {
    htmlFor: string;
    label: string;
    isTextArea?: boolean;
    isEditing?: boolean;
}

export const FloatingLabel = ({ htmlFor, label, isTextArea = false, isEditing }: Props) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`absolute font-medium text-(--text) transform
        -translate-y-4 scale-75 top-2 z-10 origin-left bg-(--bg) px-2
        peer-focus:px-2 peer-focus:text-dark-yellow
        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
        peer-focus:top-2 peer-focus:scale-75
        peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
        peer-not-placeholder-shown:-translate-y-5
        peer-not-placeholder-shown:scale-75
        ${isTextArea ? "peer-placeholder-shown:top-5" : "peer-placeholder-shown:top-1/2"}
        ${isEditing ? "duration-0" : "duration-300"}
      `}
        >
            {label}
        </label>
    );
};
