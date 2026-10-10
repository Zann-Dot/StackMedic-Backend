import { connectDB } from "./db/db.connect.js";
import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import projectRouter from "./routes/project.route.js";
import { clerkMiddleware } from "@clerk/express";
import webhookRouter from "./routes/webhook.js";
import errorRouter from "./routes/error.route.js";
import testRouter from "./test/test-token.js";
import dashboardRouter from "./routes/dashboard-report.route.js";

// connectDB();
configDotenv();
const PORT = 3000;
const app = express();
const corsConfig = {
    origin: "*",
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(webhookRouter);
app.use(express.json());
app.use(cors(corsConfig));
app.use(clerkMiddleware());
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/", async (req, res) => {
    res.json({ message: "Hello this is Stack-Medic Server!" })
})
app.use("/api", projectRouter);
app.use("/api", errorRouter);
app.use("/api", dashboardRouter);
app.use("/api", testRouter);
app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});
