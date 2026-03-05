import { expo } from "@better-auth/expo";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { env } from "../config/env";

const client = new MongoClient(env.MONGO_URI);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "citizen",
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
    plugins: [
        expo(),
    ],
    trustedOrigins: [
        "ecowaste://",
        ...(env.NODE_ENV === "development" ? [
            "exp://",
            "exp://**",
            "exp://192.168.*.*:*/**"
        ] : [])
    ]
});
