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
});

export const updateDriverStatusSchema = z.object({
    action: z.enum(["approve", "suspend", "activate"], {error: "Action must be one of 'approve', 'suspend', or 'activate'"}),
});
export const updateUserStatusSchema = z.object({
    action: z.enum(["block", "unblock"], {error: "Action must be one of 'block' or 'unblock'"}),
});


export type CreateAdminInput = z.infer<typeof createAdminZodSchema>;
export type UpdateDriverStatusInput = z.infer<typeof updateDriverStatusSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
