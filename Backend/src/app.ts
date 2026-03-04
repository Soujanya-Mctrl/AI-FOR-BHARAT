import express from 'express';
// @ts-ignore
import cookieParser from "cookie-parser";
import facilitiesRouter from "./routes/facilities.routes.js";
import pickupRouter from "./routes/pickup.routes.js";
import reportRouter from "./routes/report.routes.js";
import rewardsRouter from "./routes/rewards.routes.js";
import userRouter from "./routes/user.routes.js";
// @ts-ignore
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', userRouter);
app.use('/report', reportRouter);
app.use('/facilities', facilitiesRouter);
app.use('/api', rewardsRouter);
app.use('/api/pickups', pickupRouter);

import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

app.all("/api/auth/*splat", toNodeHandler(auth));

export default app;
