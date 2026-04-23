import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listaPath = path.join(__dirname, "..", "data", "deshechos.json");
let listaCache = null;

function preloadDeshechosList() {
  try {
    const raw = fs.readFileSync(listaPath, "utf8");
    const arr = JSON.parse(raw);
    listaCache = Array.isArray(arr) ? arr : [];
    console.log(`✅ Lista de ${listaCache.length} deshechos cargada en caché`);
  } catch (err) {
    console.error("Error precargando deshechos.json:", err.message);
    listaCache = [];
  }
}

preloadDeshechosList();
export function loadDeshechosList() { return listaCache; }
