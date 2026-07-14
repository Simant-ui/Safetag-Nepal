import { Router } from 'express';
import { getUserById, updateProfile, uploadProfileImage } from '../controllers/userController';
import { completeProfile } from '../controllers/authController';
import { requireAuth } from '../middleware/requireAuth';

export const userRoutes = Router();

userRoutes.use(requireAuth);
userRoutes.get('/:id', getUserById);
userRoutes.patch('/:id', updateProfile);
userRoutes.patch('/:id/profile', completeProfile);
userRoutes.post('/:id/image', uploadProfileImage);
