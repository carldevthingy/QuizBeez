import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  verifyUser,
  logout,
  setGoogleUser,
  changePassword,
  resetPassword
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// api/auth/

router.post('/register', register);
router.post('/password-reset', resetPassword);
router.post('/login', login);
router.post('/verify/:token', verifyUser);
router.post('/password-reset/:token', changePassword);

router.get('/user', protect, (req, res) => {
  res.json(req.user);
});

router.post('/logout', logout);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  }),
  (req, res) => {
    setGoogleUser(req, res);
    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(`${frontendUrl}/game`);
  }
);

export default router;
