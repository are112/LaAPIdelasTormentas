import express from "express";
import { buscar } from "../controllers/buscarController.js";

const router = express.Router();

router.get("/", buscar);

export default router;