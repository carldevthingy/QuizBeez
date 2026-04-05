import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { createQuiz, getQuizzes, updateQuiz, deleteQuiz, generateQuizGemini } from '../controllers/quiz.controller';

const router = express.Router();

// api/quizzes/

router.post('/', protect, createQuiz);
router.get('/', protect, getQuizzes);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);
router.post('/generate', protect, generateQuizGemini);

export default router;
