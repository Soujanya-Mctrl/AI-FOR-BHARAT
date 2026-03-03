import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

// We need an underlying MongoClient instance for the MongoDB adapter
const getDb = () => {
    // Depending on when this is called, mongoose.connection may not be ready
    // So we access the client only when methods are invoked
    if (mongoose.connection.readyState !== 1) {
        throw new Error("Database not connected yet");
    }
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database instance is null");
    return db;
};

export const auth = betterAuth({
    database: mongodbAdapter(mongoose.connection.getClient().db() as unknown as import("mongodb").Db),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    plugins: [
        expo(),
    ],
    trustedOrigins: [
        "ecowaste://",
        "exp://",
        "http://localhost:8081"
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "citizen"
            },
            reliabilityScore: {
                type: "number",
                required: false,
                defaultValue: 100
            },
            citizenProfile: {
                type: "string", // JSON stringified for simplicity in better-auth storage
                required: false,
            },
            kabadiwalaProfile: {
                type: "string",
                required: false,
            },
            municipalityProfile: {
                type: "string",
                required: false,
            }
        }
    }
});
