import express from "express";
import validateIngestion from "../middleware/validateIngestion.js";
import dateFilter from "../middleware/date-range-filter.js";
import { ErrorLog } from "../models/ErrorLog.js";

const dashboardRouter = express.Router();
dashboardRouter.use(dateFilter);

dashboardRouter.get(
    "/reports/pipeline",
    validateIngestion,
    async (req, res) => {
        try {
            const startDate = req.dateFilter.$gte;
            const endDate = req.dateFilter.$lte;
            const [report] = await ErrorLog.aggregate([
                {
                    $match: {
                        $expr: {
                            $gte: [{ $createdAt }, startDate],
                            $lte: [{ $createdAt }, endDate],
                        },
                    },
                    $group: {
                        _id: null,
                        totalErrorsLogged: { $sum: 1 },
                        unresolvedCount: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "unresolved"] }, 1, 0],
                            },
                        },
                        resolvedCount: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "resolved"] }, 1, 0],
                            },
                        },
                    },
                    $project: {
                        _id: 0,
                    },
                },
            ]);
            if (!report)
                return res.status(400).json({ error: "Cannot get pipeline data." });
            res.json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
);
export default dashboardRouter;
