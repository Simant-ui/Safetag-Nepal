import type { User } from '@/types/models';
import type { UpdateProfileInput } from './userTypes';

export interface UserService {
  getById(userId: string): Promise<User>;
  updateProfile(userId: string, input: UpdateProfileInput): Promise<User>;
  uploadProfileImage(userId: string, localUri: string): Promise<string>;
}
