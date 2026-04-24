import express from "express";
import { listarEsquirlas, esquirlaDetalle, esquirlaSeccion } from "../controllers/esquirlasController.js";

const router = express.Router();
router.get("/", listarEsquirlas);
router.get("/:id/:seccion", esquirlaSeccion);
router.get("/:id", esquirlaDetalle);

export default router;
