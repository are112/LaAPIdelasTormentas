import express from "express";
import { grafoCompleto, grafoEntidad, grafoStats } from "../controllers/grafoController.js";

const router = express.Router();

router.get("/stats", grafoStats);
router.get("/:id",   grafoEntidad);
router.get("/",      grafoCompleto);

export default router;
