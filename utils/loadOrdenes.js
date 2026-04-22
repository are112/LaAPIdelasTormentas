import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ordenesPath = path.join(__dirname, "..", "data", "ordenes.json");

// Caché en memoria: se carga una sola vez al arrancar
let ordenesCache = null;

function preloadOrdenes() {
  try {
    const raw = fs.readFileSync(ordenesPath, "utf8");
    const arr = JSON.parse(raw);
    ordenesCache = Array.isArray(arr) ? arr : [];
    console.log(`✅ ${ordenesCache.length} órdenes radiantes cargadas en caché`);
  } catch (err) {
    console.error("Error precargando ordenes.json:", err.message);
    ordenesCache = [];
  }
}

// Precarga al importar el módulo
preloadOrdenes();

export function loadOrdenes() {
  return ordenesCache;
}
