import {NextFunction, Request, Response} from "express";
import AppError from "../errorHelpers/AppError";


export const globalErrorHandler = ((error: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode;
    let message = error.message || "Internal Server Error"

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message
    } else {
        statusCode = 500;
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: error || "Something went wrong",
    })
})