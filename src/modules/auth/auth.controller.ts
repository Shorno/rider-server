import {catchAsync} from "../../utils/catchAsync";
import {sendResponse} from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import {credentialsLoginService, getNewAccessTokenService, resetPasswordService} from "./auth.service";
import {setAuthCookie} from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";

export const credentialsLogin = catchAsync(async (req, res, next) => {
    const loginInfo = await credentialsLoginService(req.body)

    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Login successful',
        data: loginInfo
    })

})

export const getNewAccessToken = catchAsync(async (req, res, next) => {

    const refreshToken = req.cookies.refreshToken;

    const tokenInfo = await getNewAccessTokenService(refreshToken)


    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Access token refreshed successfully',
        data: tokenInfo
    })

})


export const logout = catchAsync(async (req, res, next) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Logout successful',
        data: null
    })
})


export const resetPassword = catchAsync(async (req, res, next) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    if (!newPassword) {
        return next(new AppError(httpStatus.BAD_REQUEST, 'New password is required.'));
    }

    await resetPasswordService(oldPassword, newPassword, decodedToken);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password reset successful',
        data: null
    })
})