import { Request, Response } from 'express';
import { createQuizService, getQuizzesByUser, updateQuizService, deleteQuizService } from '../services/quiz.service';
import { QuizInput } from '../types/quiz.types';
import { UserInfo } from '../types/user.types';

export const handleQuizError = (res: Response, err: unknown) => {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes('not found')) return res.status(404).json({ message: msg });
    if (msg.includes('Unauthorized')) return res.status(403).json({ message: msg });

    return res.status(400).json({ message: msg });
  }
  return res.status(500).json({ message: 'Something went wrong' });
};

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    const userId = user?.id;
    const quizData: QuizInput = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!quizData.title || !quizData.questions?.length)
      return res.status(400).json({ message: 'Quiz title and questions are required' });

    for (const q of quizData.questions) {
      if (q.choices.length < 2) return res.status(400).json({ message: 'Each question must have at least two choices' });
      if (!q.choices.some(c => c.label === q.correct)) return res.status(400).json({ message: 'Correct choice must match one of the labels' });
      if (!q.text || q.choices.some(c => !c.text)) return res.status(400).json({ message: 'All question and choice texts are required' });
    }

    const quizId = await createQuizService(userId, quizData);
    return res.status(201).json({ quizId });
  } catch (err) {
    handleQuizError(res, err);
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    if (!user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const quizzes = await getQuizzesByUser(user.id);
    return res.status(200).json(quizzes);
  } catch (err) {
    handleQuizError(res, err);
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    const quizId = req.params.id as string;
    const quizData: QuizInput = req.body;

    if (!user?.id) return res.status(401).json({ message: 'Unauthorized' });
    if (!quizId) return res.status(400).json({ message: 'Quiz ID is required' });

    if (!quizData.title || !quizData.description || !quizData.questions?.length) {
      return res.status(400).json({ message: 'Quiz title, description, and questions are required' });
    }

    await updateQuizService(user.id, quizId, quizData);
    return res.status(200).json({ message: 'Quiz updated successfully' });
  } catch (err) {
    handleQuizError(res, err);
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;
    const quizId = req.params.id as string;

    if (!user?.id) return res.status(401).json({ message: 'Unauthorized' });
    if (!quizId) return res.status(400).json({ message: 'Quiz ID is required' });

    await deleteQuizService(user.id, quizId);
    return res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    handleQuizError(res, err);
  }
};