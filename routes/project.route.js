import { clerkClient, getAuth } from "@clerk/express";
import express from "express";
import { Project } from "../models/Project.js";

const projectRouter = express.Router();

projectRouter.post("/projects", async (req, res) => {
    try {
        const { isAuthenticated } = getAuth(req);
        const { name, description, userId } = req.body;
        if (!name || !description)
            return res
                .status(404)
                .json({ error: "Please provide metadata for project." });

        // if (!isAuthenticated || !userId)
        //     return res.status(403).json({ error: "Unauthorized" });

        const email = (await clerkClient.users.getUser(userId)).primaryEmailAddress
            .emailAddress;

        const members = [
            {
                clerkUserId: userId,
                email,
                role: "admin",
            },
        ];

        const metadata = await Project.create({
            name,
            description,
            ownerClerkId: userId,
            members,
        });

        res.json({
            success: true,
            message: "Project created successfully",
            metadata,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

projectRouter.post("/projects/:projectId/members", async (req, res) => {
    try {
        const { userId, email, role } = req.body;
        if (!email || !role)
            return res
                .status(404)
                .json({ error: "Member details was not provided." });

        const project = await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                $push: {
                    members: {
                        clerkUserId: userId,
                        email,
                        role,
                    },
                },
            },
            { new: true, runValidators: true },
        );

        res.json({
            success: true,
            message: "Member added successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default projectRouter;
