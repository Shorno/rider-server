import {NextFunction, Request, Response} from 'express';
import httpStatus from "http-status-codes"
import {createDriverService, updateDriverAvailabilityService} from "./driver.service";
import {catchAsync} from "../../utils/catchAsync";
import {sendResponse} from "../../utils/sendResponse";

export const createDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await createDriverService(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Driver registered successfully. Pending approval.',
        data: result
    })
})


export const updateDriverAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.id;

    const updatedDriverInfo = await updateDriverAvailabilityService(driverId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Driver availability updated successfully.`,
        data: updatedDriverInfo
    });
})