import { getAuth } from "@clerk/express";
import { Project } from "../models/Project.js";

async function validateIngestion(req, res, next) {
    try {
        const apiKey = req.headers["x-project-api-key"];
        if (apiKey) {
            const project = await Project.findOne({ apiKey });
            if (!project)
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid API Key" });

            req.projectContext = {
                projectId: project._id,
                loggedByClerkId: "system_automated",
            };

            return next();
        }

        const { userId } = getAuth(req);
        const { projectId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Missing API Key or valid user session.",
            });
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "projectId is required in the body for manual logging.",
            });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Project not found" });
        }

        const isMember = project.members.some((m) => m.clerkUserId === userId);
        if (!isMember) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Forbidden: You are not a member of this project.",
                });
        }

        req.projectContext = {
            projectId: project._id,
            loggedByClerkId: userId,
        };

        return next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default validateIngestion;
