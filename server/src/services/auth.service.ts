// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as userRepository from '../repositories/user.repository';
import { sendResetPasswordEmail, sendVerificationEmail } from './email.service';

export const registerUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  await userRepository.createUser(username, email, hashedPassword, verificationToken);
  await sendVerificationEmail(email, verificationToken);
};

export const requestResetPassword = async (email: string) => {
  const user = await userRepository.findVerifiedUserByEmail(email);

  if (!user) throw new Error("User not found");
  if (user.password === null) throw new Error("Password reset is not available for this user");
  if (user.verification_token !== null) throw new Error("Already have a pending request");

  const verificationToken = crypto.randomBytes(32).toString('hex');

  await userRepository.updateVerificationToken(email, verificationToken);
  await sendResetPasswordEmail(email, verificationToken);
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findVerifiedUserByEmail(email);

  if (!user) throw new Error("Wrong email or password");
  if(user.password === null) throw new Error("No password set for this user")

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Wrong email or password");

  return user;
};

export const verifyUserToken = async (token: string) => {
  const user = await userRepository.findUserByToken(token);
  if (!user) throw new Error("Invalid verification token");

  return await userRepository.verifyUser(token);
};

export const changePassword = async (token: string, password: string) => {
  const user = await userRepository.findUserByToken(token);
  if (!user) throw new Error("Invalid reset token");

  const hashedPassword = await bcrypt.hash(password, 10);
  return await userRepository.updatePassword(token, hashedPassword);
};


export const processGoogleUser = async (googleId: string, email: string, username: string, profilePic: string) => {
  // Check if user already logged in with Google before
  let user = await userRepository.findUserByGoogleId(googleId);
  if (user) return user;

  //  Check if a standard email/password user exists with this email
  user = await userRepository.findUserByEmail(email);
  if (user) {
    if (!user.is_verified) {
      // If user is registered but is not verified, verify user
      return await userRepository.verifyAndLinkGoogleAccount(email, googleId);
    }

    // If user already verified but is not linked with google link the account
    return await userRepository.linkGoogleAccount(email, googleId);
  }

  // If neither exists, create a brand new verified user
  return await userRepository.createGoogleUser(username, email, googleId, profilePic);
};