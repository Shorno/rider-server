import {NextFunction, Request, Response} from 'express';
import httpStatus from "http-status-codes";
import {adminSignupService} from "./admin.service";
import {catchAsync} from "../../utils/catchAsync";
import {sendResponse} from "../../utils/sendResponse";

export const adminSignup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const signupInfo = await adminSignupService(req.body);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Admin account created successfully',
        data: signupInfo
    });
});
