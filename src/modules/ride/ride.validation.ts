import {z} from "zod";
import {PaymentMethod} from "../../types/shared.types";

export const createRideRequestZodSchema = z.object({
    pickupLocation: z.string().min(1, {message: "Pickup location cannot be empty"}),
    destinationLocation: z.string().min(1, {message: "Destination location cannot be empty"}),
    estimatedDistance: z.number().min(0.1, {message: "Distance must be at least 0.1 km"}),
    paymentMethod: z.enum(PaymentMethod)
});

export const cancelRideZodSchema = z.object({
    cancellationReason: z.string().min(5, {message: "Cancellation reason must be at least 5 characters"})
});

export const rateRideZodSchema = z.object({
    rating: z.number().min(1, {message: "Rating must be at least 1"}).max(5, {message: "Rating cannot exceed 5"}),
    comment: z.string().optional()
});


export const rejectRideZodSchema = z.object({
    rejectReason: z.string({error: "Reject reason is required"}).min(5, {message: "Reject reason must be at least 5 characters"})
});




export type CreateRideRequestInput = z.infer<typeof createRideRequestZodSchema>;
export type CancelRideInput = z.infer<typeof cancelRideZodSchema>;
export type RateRideInput = z.infer<typeof rateRideZodSchema>;
export type RejectRideInput = z.infer<typeof rejectRideZodSchema>;
