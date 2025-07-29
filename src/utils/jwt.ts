import jwt, {SignOptions} from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const generateToken = (payload: any, secret: string, expiresIn: string): string => {
    if (!payload || !secret || !expiresIn) {
        throw new Error("User ID, secret, and expiration time are required to generate a token.");
    }

    return jwt.sign(payload, secret, {expiresIn} as SignOptions);
}

export const verifyToken = (token: string, secret: string): any => {
    if (!token || !secret) {
        throw new Error("Token and secret are required to verify a token.");
    }

    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token.");
    }
}