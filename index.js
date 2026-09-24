import { connectDB } from "./db/db.connect.js";
import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import { zodResponseFormat } from "openai/helpers/zod";
import z from "zod";
import { OpenAI } from "openai/client.js";
import projectRouter from "./routes/project.route.js";
import { clerkMiddleware, getAuth } from "@clerk/express"
import webhookRouter from "./routes/webhook.js"

// connectDB();
configDotenv();
const PORT = 3000;
const app = express();
const corsConfig = {
    origin: "*",
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
app.use(webhookRouter)
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

// app.post("/api/error-log-analytics", async (req, res) => {
//     try {
//         const { rawError } = req.body;
//         const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//         if (!rawError)
//             return res.status(400).json({ error: "No error trace provided" });

//         const DiagnosticSchema = z.object({
//             errorType: z.enum([
//                 "Syntax",
//                 "Runtime",
//                 "Network",
//                 "Database",
//                 "Unknown",
//             ]),
//             codeFix: z
//                 .string()
//                 .describe("The corrected code snippet safely fixing the bug"),
//             explanation: z
//                 .string()
//                 .describe("A clear 2-sentence breakdown of what went wrong"),
//             description: z
//                 .string()
//                 .describe("A short one line description of what went wrong"),
//             title: z
//                 .string()
//                 .describe("A short title max 2-3 words justifing the error log"),
//             language: z
//                 .string()
//                 .describe("The programming language of the raw code error"),
//         });

//         const completion = await openai.chat.completions.parse({
//             model: "gpt-4o-mini",
//             messages: [
//                 {
//                     role: "system",
//                     content: `You are a senior full-stack compiler diagnostics engine. When providing code in the 'codeFix' field: 
//                             1. You MUST format it as readable, beautifully indented code. 
//                             2. Use '\\n' for every new line and explicit double spaces or tabs for nested blocks. 
//                             3. Do NOT output the code as a single-line string. 
//                             4. Send the whole corrected code as output not just the specific line that has issue.
//                             5. Check for any type of redundancy or potential bugs in the code, and return the most likely fixed output.
//                         `,
//                 },
//                 {
//                     role: "user",
//                     content: rawError,
//                 },
//             ],
//             response_format: zodResponseFormat(DiagnosticSchema, "diagnostic"),
//         });

//         const aiAnalysis = completion.choices[0].message.parsed;

//         const newLog = await errorLogModel.create({
//             ...aiAnalysis,
//             rawError,
//         });

//         res.status(201).json(newLog);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get("/api/get-error-log", async (req, res) => {
//     try {
//         const errorLog = await errorLogModel.find({});
//         if (!errorLog || errorLog === [])
//             return res.status(404).json({ error: "Error logs not found" });
//         res.json(errorLog);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


app.use("/api", projectRouter);

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});
