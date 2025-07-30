import {User} from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {CreateDriverInput, UpdateDriverAvailabilityInput, GetEarningsHistoryInput} from "./driver.validation";
import {Role, RideStatus, PaymentStatus} from "../../types/shared.types";
import {Ride} from "../ride/ride.model";
import mongoose from "mongoose";


export const createDriverService = async (payload: CreateDriverInput) => {
    const {
        name,
        email,
        password,
        phone,
        vehicleType,
        isActive,
        isBlocked
    } = payload;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this email address.')
    }

    const existingPhone = await User.findOne({phone});
    if (existingPhone) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this phone number.')
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const driverData = {
        name,
        email,
        password: hashedPassword,
        phone,
        role: Role.DRIVER,
        isActive,
        isBlocked,
        driverInfo: {
            vehicleType,
            isApproved: false,
            isSuspended: false,
            isOnline: false,
            totalEarnings: 0,
            totalRides: 0,
            rating: 5,
        }
    };

    const newDriver = await User.create(driverData);
    const driverObject = newDriver.toObject();
    const {password: _, ...driverWithoutPassword} = driverObject;
    return {
        user: driverWithoutPassword
    };
}


export const updateDriverAvailabilityService = async (driverId: string, payload: UpdateDriverAvailabilityInput) => {


    const driver = await User.findByIdAndUpdate(
        driverId,
        {'driverInfo.isOnline': payload.isOnline},
        {new: true}
    );

    if (!driver) {
        throw new AppError(httpStatus.NOT_FOUND, 'Driver not found');
    }

    return driver;
};


export const getDriverEarningsHistoryService = async (driverId: string, queryParams: GetEarningsHistoryInput) => {
    const { page = 1, limit = 10, startDate, endDate } = queryParams;
    const skip = (page - 1) * limit;

    let dateFilter: any = {};
    if (startDate || endDate) {
        dateFilter.completedAt = {};
        if (startDate) dateFilter.completedAt.$gte = startDate;
        if (endDate) dateFilter.completedAt.$lte = endDate;
    }

    const baseQuery = {
        driverId: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.COMPLETED,
        paymentStatus: PaymentStatus.COMPLETED,
        ...dateFilter
    };

    const rides = await Ride.find(baseQuery)
        .populate('riderId', 'name phone')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalRides = await Ride.countDocuments(baseQuery);

    const earningsSummary = await calculateEarningsSummary(driverId, dateFilter);

    const formattedRides = rides.map(ride => ({
        rideId: ride._id,
        rider: ride.riderId,
        pickupLocation: ride.pickupLocation,
        destinationLocation: ride.destinationLocation,
        distance: ride.estimatedDistance,
        fare: ride.fare,
        completedAt: ride.completedAt,
        paymentMethod: ride.paymentMethod,
        rating: ride.rating?.driverRating
    }));

    return {
        rides: formattedRides,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalRides / limit),
            totalRides,
            hasNextPage: page < Math.ceil(totalRides / limit),
            hasPrevPage: page > 1
        },
        summary: earningsSummary
    };
};

export const calculateEarningsSummary = async (driverId: string, dateFilter: any = {}) => {
    const baseQuery = {
        driverId: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.COMPLETED,
        paymentStatus: PaymentStatus.COMPLETED,
        ...dateFilter
    };

    const result = await Ride.aggregate([
        { $match: baseQuery },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$fare.totalFare" },
                totalRides: { $sum: 1 },
                averageFare: { $avg: "$fare.totalFare" },
                totalDistance: { $sum: "$estimatedDistance" }
            }
        }
    ]);

    const summary = result[0] || {
        totalEarnings: 0,
        totalRides: 0,
        averageFare: 0,
        totalDistance: 0
    };

    return {
        totalEarnings: summary.totalEarnings,
        totalRides: summary.totalRides,
        averageFare: Math.round(summary.averageFare * 100) / 100,
        totalDistance: summary.totalDistance
    };
};
