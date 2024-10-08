import userModel from '../models/user.model';
import { UserType } from '../types/user.type';

export const createUser = async (payload: UserType) => {
  return await userModel.create(payload);
};

export const findEmail = async (email: string) => {
  return await userModel.findOne({ email });
};
