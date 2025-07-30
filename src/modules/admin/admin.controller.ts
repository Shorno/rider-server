import {Request, Response} from 'express';
import httpStatus from "http-status-codes";
import {adminSignupService, getAllUsersService, getAllDriversService, getAllRidesService} from "./admin.service";
import {catchAsync} from "../../utils/catchAsync";
import {sendResponse} from "../../utils/sendResponse";

export const adminSignup = catchAsync(async (req: Request, res: Response) => {
    const signupInfo = await adminSignupService(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Admin account created successfully',
        data: signupInfo
    });
});

export const getAllUsers = catchAsync(async (req, res) => {
    const users = await getAllUsersService();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All users fetched successfully",
        data: users,
    });
});

export const getAllDrivers = catchAsync(async (req, res) => {
    const drivers = await getAllDriversService();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All drivers fetched successfully",
        data: drivers,
    });
});

export const getAllRides = catchAsync(async (req, res) => {
    const rides = await getAllRidesService();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All rides fetched successfully",
        data: rides,
    });
});
