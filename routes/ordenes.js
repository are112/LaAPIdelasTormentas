import express from "express";
import {
  listarOrdenes,
  detalleOrden,
  ordenPersonajes,
  ordenSpren,
} from "../controllers/ordenesController.js";

const router = express.Router();

router.get("/", listarOrdenes);
router.get("/:nombre/personajes", ordenPersonajes);
router.get("/:nombre/spren",      ordenSpren);
router.get("/:nombre",            detalleOrden);

export default router;
