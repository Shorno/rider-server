import {Response} from "express";

interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {

    if (tokenInfo.accessToken){
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }

    if (tokenInfo.refreshToken){
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }

}