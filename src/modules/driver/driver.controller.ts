import {NextFunction, Request, Response} from 'express';
import httpStatus from "http-status-codes"
import {createDriverService, getAllDriversService} from "./driver.service";
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

export const getAllDrivers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAllDriversService();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Drivers fetched successfully',
        data: result.data,
        metadata: result.metadata
    })
})
