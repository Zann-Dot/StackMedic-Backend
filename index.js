import { connectDB } from "./db/db.connect.js";
import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import { zodResponseFormat } from "openai/helpers/zod";
import z from "zod";
import { OpenAI } from "openai/client.js";
import errorLogModel from "./models/errorLog.model.js";
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());
connectDB();
configDotenv();
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/error-log-analytics", async (req, res) => {
    try {
        const { rawError } = req.body;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        if (!rawError)
            return res.status(400).json({ error: "No error trace provided" });

        const DiagnosticSchema = z.object({
            errorType: z.enum([
                "Syntax",
                "Runtime",
                "Network",
                "Database",
                "Unknown",
            ]),
            codeFix: z
                .string()
                .describe("The corrected code snippet safely fixing the bug"),
            explanation: z
                .string()
                .describe("A clear 2-sentence breakdown of what went wrong"),
        });

        const completion = await openai.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a senior full-stack compiler diagnostics engine. Strip conversational filler and provide strict code corrections.",
                },
                {
                    role: "user",
                    content: rawError,
                },
            ],
            response_format: zodResponseFormat(DiagnosticSchema, "diagnostic"),
        });

        const aiAnalysis = completion.choices[0].message.parsed;

        const newLog = await errorLogModel.create({
            ...aiAnalysis,
            rawError,
        });

        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});
