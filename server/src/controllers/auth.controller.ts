// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { cookieOptions } from '../utils/cookieOptions';
import { generateToken } from '../utils/generateTokens';
import { UserInfo } from '../types/user.types';
import validator from 'validator';

export const handleAuthError = (res: Response, err: unknown, statusCode: number = 401) => {
  if (err instanceof Error) {
    // If error message comes from repository/service (e.g., "Email already exists")
    const message = err.message;
    if (message.includes("already exists") || message.includes("already taken")) { // email/username
        return res.status(409).json({ message });
    }
    return res.status(statusCode).json({ message });
  }
  return res.status(500).json({ message: "Something went wrong" });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) return res.status(400).json({ message: "missing fields" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" });
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Email is not valid" });

    await authService.registerUser(username, email, password);

    res.status(201).json({ message: "Registration successful. Check your email." });
  } catch (err) {
    handleAuthError(res, err, 500);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Need email" });
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Email is not valid" });

    await authService.requestResetPassword(email);

    res.status(201).json({ message: "Password reset request confirmed. Check your email." });
  } catch (err) {
    handleAuthError(res, err, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" });

    const user = await authService.loginUser(email, password);
    const token = generateToken(user.id);

    res.cookie('token', token, cookieOptions);
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    handleAuthError(res, err, 401);
  }
};

export const verifyUser = async (req: Request<{ token: string }>, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token is required" });

    await authService.verifyUserToken(token);

    res.status(200).json({ message: "User is now verified" });
  } catch (err: unknown) {
    handleAuthError(res, err, 401);
  }
};

export const changePassword = async (req: Request<{ token: string }, {}, { password: string }>, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) return res.status(400).json({ message: "Token and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" });

    await authService.changePassword(token, password);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err: unknown) {
    handleAuthError(res, err, 401);
  }
};

export const logout = (req: Request, res: Response) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.clearCookie('token', cookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
};

export const setGoogleUser = (req: Request, res: Response) => {
  const user = req.user as UserInfo;
  const token = generateToken(user.id);
  res.cookie('token', token, cookieOptions);

};