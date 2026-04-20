import express from "express";
import {
  listarPersonajes,
  personajeDetalle,
  personajeResumen,
  personajeSeccion,
  personajeCompleto
} from "../controllers/personajesController.js";

const router = express.Router();

router.get("/", listarPersonajes);
router.get("/:id", personajeDetalle);
router.get("/:id/resumen", personajeResumen);
router.get("/:id/completo", personajeCompleto);
router.get("/:id/:seccion", personajeSeccion);

export default router;