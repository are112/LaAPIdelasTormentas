import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listaPath = path.join(__dirname, "..", "data", "personajes.json");

// Caché en memoria: se carga una sola vez al arrancar
let listaCache = null;

function preloadList() {
  try {
    const raw = fs.readFileSync(listaPath, "utf8");
    const arr = JSON.parse(raw);
    listaCache = Array.isArray(arr) ? arr : [];
    console.log(`✅ Lista de ${listaCache.length} personajes cargada en caché`);
  } catch (err) {
    console.error("Error precargando personajes.json:", err.message);
    listaCache = [];
  }
}

// Precarga al importar el módulo
preloadList();

export function loadList() {
  return listaCache;
}