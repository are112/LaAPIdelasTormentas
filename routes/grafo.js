import express from "express";
import { grafoCompleto, grafoPersonaje, grafoStats } from "../controllers/grafoController.js";

const router = express.Router();

// Orden importante: rutas estáticas antes que dinámicas
router.get("/stats", grafoStats);
router.get("/:id",   grafoPersonaje);
router.get("/",      grafoCompleto);

export default router;
