import mongoose from "mongoose"
import {env} from "./env";
let isConnected = false

export async function connectToMongoDB(): Promise<void> {
    if (isConnected) {
        return
    }

    const uri = env.MONGODB_URI
    if (!uri) {
        throw new Error("MONGODB_URI environment variable is not defined")
    }

    try {
        await mongoose.connect(uri, {
            maxPoolSize: 1,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        })

        isConnected = true
        console.log("✅ Connected to MongoDB with Mongoose")

        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to MongoDB")
        })

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err)
            isConnected = false
        })

        mongoose.connection.on("disconnected", () => {
            console.log("Mongoose disconnected")
            isConnected = false
        })
    } catch (error) {
        console.error("❌ Mongoose connection error:", error)
        isConnected = false
        throw error
    }
}

export async function disconnectFromMongoDB(): Promise<void> {
    if (isConnected) {
        await mongoose.disconnect()
        isConnected = false
        console.log("🔌 Mongoose connection closed")
    }
}

export function isMongoConnected(): boolean {
    return isConnected && mongoose.connection.readyState === 1
}
