import mongoose from "mongoose";
import { Role, PaymentMethod, VehicleType } from "../../types/shared.types";

export interface IDriverInfo {
    vehicleType: VehicleType;
    isApproved: boolean;
    isSuspended: boolean;
    isOnline: boolean;
    totalEarnings: number;
    totalRides: number;
    rating: number;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
}

export interface IRiderInfo {
    cancelCount: number;
    lastCancelDate?: Date;
    preferredPaymentMethod: PaymentMethod;
}

export interface IAdminInfo {
    permissions: string[];
    lastLogin?: Date;
}

export interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
    isActive: boolean;
    isBlocked: boolean;
    driverInfo?: IDriverInfo;
    riderInfo?: IRiderInfo;
    adminInfo?: IAdminInfo;
    createdAt: Date;
    updatedAt: Date;
}
