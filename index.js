import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import personajesRoutes from "./routes/personajes.js";
import buscarRoutes from "./routes/buscar.js";
import docsRoutes from "./routes/docs.js";
import statsRoutes from "./routes/stats.js";
import ordenesRoutes from "./routes/ordenes.js";
import sprenRoutes from "./routes/spren.js";
import heraldosRoutes from "./routes/heraldos.js";
import deshechoRoutes from "./routes/deshechos.js";
import esquirlasRoutes from "./routes/esquirlas.js";

const app = express();
app.set('trust proxy', 1); // Confía en el proxy de Render/Fly.io para identificar IPs reales
app.use(express.json());

// ─── Seguridad: cabeceras HTTP ────────────────────────────
// Helmet añade cabeceras de seguridad a todas las respuestas
// protegiéndolas frente a ataques como XSS o clickjacking.
app.use(helmet({
  contentSecurityPolicy: false, // desactivado para no romper Swagger UI ni Babel del explorador
}));

// ─── Seguridad: límite de peticiones por IP ───────────────
// Máximo 100 peticiones por IP cada 15 minutos.
// Las rutas del explorador y la documentación tienen un límite
// más generoso al ser navegación normal de usuario.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones desde esta IP, espera unos minutos ⚡",
  },
});

const explorerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Rate limit del explorador (incluye sus assets estáticos) ──
app.use("/explorador", explorerLimiter);

// ─── Assets estáticos con caché de 1 día ─────────────────
// Sirve toda la carpeta public/ (incluye public/explorador/* con
// el nuevo explorador visual: index.html, app.jsx, etc.).
// El navegador cachea los assets durante 24h.
app.use(express.static("public", {
  maxAge: "1d",
  etag: true,
  lastModified: true,
}));

// ─── Rutas API ───────────────────────────────────────────
app.use("/personajes", apiLimiter, personajesRoutes);
app.use("/buscar", apiLimiter, buscarRoutes);
app.use("/ordenes", apiLimiter, ordenesRoutes);
app.use("/spren", apiLimiter, sprenRoutes);
app.use("/heraldos", apiLimiter, heraldosRoutes);
app.use("/deshechos", apiLimiter, deshechoRoutes);
app.use("/esquirlas", apiLimiter, esquirlasRoutes);
app.use("/stats", apiLimiter, statsRoutes);
app.use("/api-docs", explorerLimiter, docsRoutes);

// Raíz: redirige al explorador
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
  console.log(`🌩  Explorador en http://localhost:${PORT}/explorador`);
});
