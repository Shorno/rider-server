import {NextFunction, Request, Response} from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import {verifyToken} from "../utils/jwt";
import {env} from "../config/env";
import User from "../modules/user/user.model";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        return next(new AppError(
            httpStatus.UNAUTHORIZED,
            "Authorization token is required. Please provide a valid token."
        ));
    }

    const verifiedToken = verifyToken(accessToken, env.JWT_SECRET);

    const existingUser = await User.findOne({email: verifiedToken.email})

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }


    req.user = verifiedToken;


    if (!authRoles.includes(verifiedToken.role)) {
        return next(new AppError(
            httpStatus.FORBIDDEN,
            "You do not have permission to access this resource."
        ));
    }

    next()
}