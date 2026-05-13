import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import { personajes, heraldos, spren, deshechos, esquirlas } from "./utils/loaders.js";
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
const START_TIME = Date.now();

app.set("trust proxy", 1);
app.use(express.json());

// ─── Compresión gzip ──────────────────────────────────────
// Comprime todas las respuestas JSON y HTML automáticamente.
// Umbral: solo comprime respuestas > 1 KB (las pequeñas no merece la pena).
app.use(compression({ threshold: 1024 }));

// ─── Logging de peticiones ────────────────────────────────
// En producción: formato "combined" (IP, método, ruta, status, tiempo).
// En desarrollo: formato "dev" (coloreado y compacto).
// El healthcheck se excluye para no contaminar los logs con ruido.
app.use((req, res, next) => {
  if (req.path === "/health") return next();
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")(req, res, next);
});

// ─── Seguridad: cabeceras HTTP ────────────────────────────
// Helmet añade cabeceras de seguridad a todas las respuestas
// protegiéndolas frente a ataques como XSS o clickjacking.
app.use(helmet({
  contentSecurityPolicy: false, // desactivado para no romper Swagger UI
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

// ─── Assets estáticos con caché de 1 día ─────────────────
// Las imágenes y SVGs no cambian en cada deploy, el navegador
// las cachea durante 24h evitando peticiones innecesarias.
app.use(express.static("public", {
  maxAge: "1d",
  etag: true,
  lastModified: true,
}));

// ─── Healthcheck ──────────────────────────────────────────
// GET /health — usado por Render, Fly.io, Cloudflare y monitores externos.
// Devuelve 200 si todo está en orden, 503 si alguna entidad no cargó.
// No pasa por rate limiter para que los monitores nunca queden bloqueados.
app.get("/health", (req, res) => {
  const cache = {
    personajes: personajes.loadList().length,
    heraldos:   heraldos.loadList().length,
    spren:      spren.loadList().length,
    deshechos:  deshechos.loadList().length,
    esquirlas:  esquirlas.loadList().length,
  };

  const healthy = Object.values(cache).every((n) => n > 0);

  res.status(healthy ? 200 : 503).json({
    status:          healthy ? "ok" : "degraded",
    uptime_s:        Math.floor((Date.now() - START_TIME) / 1000),
    entidades:       cache,
    total_entidades: Object.values(cache).reduce((a, b) => a + b, 0),
  });
});

// ─── Rutas ────────────────────────────────────────────────
app.use("/personajes", apiLimiter, personajesRoutes);
app.use("/buscar",     apiLimiter, buscarRoutes);
app.use("/ordenes",    apiLimiter, ordenesRoutes);
app.use("/spren",      apiLimiter, sprenRoutes);
app.use("/heraldos",   apiLimiter, heraldosRoutes);
app.use("/deshechos",  apiLimiter, deshechoRoutes);
app.use("/esquirlas",  apiLimiter, esquirlasRoutes);
app.use("/stats",      apiLimiter, statsRoutes);
app.use("/explorador", explorerLimiter, exploradorRoutes);
app.use("/api-docs",   explorerLimiter, docsRoutes);

// Raíz
app.get("/", (req, res) => {
  res.redirect("/explorador");
});

// ─── Ruta no encontrada (404) ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
    sugerencia: "Consulta GET / para ver los endpoints disponibles",
  });
});

// ─── Error global (500) ───────────────────────────────────
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
