import { z } from "zod";

// ==========================================
// SHARED CLIENT HELPERS
// ==========================================

// Helper validator for MongoDB ObjectIDs
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" });

// ==========================================
// 1. BASE CLIENT CREATION SCHEMA
// ==========================================
export const ClientZodSchema = z
  .object({
    user: objectIdSchema,
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"), // E.164 standard formatting

    address: z
      .object({
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        postalCode: z.string().trim().optional(),
      })
      .optional(),

    avatar: z
      .string()
      .url("Avatar must be a valid URL")
      .or(z.literal(""))
      .default(""),
    savedLawyers: z.array(objectIdSchema).default([]),
  })
  .strict();

// ==========================================
// 2. UPDATE CLIENT PROFILE SCHEMA
// ==========================================
export const updateClientSchema = ClientZodSchema.omit({
  user: true, // Immutable relation account
  savedLawyers: true, // Handled separately via array manipulation push/pull endpoints
})
  .partial()
  .strict();

// ==========================================
// 3. SAVE LAWYER / BOOKMARK SCHEMA
// ==========================================
export const saveLawyerSchema = z
  .object({
    lawyerId: objectIdSchema,
  })
  .strict();

// ==========================================
// 4. CLIENT REVIEW SUBMISSION SCHEMA
// ==========================================
export const reviewSchema = z
  .object({
    rating: z.number().min(1).max(5),
    comment: z.string().trim().optional(),
    isAnonymous: z.boolean().default(false),
  })
  .strict();
