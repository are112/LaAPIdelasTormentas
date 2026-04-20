import express from "express";
import { listarOrdenes, detalleOrden } from "../controllers/ordenesController.js";

const router = express.Router();

// GET /ordenes
router.get("/", listarOrdenes);

// GET /ordenes/:nombre
router.get("/:nombre", detalleOrden);

export default router;
