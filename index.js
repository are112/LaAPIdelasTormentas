import express from "express";
import personajesRoutes from "./routes/personajes.js";
import buscarRoutes from "./routes/buscar.js";
import docsRoutes from "./routes/docs.js";
import statsRoutes from "./routes/stats.js";
import ordenesRoutes from "./routes/ordenes.js";
import exploradorRoutes from "./routes/explorador.js";
import sprenRoutes from "./routes/spren.js";
import heraldosRoutes from "./routes/heraldos.js";
import deshechoRoutes from "./routes/deshechos.js";
import esquirlasRoutes from "./routes/esquirlas.js";

const app = express();
app.use(express.json());

// ─── Assets estáticos con caché de 1 día ─────────────────
// Las imágenes y SVGs no cambian en cada deploy, el navegador
// las cachea durante 24h evitando peticiones innecesarias.
app.use(express.static("public", {
  maxAge: "1d",
  etag: true,
  lastModified: true,
}));

// ─── Rutas ───────────────────────────────────────────────
app.use("/personajes", personajesRoutes);
app.use("/buscar", buscarRoutes);
app.use("/ordenes", ordenesRoutes);
app.use("/spren", sprenRoutes);
app.use("/heraldos", heraldosRoutes);
app.use("/deshechos", deshechoRoutes);
app.use("/esquirlas", esquirlasRoutes);
app.use("/stats", statsRoutes);
app.use("/explorador", exploradorRoutes);
app.use("/api-docs", docsRoutes);

// Raíz
app.get("/", (req, res) => {
  res.redirect("/explorador");
});

// ─── Ruta no encontrada (404) ────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
    sugerencia: "Consulta GET / para ver los endpoints disponibles",
  });
});

// ─── Error global (500) ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.message);
  res.status(500).json({
    error: "Error interno del servidor",
    detalle: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ Servidor activo en puerto ${PORT}`);
  console.log(`📖 Documentación disponible en http://localhost:${PORT}/api-docs`);
});
