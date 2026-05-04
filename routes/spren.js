import express from "express";
import {
  listarSpren,
  sprenDetalle,
  sprenResumen,
  sprenRelaciones,
  sprenSeccion,
} from "../controllers/sprenController.js";

const router = express.Router();

router.get("/", listarSpren);
router.get("/:id/resumen",    sprenResumen);
router.get("/:id/relaciones", sprenRelaciones);
router.get("/:id/:seccion",   sprenSeccion);
router.get("/:id",            sprenDetalle);

export default router;
