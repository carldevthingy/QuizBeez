import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { createQuiz, getQuizzes, updateQuiz, deleteQuiz } from '../controllers/quiz.controller';

const router = express.Router();

// api/quizzes/

router.post('/', protect, createQuiz);
router.get('/', protect, getQuizzes);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);

export default router;
