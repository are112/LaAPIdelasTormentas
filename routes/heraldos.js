import express from "express";
import { heraldos } from "../utils/loaders.js";
import { createEntityController } from "../controllers/entityController.js";

const { listar, detalle, resumen, relaciones, seccion } = createEntityController({
  ...heraldos,
  singular:       "heraldo",
  notFound:       { sugerencia: "Consulta GET /heraldos para ver los heraldos disponibles" },
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
