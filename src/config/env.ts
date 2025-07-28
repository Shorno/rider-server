import dotenv from "dotenv";

dotenv.config()

interface Env {
    PORT: string
    MONGODB_URI: string
    NODE_ENV: "development" | "production"
}

const loadEnv = (): Env => {
    const requiredEnv: string[] = ["PORT", "MONGODB_URI", "NODE_ENV" ];

    requiredEnv.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
    }
}

export const env = loadEnv()