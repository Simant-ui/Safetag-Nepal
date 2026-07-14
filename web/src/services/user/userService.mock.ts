import type { User } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import type { UserService } from './userService';
import type { UpdateProfileInput } from './userTypes';

export class MockUserService implements UserService {
  async getById(userId: string): Promise<User> {
    await simulateLatency(80);
    const user = mockDb.users.find((u) => u.userId === userId);
    if (!user) throw new Error('User not found.');
    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    await simulateLatency(100);
    const user = mockDb.users.find((u) => u.userId === userId);
    if (!user) throw new Error('User not found.');
    Object.assign(user, input);
    return user;
  }

  async uploadProfileImage(_userId: string, localUri: string): Promise<string> {
    await simulateLatency(60);
    // Mock returns the local URI directly; Phase 2 will upload to Cloudinary and return its secure_url.
    return localUri;
  }
}
