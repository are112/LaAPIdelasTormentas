import express from "express";
import { listarDeshechos, deshechoDetalle, deshechoSeccion } from "../controllers/deshechoController.js";

const router = express.Router();
router.get("/", listarDeshechos);
router.get("/:id/:seccion", deshechoSeccion);
router.get("/:id", deshechoDetalle);

export default router;
