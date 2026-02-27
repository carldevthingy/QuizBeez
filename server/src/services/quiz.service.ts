import * as quizRepository from '../repositories/quiz.repository';
import { QuizInput } from '../types/quiz.types';

export const createQuizService = async (userId: string, quizData: QuizInput) => {
  return await quizRepository.createQuizTransaction(userId, quizData);
};

export const getQuizzesByUser = async (userId: string) => {
  return await quizRepository.getQuizzesByUserId(userId);
};

export const updateQuizService = async (userId: string, quizId: string, quizData: QuizInput) => {
  const existingQuiz = await quizRepository.findQuizById(quizId);

  if (!existingQuiz) {
    throw new Error('Quiz not found');
  }
  if (existingQuiz.user_id !== userId) {
    throw new Error('Unauthorized access to quiz');
  }

  await quizRepository.updateQuizTransaction(quizId, quizData);
};

export const deleteQuizService = async (userId: string, quizId: string) => {
  const existingQuiz = await quizRepository.findQuizById(quizId);

  if (!existingQuiz) {
    throw new Error('Quiz not found');
  }
  if (existingQuiz.user_id !== userId) {
    throw new Error('Unauthorized access to quiz');
  }

  await quizRepository.deleteQuizById(quizId);
};