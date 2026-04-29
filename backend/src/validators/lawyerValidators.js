const { z } = require('zod');

const lawyerSearchSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  location: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  sortBy: z.enum(['rating', 'experience', 'name', 'createdAt']).default('rating'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(80)
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
  subject: z
    .string({ required_error: 'Subject is required' })
    .min(3, 'Subject must be at least 3 characters')
    .max(120)
    .trim(),
  message: z
    .string({ required_error: 'Message is required' })
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be at most 2000 characters')
    .trim(),
});

module.exports = { lawyerSearchSchema, contactSchema };
