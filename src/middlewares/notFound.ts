import {Response, Request} from "express";
import httpStatus from "http-status-codes";

export const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        error: "The requested resource could not be found",
    })
}