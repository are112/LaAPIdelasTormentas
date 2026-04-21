import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listaPath = path.join(__dirname, "..", "data", "heraldos.json");

let listaCache = null;

function preloadHeraldosList() {
  try {
    const raw = fs.readFileSync(listaPath, "utf8");
    const arr = JSON.parse(raw);
    listaCache = Array.isArray(arr) ? arr : [];
    console.log(`✅ Lista de ${listaCache.length} heraldos cargada en caché`);
  } catch (err) {
    console.error("Error precargando heraldos.json:", err.message);
    listaCache = [];
  }
}

preloadHeraldosList();

export function loadHeraldosList() {
  return listaCache;
}
