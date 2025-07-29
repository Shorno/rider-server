import {NextFunction, Request, Response} from 'express';
import httpStatus from "http-status-codes"
import {createUserService, getAllUsersService, updateUserService} from "./user.service";
import {catchAsync} from "../../utils/catchAsync";
import {sendResponse} from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";


export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await createUserService(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result
    })
})


export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAllUsersService();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users fetched successfully',
        data: result.data,
        metadata: result.metadata
    })
})


export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.userId) {
        return next(new Error('User ID is required for updating user information.'));
    }

    if (!req.headers.authorization) {
        return next(new AppError(httpStatus.BAD_REQUEST, 'Authorization token is required.'));
    }

    const verifiedToken = req.user;

    const payload = req.body;

    const result = await updateUserService(req.params.userId, payload, verifiedToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: result
    })
    res.status(httpStatus.NOT_IMPLEMENTED).send('Update user functionality is not implemented yet.');
})