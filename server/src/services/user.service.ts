import * as userRepository from '../repositories/user.repository';

export const editUser = async (userId: string | number, newUsername: string) => {
  if (!newUsername) throw new Error("Username cannot be empty");
  return await userRepository.updateUsername(userId, newUsername);
};

export const removeUser = async (userId: string | number) => {
  await userRepository.deleteUserById(userId);
};