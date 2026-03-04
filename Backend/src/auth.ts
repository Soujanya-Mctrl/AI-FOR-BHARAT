import { apiKey } from "@better-auth/api-key";
import { expo } from "@better-auth/expo";
import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/ecowaste");
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
    model: {
        user: {
            table: "users"
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            username: user.username || `${user.email.split('@')[0]}_${Math.floor(Math.random() * 1000)}`,
                            role: user.role || "user",
                        }
                    };
                }
            }
        }
    },
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
        apiKey(),
        dash({
            apiKey: process.env.BETTER_AUTH_API_KEY
        }),
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
