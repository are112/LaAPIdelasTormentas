import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listaPath = path.join(__dirname, "..", "data", "esquirlas.json");
let listaCache = null;

function preloadEsquirlasList() {
  try {
    const raw = fs.readFileSync(listaPath, "utf8");
    const arr = JSON.parse(raw);
    listaCache = Array.isArray(arr) ? arr : [];
    console.log(`✅ Lista de ${listaCache.length} esquirlas cargada en caché`);
  } catch (err) {
    console.error("Error precargando esquirlas.json:", err.message);
    listaCache = [];
  }
}

preloadEsquirlasList();
export function loadEsquirlasList() { return listaCache; }
