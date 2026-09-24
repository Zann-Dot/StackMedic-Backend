import { clerkClient, getAuth } from "@clerk/express";
import express from "express"
import { Project } from "../models/Project.js";
const projectRouter = express.Router();

projectRouter.post("/projects", async (req, res) => {
    try {
        const { isAuthenticated, userId } = getAuth(req)
        const { name, description } = req.body;
        if (!name || !description)
            return res.status(404).json({ error: "Please provide metadata for project." });

        if (!isAuthenticated || !userId)
            return res.status(403).json({ error: "Unauthorized" });

        const email = (await clerkClient.users.getUser(userId)).primaryEmailAddress

        const members = [
            {
                clerkUserId: userId,
                email,
                role: "admin"
            }
        ]

        const metadata = await Project.create({
            name,
            description,
            ownerClerkId: userId,
            apiKey: "daa",
            members
        })

        res.json({
            success: true,
            message: "Project created successfully",
            metadata
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default projectRouter