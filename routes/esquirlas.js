import express from "express";
import { esquirlas } from "../utils/loaders.js";
import { createEntityController } from "../controllers/entityController.js";

const { listar, detalle, seccion } = createEntityController({
  ...esquirlas,
  singular: "esquirla",
  femenino: true,
  notFound: { sugerencia: "Consulta GET /esquirlas para ver las esquirlas disponibles" },
});

const router = express.Router();
router.get("/",             listar);
router.get("/:id/:seccion", seccion);
router.get("/:id",          detalle);

export default router;
