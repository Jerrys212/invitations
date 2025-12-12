import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import type { Request, Response } from "express";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import guestRouter from "./routes/guestRouter";

dotenv.config();

connectDB();

const app = express();
app.use(cors(corsConfig));

app.use(express.json());
app.use("/health", (req: Request, res: Response) => {
    return res.json({ code: 200, message: "API funcionando correctamente", data: [] });
});
app.use("/api/invites", guestRouter);

export default app;
