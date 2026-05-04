import express from "express";
import {
  listarHeraldos,
  heraldoDetalle,
  heraldoResumen,
  heraldoRelaciones,
  heraldoSeccion,
} from "../controllers/heraldosController.js";

const router = express.Router();

router.get("/", listarHeraldos);
router.get("/:id/resumen",    heraldoResumen);
router.get("/:id/relaciones", heraldoRelaciones);
router.get("/:id/:seccion",   heraldoSeccion);
router.get("/:id",            heraldoDetalle);

export default router;
