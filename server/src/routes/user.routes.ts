import express from 'express';
import { updateProfile, deleteAccount } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

//  /api/user

router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteAccount);

export default router;