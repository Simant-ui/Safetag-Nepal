import type { User } from '@/types/models';

export type UpdateProfileInput = Partial<
  Pick<User, 'name' | 'email' | 'profileImage' | 'emergencyContact' | 'bloodGroup' | 'address'>
>;
