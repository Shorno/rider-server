import {env} from "../config/env";
import {generateToken, verifyToken} from "./jwt";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import {IUser} from "../modules/user/user.interface";
import User from "../modules/user/user.model";

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        id: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload, env.JWT_SECRET, env.JWT_EXPIRES_IN);

    const refreshToken = generateToken(jwtPayload, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES_IN);

    return {
        accessToken,
        refreshToken,
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken : string) => {
    if (!refreshToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token is required.');
    }

    const decoded = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);

    const existingUser = await User.findById(decoded.id);

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    const jwtPayload = {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
    }



    return generateToken(jwtPayload, env.JWT_SECRET, env.JWT_EXPIRES_IN)

}