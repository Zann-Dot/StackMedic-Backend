import express from "express"
import validateIngestion from "../middleware/validateIngestion.js";
import { Project } from "../models/Project.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/projects/:projectId/dashboard", validateIngestion, async (req, res) => {
    try {
        const { projectId, loggedByClerkId } = req.projectContext;
        const project = await Project.findById(projectId);
        const projectInfo = {
            _id: project._id,
            name: project.name,
            memberCount: project.members.length
        }
        res.json({
            success: true,
            data: { projectInfo }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
export default dashboardRouter;