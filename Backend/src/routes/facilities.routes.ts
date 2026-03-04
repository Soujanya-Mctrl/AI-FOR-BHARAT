import express, { Request, Response } from "express";
import { authenticate as authMiddleware } from "../middleware/authenticate";
import Facility from "../models/Facilities.model";

const router = express.Router();

// Search recyclers by address only
router.get("/search", async (req: Request, res: Response): Promise<void> => {
    try {
        const { query } = req.query;

        if (!query) {
            res.status(400).json({ error: "Query parameter is required" });
            return;
        }

        const queryString = query as string;

        // Find all facilities (e.g., for a state)
        const facilities = await Facility.find();

        // Collect matching recyclers from all facilities
        let matchedRecyclers: any[] = [];
        let state = "";
        let total = 0;

        facilities.forEach(facility => {
            const filtered = facility.recyclers.filter(r =>
                (r.address && r.address.toLowerCase().includes(queryString.toLowerCase())) ||
                (r.name && r.name.toLowerCase().includes(queryString.toLowerCase()))
            );
            if (filtered.length > 0) {
                state = facility.state;
                total += filtered.length;
                matchedRecyclers = matchedRecyclers.concat(filtered.map(r => ({
                    name: r.name,
                    address: r.address,
                    quantity: r.quantity,
                    rating: r.rating
                })));
            }
        });

        const response = {
            state,
            total,
            recyclers: matchedRecyclers
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// GET /facilities - List all facilities with filters
router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const { state, minRating } = req.query;

        const query: any = {};
        if (state) {
            query.state = state;
        }

        let facilities = await Facility.find(query);

        if (minRating) {
            const rating = Number(minRating);
            facilities = facilities.map(f => {
                const filteredRecyclers = f.recyclers.filter(r => (r.rating || 0) >= rating);
                f.recyclers = filteredRecyclers;
                return f;
            }).filter(f => f.recyclers.length > 0);
        }

        res.json({
            facilities,
            total: facilities.length
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// POST /facilities - Admin only
router.post("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        if (user.role !== 'admin') {
            res.status(403).json({ message: "Forbidden: Admin role required" });
            return;
        }

        const { state, total, recyclers } = req.body;

        if (!state || total === undefined || !recyclers) {
            res.status(400).json({ message: "Invalid input data" });
            return;
        }

        const facility = await Facility.create({
            state,
            total,
            recyclers
        });

        res.status(201).json({
            message: "Facility added successfully",
            facility
        });

    } catch (error) {
        console.error("Error creating facility:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
