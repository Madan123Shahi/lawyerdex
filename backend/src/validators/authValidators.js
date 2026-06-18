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
