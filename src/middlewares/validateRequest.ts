import {z} from "zod";
import {NextFunction, Request, Response} from "express";

export const validateRequest = (schema: z.ZodType) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await schema.safeParseAsync(req.body);
        const errors = result.error?.issues.map((error) => error.message)
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: errors
            });
        }
        req.body = result.data;
        next();
    } catch (error) {
        next(error)
    }
}