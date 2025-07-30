import mongoose from "mongoose";
import { Ride } from "./ride.model";
import { IRide } from "./ride.interface";
import {CreateRideRequestInput, CancelRideInput, RateRideInput, RejectRideInput} from "./ride.validation";
import { RideStatus, Role, PaymentStatus } from "../../types/shared.types";
import AppError from "../../errorHelpers/AppError";

const calculateFare = (distance: number) => {
    const baseFare = 50;
    const perKmRate = 15;
    const distanceFare = distance * perKmRate;
    const totalFare = baseFare + distanceFare;

    return {
        baseFare,
        distanceFare,
        totalFare,
        currency: 'BDT'
    };
};

const createRideRequest = async (riderId: string, payload: CreateRideRequestInput): Promise<IRide> => {
    const activeRide = await Ride.findOne({
        riderId: new mongoose.Types.ObjectId(riderId),
        status: { $in: [RideStatus.REQUESTED, RideStatus.ACCEPTED, RideStatus.IN_PROGRESS] }
    });

    if (activeRide) {
        throw new AppError(400, "You already have an active ride request");
    }

    const fare = calculateFare(payload.estimatedDistance);

    const rideData = {
        riderId: new mongoose.Types.ObjectId(riderId),
        pickupLocation: payload.pickupLocation,
        destinationLocation: payload.destinationLocation,
        estimatedDistance: payload.estimatedDistance,
        paymentMethod: payload.paymentMethod,
        fare,
        status: RideStatus.REQUESTED,
        paymentStatus: PaymentStatus.PENDING,
        requestedAt: new Date()
    };

    const ride = await Ride.create(rideData);
    const populatedRide = await Ride.findById(ride._id).populate('riderId', 'name phone email').lean();

    if (!populatedRide) {
        throw new AppError(500, "Failed to create ride request");
    }

    return populatedRide;
};

const cancelRide = async (rideId: string, riderId: string, payload: CancelRideInput): Promise<IRide> => {
    const ride = await Ride.findOne({
        _id: new mongoose.Types.ObjectId(rideId),
        riderId: new mongoose.Types.ObjectId(riderId)
    });

    if (!ride) {
        throw new AppError(404, "Ride not found");
    }

    if (ride.status === RideStatus.COMPLETED) {
        throw new AppError(400, "Cannot cancel a completed ride");
    }

    if (ride.status === RideStatus.CANCELLED) {
        throw new AppError(400, "Ride is already cancelled");
    }

    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
            status: RideStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelledBy: Role.RIDER,
            cancellationReason: payload.cancellationReason
        },
        { new: true }
    ).populate('riderId driverId', 'name phone email').lean();

    return updatedRide!;
};

const acceptRideRequest = async (rideId: string, driverId: string): Promise<IRide> => {
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new AppError(404, "Ride request not found");
    }

    if (ride.status !== RideStatus.REQUESTED) {
        throw new AppError(400, "This ride request is no longer available");
    }

    if (ride.rejectedDrivers && ride.rejectedDrivers.some(rejected => rejected.driverId.toString() === driverId)) {
        throw new AppError(400, "You have already rejected this ride request");
    }

    if (ride.driverId) {
        throw new AppError(400, "This ride has already been accepted by another driver");
    }

    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
            driverId: new mongoose.Types.ObjectId(driverId),
            status: RideStatus.ACCEPTED,
            acceptedAt: new Date()
        },
        { new: true }
    ).populate('riderId driverId', 'name phone email').lean();

    if (!updatedRide) {
        throw new AppError(500, "Failed to accept ride request");
    }

    return updatedRide;
};

const rejectRideRequest = async (rideId: string, driverId: string, payload: RejectRideInput): Promise<IRide> => {
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new AppError(404, "Ride request not found");
    }

    if (ride.status !== RideStatus.REQUESTED) {
        throw new AppError(400, "This ride request is no longer available");
    }

    if (ride.rejectedDrivers && ride.rejectedDrivers.some(rejected => rejected.driverId.toString() === driverId)) {
        throw new AppError(400, "You have already rejected this ride request");
    }

    if (ride.driverId) {
        throw new AppError(400, "This ride has already been accepted by another driver");
    }

    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
            $push: {
                rejectedDrivers: {
                    driverId: new mongoose.Types.ObjectId(driverId),
                    rejectReason: payload.rejectReason
                }
            }
        },
        { new: true }
    ).populate('riderId', 'name phone email').lean();

    if (!updatedRide) {
        throw new AppError(500, "Failed to process ride rejection");
    }

    return updatedRide;
};


