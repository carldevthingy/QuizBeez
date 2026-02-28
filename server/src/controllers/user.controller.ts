import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { UserInfo } from '../types/user.types';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;

    const userId = user.id;
    const { username } = req.body;

    const updatedUser = await userService.editUser(userId, username);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInfo;

    const userId = user.id;
    await userService.removeUser(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};