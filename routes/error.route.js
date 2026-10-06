import z from "zod";
import express from "express";
import { OpenAI } from "openai/client.js";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { ErrorLog } from "../models/ErrorLog.js";
import { generateErrorHash } from "../utilis/generateErrorHash.js";
const errorRouter = express.Router();

errorRouter.post("/errors/log", async (req, res) => {
    try {
        const { rawTrace, loggedByClerkId, project, status } = req.body;
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

        if (!rawTrace)
            return res.status(400).json({ error: "No error trace provided" });

        const errorHash = generateErrorHash(rawTrace);

        const DiagnosticSchema = z.object({
            title: z
                .string()
                .describe("A short title max 2-3 words justifing the error log"),
            errorCategory: z
                .enum([
                    "Database Validation",
                    "CORS",
                    "Type Error",
                    "Auth",
                    "API Failure",
                    "Syntax Error",
                    "Unknown",
                ])
                .default("Unknown"),
            remediation: z
                .string()
                .describe("The corrected code snippet safely fixing the bug"),
        });

        const completion = await openai.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a senior full-stack compiler diagnostics engine. When providing code in the 'codeFix' field: 
                            1. You MUST format it as readable, beautifully indented code. 
                            2. Use '\\n' for every new line and explicit double spaces or tabs for nested blocks. 
                            3. Do NOT output the code as a single-line string. 
                            4. Send the whole corrected code as output not just the specific line that has issue.
                            5. Check for any type of redundancy or potential bugs in the code, and return the most likely fixed output.
                        `,
                },
                {
                    role: "user",
                    content: rawError,
                },
            ],
            response_format: zodResponseFormat(DiagnosticSchema, "diagnostic"),
        });

        const aiAnalysis = completion.choices[0].message.parsed;
        const data = await ErrorLog.create({
            ...aiAnalysis,
            rawTrace,
            loggedByClerkId,
            project,
            status,
            errorHash,
        });

        res.status(201).json({
            success: true,
            data,
            deduplicationAlert,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default errorRouter;
