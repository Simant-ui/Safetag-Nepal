import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^(97|98)\d{8}$/, 'Enter a valid Nepal mobile number.'),
  intent: z.enum(['login', 'signup']).optional(),
});

export const verifyOtpSchema = z.object({
  requestId: z.string().min(1),
  code: z.string().regex(/^\d{4}$/, 'Enter the 4-digit code.'),
});

export const completeProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email('Enter a valid email address.'),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
  address: z.string().min(1, 'Address is required.'),
});

export const updateProfileSchema = completeProfileSchema.partial().extend({
  profileImage: z.string().optional(),
});

export const createQrTagSchema = z.object({
  type: z.enum(['vehicle', 'emergency', 'personal', 'business']),
  label: z.string().optional(),
});

export const setQrStatusSchema = z.object({
  status: z.enum(['active', 'inactive']),
});

export const registerVehicleSchema = z.object({
  vehicleNumber: z.string().min(1),
  vehicleType: z.enum(['car', 'bike', 'scooter', 'truck', 'other']),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  year: z.number().int().optional(),
  image: z.string().optional(),
  qrLabel: z.string().optional(),
});

export const registerBusinessSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  services: z.array(z.string()).optional(),
});

export const sendContactRequestSchema = z.object({
  qrId: z.string().min(1),
  requestType: z.enum(['call', 'message', 'emergency', 'wrong_parking']),
  message: z.string().optional(),
  callerInfo: z.object({ name: z.string().optional(), phone: z.string().optional() }).optional(),
});

export const sendMessageSchema = z.object({
  kind: z.enum(['text', 'voice']),
  body: z.string().min(1),
  voiceUri: z.string().optional(),
  voiceDurationSec: z.number().optional(),
});

export const startConversationSchema = z.object({
  message: z.string().min(1),
});

export const upgradeSubscriptionSchema = z.object({
  plan: z.enum(['free', 'premium', 'business']),
  // Admin-settable duration in days; defaults applied server-side if omitted.
  durationDays: z.number().int().positive().optional(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const adminCreateCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().regex(/^(97|98)\d{8}$/, 'Enter a valid Nepal mobile number.'),
  email: z.string().email().optional(),
  // Vehicle details are compulsory when a customer is created from the admin panel.
  vehicleNumber: z.string().min(1, 'Vehicle number is required.'),
  vehicleType: z.enum(['car', 'bike', 'scooter', 'truck', 'other']),
  brand: z.string().min(1, 'Brand is required.'),
  model: z.string().min(1, 'Model is required.'),
  year: z.number().int(),
});
