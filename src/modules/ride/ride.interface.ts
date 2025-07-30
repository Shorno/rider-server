import mongoose from "mongoose";
import {Role, PaymentMethod, PaymentStatus, RideStatus} from "../../types/shared.types";

export interface IFare {
    baseFare: number;
    distanceFare: number;
    totalFare: number;
    currency: string;
}

export interface IRating {
    riderRating?: number;
    driverRating?: number;
    riderComment?: string;
    driverComment?: string;
}

export interface IRejectedDriver {
    driverId: mongoose.Types.ObjectId;
    rejectReason: string;
}

export interface IRide {
    _id: mongoose.Types.ObjectId;
    riderId: mongoose.Types.ObjectId;
    driverId?: mongoose.Types.ObjectId;
    pickupLocation: String;
    destinationLocation: String;
    status: RideStatus;
    fare: IFare;
    estimatedDistance: number;
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancelledBy?: Role;
    cancellationReason?: string;
    rejectedDrivers?: IRejectedDriver[];
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    rating?: IRating;
    createdAt: Date;
    updatedAt: Date;
}