import express, {Application, Request, Response} from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import {isMongoConnected} from "./config/mongoose";
import {env} from "./config/env";
import {router} from "./routes";
import {globalErrorHandler} from "./middlewares/globalErrorHandler";
import {notFound} from "./middlewares/notFound";

const app: Application = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.get("/health", (req: Request, res: Response) => {
    const dbStatus = isMongoConnected()
    const response = {
        success: true,
        database: dbStatus ? "connected" : "disconnected",
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        data: {
            uptime: process.uptime(),
            environment: env.NODE_ENV,
            vercel: !!process.env.VERCEL,
            region: process.env.VERCEL_REGION || "local",
        },
    }
    res.status(200).json(response)
})

app.use("/api/v1/", router)


app.get(["/", "/api"], (req: Request, res: Response) => {
    const baseUrl = req.protocol + "://" + req.get("host")

    const response = {
        success: true,
        message: "Rider app backend API",
        timestamp: new Date().toISOString(),
        data: {
            version: "1.0.0",
            environment: env.NODE_ENV,
            baseUrl,
            endpoints: {
                health: `${baseUrl}/health`,
            },
        },
    }
    res.status(200).json(response)
})


app.use(globalErrorHandler)

app.use(notFound)


export default app;