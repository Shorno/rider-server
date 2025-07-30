import {z} from "zod";
import {VehicleType} from "../../types/shared.types";

export const createDriverZodSchema = z.object({
    name: z.string({error: "Name is required"})
        .min(2, {message: "Name must be at least 2 characters long"})
        .max(50, {message: "Name cannot exceed 50 characters"}),
    email: z.email({message: "Invalid email address"}),
    password: z.string({error: "Password is required"})
        .min(6, {message: "Password must be at least 6 characters long"}),
    phone: z.string({error: "Phone number is required"})
        .regex(/^[0-9]{10,15}$/, {message: "Please enter a valid phone number"}),
    vehicleType: z.enum([VehicleType.CAR, VehicleType.BIKE, VehicleType.AUTO], {error: "Vehicle type is required"}),
    vehicleModel: z.string({error: "Vehicle model is required"})
        .min(2, {message: "Vehicle model must be at least 2 characters long"}),
    vehiclePlate: z.string({error: "Vehicle plate number is required"})
        .min(3, {message: "Vehicle plate must be at least 3 characters long"}),
    licenseNumber: z.string({error: "License number is required"})
        .min(5, {message: "License number must be at least 5 characters long"}),
    isActive: z.boolean().optional().default(true),
    isBlocked: z.boolean().optional().default(false),
});


export const updateDriverAvailabilitySchema = z.object({
    isOnline: z.boolean({error: "Availability status is required"})
})


export const getEarningsHistorySchema = z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
    startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});


export type UpdateDriverAvailabilityInput = z.infer<typeof updateDriverAvailabilitySchema>;
export type CreateDriverInput = z.infer<typeof createDriverZodSchema>;
export type GetEarningsHistoryInput = z.infer<typeof getEarningsHistorySchema>;
