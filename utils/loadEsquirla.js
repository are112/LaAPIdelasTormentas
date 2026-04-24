import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const esquirlaDir = path.join(__dirname, "..", "data", "esquirlas");
const cache = new Map();

function preloadEsquirlas() {
  try {
    const files = fs.readdirSync(esquirlaDir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const id = file.replace(".json", "").toLowerCase();
      const raw = fs.readFileSync(path.join(esquirlaDir, file), "utf8");
      cache.set(id, JSON.parse(raw));
    }
    console.log(`✅ ${cache.size} esquirlas cargadas en caché`);
  } catch (err) {
    console.error("Error precargando esquirlas:", err.message);
  }
}

preloadEsquirlas();
export function loadEsquirla(id) { return cache.get(id.toLowerCase()) ?? null; }
