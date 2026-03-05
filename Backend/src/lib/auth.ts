import { expo } from "@better-auth/expo";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { env } from "../config/env";
import { UserModel } from "../models/user.model.js";

import { MongoClient } from "mongodb";

const client = new MongoClient(env.MONGO_URI, { family: 4 });

export const auth = betterAuth({
    database: mongodbAdapter(client.db("ecowaste")),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "citizen"
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user: any) => {
                    try {
                        const existingUser = await UserModel.findOne({ email: user.email });
                        if (!existingUser) {
                            await UserModel.create({
                                _id: user.id, // Keep IDs matching
                                name: user.name,
                                email: user.email,
                                emailVerified: user.emailVerified,
                                image: user.image,
                                role: user.role && ['citizen', 'kabadiwalla', 'municipality', 'admin'].includes(user.role)
                                    ? user.role
                                    : 'citizen',
                            });
                            console.log(`[Auth Hook] Mirrored newly registered better-auth user to Mongoose: ${user.email}`);
                        }
                    } catch (error) {
                        console.error("[Auth Hook] Error mirroring better-auth user to Mongoose:", error);
                    }
                }
            }
        }
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
        admin({
            defaultRole: "citizen",
            adminRole: "admin",
        }),
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
