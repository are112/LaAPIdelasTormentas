import express from "express";
import personajesRoutes from "./routes/personajes.js";
import buscarRoutes from "./routes/buscar.js";
import docsRoutes from "./routes/docs.js";

const app = express();
app.use(express.json());

// rutas
app.use("/personajes", personajesRoutes);
app.use("/buscar", buscarRoutes);
app.use("/api-docs", docsRoutes);

// raíz
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "API El Archivo de las Tormentas funcionando ⚡" });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor activo en puerto " + PORT);
  console.log(`📖 Documentación disponible en http://localhost:${PORT}/api-docs`);
});
