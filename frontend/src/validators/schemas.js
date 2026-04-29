import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name too long'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(80),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  subject: z
    .string({ required_error: 'Subject is required' })
    .min(3, 'Subject is too short')
    .max(120),
  message: z
    .string({ required_error: 'Message is required' })
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message is too long'),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
});
