import express from "express";
import {
  listarHeraldos,
  heraldoDetalle,
  heraldoSeccion,
} from "../controllers/heraldosController.js";

const router = express.Router();

router.get("/", listarHeraldos);
router.get("/:id/:seccion", heraldoSeccion);
router.get("/:id", heraldoDetalle);

export default router;
