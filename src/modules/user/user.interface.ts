import mongoose from "mongoose";

export enum Role {
    ADMIN = 'admin',
    RIDER = 'rider',
    DRIVER = 'driver'
}

export enum VehicleType {
    CAR = 'car',
    BIKE = 'bike',
    AUTO = 'auto'
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    WALLET = 'wallet'
}

export interface ILocation {
    latitude: number;
    longitude: number;
}

export interface IDriverInfo {
    vehicleType: VehicleType;
    vehicleModel: string;
    vehiclePlate: string;
    licenseNumber: string;
    isApproved: boolean;
    isSuspended: boolean;
    isOnline: boolean;
    currentLocation?: ILocation;
    totalEarnings: number;
    totalRides: number;
    rating: number;
    currentRideId?: mongoose.Types.ObjectId;
}

export interface IRiderInfo {
    totalRides: number;
    currentRideId?: mongoose.Types.ObjectId;
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