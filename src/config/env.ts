import dotenv from "dotenv";

dotenv.config()

interface Env {
    PORT: string
    MONGODB_URI: string
    NODE_ENV: "development" | "production"
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXPIRES_IN : string,
    ADMIN_TOKEN : string
}

const loadEnv = (): Env => {
    const requiredEnv: string[] = ["PORT", "MONGODB_URI", "NODE_ENV", "JWT_SECRET", "JWT_EXPIRES_IN", "JWT_REFRESH_SECRET","JWT_REFRESH_EXPIRES_IN" , "ADMIN_TOKEN"];

    requiredEnv.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
        ADMIN_TOKEN: process.env.ADMIN_TOKEN as string,
    }
}

export const env = loadEnv()