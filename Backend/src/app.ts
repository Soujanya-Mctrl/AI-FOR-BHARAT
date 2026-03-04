import express from 'express';
// @ts-ignore
import cookieParser from "cookie-parser";
import facilitiesRouter from "./routes/facilities.routes";
import reportRouter from "./routes/report.routes";
import rewardsRouter from "./routes/rewards.routes";
import userRouter from "./routes/user.routes";
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

import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';

app.all("/api/auth/*", toNodeHandler(auth));

export default app;
