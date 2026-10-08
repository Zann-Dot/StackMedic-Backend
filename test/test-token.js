import { clerkClient } from "@clerk/express";
import express from "express"
const testRouter = express.Router();

testRouter.post("/test-token", async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'userId is required' });
        const session = await clerkClient.sessions.createSession({ userId })
        const tokenResponse = await clerkClient.sessions.getToken(session.id);
        res.json({ token: tokenResponse.jwt })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default testRouter