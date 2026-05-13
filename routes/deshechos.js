import express from "express";
import { deshechos } from "../utils/loaders.js";
import { createEntityController } from "../controllers/entityController.js";

const { listar, detalle, seccion } = createEntityController({
  ...deshechos,
  singular: "deshecho",
});

const router = express.Router();
router.get("/",             listar);
router.get("/:id/:seccion", seccion);
router.get("/:id",          detalle);

export default router;
