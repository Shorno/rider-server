import {z} from "zod";
import {Role} from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string({error: "Name is required"})
        .min(2, {message: "Name must be at least 2 characters long"})
        .max(50, {message: "Name cannot exceed 50 characters"}),
    email: z.email({message: "Invalid email address"}),
    password: z.string({error: "Password is required"})
        .min(6, {message: "Password must be at least 6 characters long"}),
    phone: z.string({error: "Phone number is required"})
        .regex(/^[0-9]{10,15}$/, {message: "Please enter a valid phone number"}),
    role: z.enum([Role.RIDER, Role.DRIVER, Role.ADMIN], {error: "Role is required"}).default(Role.RIDER),
    isActive: z.boolean().optional().default(true),
    isBlocked: z.boolean().optional().default(false),
});

export type CreateUserInput = z.infer<typeof createUserZodSchema>;

