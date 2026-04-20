import express from "express";
import {
  listarSpren,
  sprenDetalle,
  sprenSeccion,
} from "../controllers/sprenController.js";

const router = express.Router();

// GET /spren
router.get("/", listarSpren);

// GET /spren/:id/:seccion
router.get("/:id/:seccion", sprenSeccion);

// GET /spren/:id
router.get("/:id", sprenDetalle);

export default router;
