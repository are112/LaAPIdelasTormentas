import express from "express";
import { spren } from "../utils/loaders.js";
import { createEntityController } from "../controllers/entityController.js";

const { listar, detalle, resumen, relaciones, seccion } = createEntityController({
  ...spren,
  singular:       "spren",
  notFound:       { sugerencia: "Consulta GET /spren para ver los spren disponibles" },
  withResumen:    true,
  withRelaciones: true,
  // Incluye la orden radiante en el listado para que el explorador no tenga
  // que pedir el detalle de cada spren por separado
  enrichList: (item, det) => ({ orden_radiante: det?.vinculo_nahel?.orden_radiante ?? null }),
});

const router = express.Router();
router.get("/",               listar);
router.get("/:id/resumen",    resumen);
router.get("/:id/relaciones", relaciones);
router.get("/:id/:seccion",   seccion);
router.get("/:id",            detalle);

export default router;
