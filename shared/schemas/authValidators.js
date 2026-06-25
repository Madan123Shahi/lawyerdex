import z from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must not exceed 50 characters.")
    .trim(),

  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address.")
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters.")
    .max(64, "Password must not exceed 64 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address.")
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required."), // no strength rules — just presence check on login
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Current password is required." })
      .min(1, "Current password is required."),

    newPassword: z
      .string({ required_error: "New password is required." })
      .min(8, "New password must be at least 8 characters.")
      .max(64, "New password must not exceed 64 characters.")
      .regex(
        /[A-Z]/,
        "New password must contain at least one uppercase letter.",
      )
      .regex(
        /[a-z]/,
        "New password must contain at least one lowercase letter.",
      )
      .regex(/[0-9]/, "New password must contain at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "New password must contain at least one special character.",
      ),

    confirmNewPassword: z.string({
      required_error: "Please confirm your new password.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  });

// Helper validator for MongoDB ObjectIDs (24-char hex string)
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" });

// ==========================================
// 1. Sub-Schemas (Nested Documents)
// ==========================================

export const ReviewZodSchema = z.object({
  user: objectIdSchema.optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().optional(),
  isAnonymous: z.boolean().default(false),
});

export const EducationZodSchema = z.object({
  degree: z.string().trim().min(1, "Degree is required"),
  institution: z.string().trim().min(1, "Institution is required"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 5),
});

// ==========================================
// 2. Main Lawyer Schema
// ==========================================

export const LawyerZodSchema = z
  .object({
    user: objectIdSchema,
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"), // E.164 standard format

    avatar: z
      .string()
      .url("Avatar must be a valid URL")
      .or(z.literal(""))
      .default(""),
    bio: z.string().trim().default(""),

    address: z
      .object({
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        postalCode: z.string().trim().optional(),
      })
      .optional(),

    practiceAreas: z.array(z.string().trim()).default([]),
    barNumber: z.string().trim().min(1, "Bar number is required"),
    licenseUpload: z
      .string()
      .url("License upload must be a valid document URL or path"),
    category: z.string().trim().min(1, "Category is required"),

    experience: z.number().nonnegative().default(0),

    verificationStatus: z
      .enum(["pending", "verified", "rejected"])
      .default("pending"),
    rejectionReason: z.string().trim().default(""),

    rating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().int().nonnegative().default(0),
    reviews: z.array(ReviewZodSchema).default([]),

    isVerified: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    consultationFee: z.number().nonnegative().default(0),
    languages: z.array(z.string().trim()).default([]),
    education: z.array(EducationZodSchema).default([]),
  })
  .strict(); // Throws an error if client submits extra unmapped fields
