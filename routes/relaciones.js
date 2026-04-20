import express from "express";
import {
  personajeRelaciones,
  personajeRelacionTipo,
} from "../controllers/relacionesController.js";

const router = express.Router({ mergeParams: true });

// GET /personajes/:id/relaciones
router.get("/", personajeRelaciones);

// GET /personajes/:id/relaciones/:tipo  (familia | amigos | enemigos)
router.get("/:tipo", personajeRelacionTipo);

export default router;
