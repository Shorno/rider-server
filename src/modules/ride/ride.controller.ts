import { Request, Response } from 'express';

import { RideService } from './ride.service';
import AppError from '../../errorHelpers/AppError';
import {sendResponse} from "../../utils/sendResponse";
import {catchAsync} from "../../utils/catchAsync";

const createRideRequest = catchAsync(async (req: Request, res: Response) => {
    const riderId = req.user.id;

    if (!riderId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.createRideRequest(riderId, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Ride request created successfully',
        data: result,
    });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
    const riderId = req.user.id;
    const { rideId } = req.params;

    if (!riderId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.cancelRide(rideId, riderId, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride cancelled successfully',
        data: result,
    });
});





const getRideHistory = catchAsync(async (req: Request, res: Response) => {
    const riderId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!riderId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.getRideHistory(riderId, page, limit);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride history retrieved successfully',
        data: result,
    });
});




const acceptRideRequest = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.user.id;
    const { rideId } = req.params;

    if (!driverId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.acceptRideRequest(rideId, driverId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride request accepted successfully',
        data: result,
    });
});

const rejectRideRequest = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.user.id;
    const { rideId } = req.params;

    if (!driverId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.rejectRideRequest(rideId, driverId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride request rejected successfully',
        data: result,
    });
});


const pickUpRide  = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.user.id;
    const { rideId } = req.params;

    if (!driverId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.pickUpRide(rideId, driverId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride picked up successfully',
        data: result,
    });

})

const startRide  = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.user.id;
    const { rideId } = req.params;

    if (!driverId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.startRide(rideId, driverId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride started successfully',
        data: result,
    });

})
const completeRide = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.user.id;
    const { rideId } = req.params;
    if (!driverId) {
        throw new AppError(401, "User not authenticated");
    }
    const result = await RideService.completeRide(rideId, driverId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride completed successfully',
        data: result,
    });
});



const rateRide = catchAsync(async (req: Request, res: Response) => {
    const riderId = req.user?.userId;
    const { rideId } = req.params;

    if (!riderId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await RideService.rateRide(rideId, riderId, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Ride rated successfully',
        data: result,
    });
});

export const RideController = {
    createRideRequest,
    cancelRide,
    getRideHistory,
    rateRide,
    acceptRideRequest,
    rejectRideRequest,
    pickUpRide,
    startRide,
    completeRide
};
