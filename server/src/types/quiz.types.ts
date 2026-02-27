// types/quiz.types.ts
export interface ChoiceInput {
  label: string; // 'A', 'B', etc.
  text: string;
}

export interface QuestionInput {
  text: string;
  choices: ChoiceInput[];
  correct: string; // label of correct choice
}

export interface QuizInput {
  title: string;
  description: string;
  questions: QuestionInput[];
}
