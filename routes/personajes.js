import express from "express";
import {
  listarPersonajes,
  personajeDetalle,
  personajeResumen,
  personajeSeccion,
  personajeCompleto,
} from "../controllers/personajesController.js";
import relacionesRouter from "./relaciones.js";

const router = express.Router();

// Lista general
router.get("/", listarPersonajes);

// Rutas específicas antes de /:id para evitar conflictos
router.get("/:id/resumen", personajeResumen);
router.get("/:id/completo", personajeCompleto);

// Subrouter de relaciones: /personajes/:id/relaciones[/:tipo]
router.use("/:id/relaciones", relacionesRouter);

// Sección genérica: /personajes/:id/:seccion
router.get("/:id/:seccion", personajeSeccion);

// Detalle completo: /personajes/:id
router.get("/:id", personajeDetalle);

export default router;