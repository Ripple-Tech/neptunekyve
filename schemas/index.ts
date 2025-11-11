import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER,]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
}).refine((data) => {
    if (data.password && !data.newPassword) {
        return false;
    }
    
    return true;
}, {
    message: "New password is required!",
    path: ["newPassword"]
}).refine((data) => {
    if (data.newPassword && !data.password) {
        return false;
    }
    
    return true;
}, {
    message: "Password is required!",
    path: ["password"]
})

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string()),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 character required",
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum of 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required" 
    })
});
export const ImageSchema = z.object({
  color: z.string().min(1, "Image color is required"),
  colorCode: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
  image: z.string().url("Image URL must be a valid URL"),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  vendor: z.string().optional().nullable(),
  price: z.union([z.number(), z.string()]).refine((val) => {
    const n = typeof val === "string" ? Number(val) : val;
    return Number.isFinite(n) && n >= 0;
  }, "Price must be a non-negative number"),
  brand: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  inStock: z.boolean().default(true),
  images: z
    .array(ImageSchema)
    .min(1, "At least one image is required")
    .max(5, "You can upload up to 5 images"),
});