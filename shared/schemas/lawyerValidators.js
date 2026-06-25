import { z } from "zod";
import { LawyerZodSchema } from "./authValidators";

// 1. Update Lawyer Schema
// ==========================================
/**
 * For profile updates. Uses .partial() so every field becomes optional,
 * but if a field is provided, it must still pass the original validation rules.
 * We use .omit() to ensure sensitive administrative fields can't be updated by the user.
 */
export const updateLawyerSchema = LawyerZodSchema.omit({
  user: true, // Cannot change the linked user account
  verificationStatus: true, // Admin only
  rejectionReason: true, // Admin only
  isVerified: true, // Admin only
  isFeatured: true, // Admin only
  rating: true, // Automated calculated field
  reviewCount: true, // Automated calculated field
  reviews: true, // Handled via separate review submission routes
})
  .partial()
  .strict();

// ==========================================
// 2. Verify Lawyer Schema
// ==========================================
/**
 * For admin-only verification endpoints.
 * Uses .pick() to only extract the fields required for the admin review process.
 */
export const verifyLawyerSchema = LawyerZodSchema.pick({
  verificationStatus: true,
  rejectionReason: true,
  isVerified: true,
})
  .strict()
  .superRefine((data, ctx) => {
    // Custom rule: If status is rejected, a rejection reason must be supplied
    if (
      data.verificationStatus === "rejected" &&
      (!data.rejectionReason || data.rejectionReason.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rejectionReason"],
        message:
          "A rejection reason is required when status is set to 'rejected'",
      });
    }
  });

// ==========================================
// 3. Lawyer Search Schema
// ==========================================
/**
 * For GET query parameters (e.g., /api/lawyers?search=divorce&page=1&limit=10)
 * Uses z.coerce to safely turn string query parameters into numbers.
 */
export const lawyerSearchSchema = z
  .object({
    search: z.string().trim().optional(), // For keyword search (bio, category, text indices)
    category: z.string().trim().optional(), // Specific practice area / category filter
    city: z.string().trim().optional(), // Location filter
    minFee: z.coerce.number().nonnegative().optional(), // Budget filtering
    maxFee: z.coerce.number().nonnegative().optional(),

    // Pagination defaults handle strings passed via URL parameters safely
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10), // Set max safe limit per page
  })
  .strict();