const getRideHistory = async (riderId: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const rides = await Ride.find({ riderId: new mongoose.Types.ObjectId(riderId) })
        .populate('driverId', 'name phone email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Ride.countDocuments({ riderId: new mongoose.Types.ObjectId(riderId) });

    return {
        rides,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRides: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
};

// Get ride by ID
const getRideById = async (rideId: string, riderId: string): Promise<IRide> => {
    const ride = await Ride.findOne({
        _id: new mongoose.Types.ObjectId(rideId),
        riderId: new mongoose.Types.ObjectId(riderId)
    }).populate('driverId', 'name phone email').lean();

    if (!ride) {
        throw new AppError(404, "Ride not found");
    }

    return ride;
};

const pickUpRide = async (rideId: string, driverId: string): Promise<IRide> => {
    const ride = await Ride.findOne({
        _id: new mongoose.Types.ObjectId(rideId),
        driverId: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.ACCEPTED
    });

    if (!ride) {
        throw new AppError(404, "Ride not found or not accepted by this driver");
    }
    if (ride.status !== RideStatus.ACCEPTED) {
        throw new AppError(400, "Ride must be in accepted status to pick up");
    }
    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
            status: RideStatus.PICKED_UP,
            pickedUpAt: new Date()
        },
        { new: true }
    ).populate('driverId riderId', 'name phone email').lean();

    if (!updatedRide) {
        throw new AppError(500, "Failed to update ride status to picked up");
    }
    return updatedRide;
}

const startRide = async (rideId: string, driverId: string): Promise<IRide> => {
    const ride = await Ride.findOne({
        _id: new mongoose.Types.ObjectId(rideId),
        driverId: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.PICKED_UP
    });

    if (!ride) {
        throw new AppError(404, "Ride not found or not picked up by this driver");
    }
    if (ride.status !== RideStatus.PICKED_UP) {
        throw new AppError(400, "Ride must be in picked up status to start it");
    }
    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
            status: RideStatus.IN_PROGRESS,
            pickedUpAt: new Date()
        },
        { new: true }
    ).populate('driverId riderId', 'name phone email').lean();

    if (!updatedRide) {
        throw new AppError(500, "Failed to update ride status to in progress");
    }
    return updatedRide;
}

const completeRide = async (rideId: string, driverId: string): Promise<IRide> => {
    const ride = await Ride.findOne({
        _id: new mongoose.Types.ObjectId(rideId),
        driverId: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.IN_PROGRESS
    });

    if (!ride) {
        throw new AppError(404, "Ride not found or not in progress by this driver");
    }

    if (ride.status !== RideStatus.IN_PROGRESS) {
        throw new AppError(400, "Ride must be in progress to complete it");
    }

    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
            status: RideStatus.COMPLETED,
            completedAt: new Date(),
            paymentStatus: PaymentStatus.COMPLETED
        },
        { new: true }
    ).populate('driverId riderId', 'name phone email').lean();

    if (!updatedRide) {
        throw new AppError(500, "Failed to complete ride");
    }

    return updatedRide;
};

const rateRide = async (rideId: string, riderId: string, payload: RateRideInput): Promise<IRide> => {
    const ride = await Ride.findOne({
        _id: new mongoose.Types.ObjectId(rideId),
        riderId: new mongoose.Types.ObjectId(riderId)
    });

    if (!ride) {
        throw new AppError(404, "Ride not found");
    }

    if (ride.status !== RideStatus.COMPLETED) {
        throw new AppError(400, "Can only rate completed rides");
    }

    if (ride.rating?.riderRating) {
        throw new AppError(400, "You have already rated this ride");
    }

    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        {
            $set: {
                "rating.riderRating": payload.rating,
                "rating.riderComment": payload.comment
            }
        },
        { new: true }
    ).populate('driverId', 'name phone email').lean();

    return updatedRide!;
};

export const RideService = {
    createRideRequest,
    cancelRide,
    getRideHistory,
    getRideById,
    rateRide,
    acceptRideRequest,
    rejectRideRequest,
    pickUpRide,
    startRide,
    completeRide
};
