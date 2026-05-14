import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import { personajes, heraldos, spren, deshechos, esquirlas, waitForLoaders } from "./utils/loaders.js";
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
import grafoRoutes from "./routes/grafo.js";

const app = express();
const START_TIME = Date.now();

app.set("trust proxy", 1);
app.use(express.json());

// ─── Compresión gzip ──────────────────────────────────────
app.use(compression({ threshold: 1024 }));

// ─── Logging de peticiones ────────────────────────────────
// El healthcheck se excluye para no contaminar los logs con ruido.
app.use((req, res, next) => {
  if (req.path === "/health") return next();
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")(req, res, next);
});

// ─── Seguridad: cabeceras HTTP ────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ─── Seguridad: límite de peticiones por IP ───────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones desde esta IP, espera unos minutos ⚡" },
});

const explorerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Assets estáticos con caché de 1 día ─────────────────
app.use(express.static("public", { maxAge: "1d", etag: true, lastModified: true }));

// ─── Healthcheck ──────────────────────────────────────────
// Fuera del rate limiter para que los monitores nunca queden bloqueados.
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
app.use("/grafo",      apiLimiter, grafoRoutes);
app.use("/stats",      apiLimiter, statsRoutes);
app.use("/explorador", explorerLimiter, exploradorRoutes);
app.use("/api-docs",   explorerLimiter, docsRoutes);

app.get("/", (req, res) => res.redirect("/explorador"));

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

// ─── Arranque ─────────────────────────────────────────────
// Espera a que todos los loaders terminen su carga en paralelo
// antes de abrir el puerto. Así el servidor nunca responde con
// datos vacíos durante los primeros milisegundos.
const PORT = process.env.PORT || 3000;

waitForLoaders().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ Servidor activo en puerto ${PORT} (arranque: ${Date.now() - START_TIME}ms)`);
    console.log(`📖 Documentación disponible en http://localhost:${PORT}/api-docs`);
  });
}).catch((err) => {
  console.error("Error fatal al cargar los datos:", err.message);
  process.exit(1);
});
