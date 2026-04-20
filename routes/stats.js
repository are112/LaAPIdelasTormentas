import express from "express";
import { stats } from "../controllers/statsController.js";

const router = express.Router();

// GET /stats
router.get("/", stats);

export default router;
