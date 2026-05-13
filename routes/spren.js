import express from "express";
import { spren } from "../utils/loaders.js";
import { createEntityController } from "../controllers/entityController.js";

const { listar, detalle, resumen, relaciones, seccion } = createEntityController({
  ...spren,
  singular:       "spren",
  notFound:       { sugerencia: "Consulta GET /spren para ver los spren disponibles" },
  withResumen:    true,
  withRelaciones: true,
});

const router = express.Router();
router.get("/",               listar);
router.get("/:id/resumen",    resumen);
router.get("/:id/relaciones", relaciones);
router.get("/:id/:seccion",   seccion);
router.get("/:id",            detalle);

export default router;
