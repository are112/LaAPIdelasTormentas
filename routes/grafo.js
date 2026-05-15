import express from "express";
import {
  grafoCompleto,
  grafoStats,
  grafoCamino,
  grafoComunidades,
  grafoEntidad,
} from "../controllers/grafoController.js";

const router = express.Router();

// Rutas estáticas primero para evitar conflictos con /:id
router.get("/stats",       grafoStats);
router.get("/camino",      grafoCamino);
router.get("/comunidades", grafoComunidades);
router.get("/:id",         grafoEntidad);
router.get("/",            grafoCompleto);

export default router;
