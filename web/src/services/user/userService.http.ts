import { apiClient } from '@/services/api/client';
import type { User } from '@/types/models';
import type { UserService } from './userService';
import type { UpdateProfileInput } from './userTypes';

export class HttpUserService implements UserService {
  async getById(userId: string): Promise<User> {
    return apiClient.get<User>(`/users/${userId}`);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    return apiClient.patch<User>(`/users/${userId}`, input);
  }

  async uploadProfileImage(userId: string, localUri: string): Promise<string> {
    // Phase 2: multipart upload to the backend, which forwards to Cloudinary and returns secure_url.
    const result = await apiClient.post<{ url: string }>(`/users/${userId}/image`, { localUri });
    return result.url;
  }
}
