import {z} from "zod";

export const createAdminZodSchema = z.object({
    name: z.string({error: "Name is required"})
        .min(2, {message: "Name must be at least 2 characters long"})
        .max(50, {message: "Name cannot exceed 50 characters"}),
    email: z.email({message: "Invalid email address"}),
    password: z.string({error: "Password is required"})
        .min(6, {message: "Password must be at least 6 characters long"}),
    phone: z.string({error: "Phone number is required"})
        .regex(/^[0-9]{10,15}$/, {message: "Please enter a valid phone number"}),
    adminToken: z.string({error: "Admin token is required"}),
    permissions: z.array(z.string()).min(1, {message: "At least one permission is required"}),
});

export type CreateAdminInput = z.infer<typeof createAdminZodSchema>;
