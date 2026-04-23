import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deshechoDir = path.join(__dirname, "..", "data", "deshechos");
const cache = new Map();

function preloadDeshechos() {
  try {
    const files = fs.readdirSync(deshechoDir).filter(
      (f) => f.endsWith(".json") && !f.startsWith("00")
    );
    for (const file of files) {
      const id = file.replace(".json", "").toLowerCase();
      const raw = fs.readFileSync(path.join(deshechoDir, file), "utf8");
      cache.set(id, JSON.parse(raw));
    }
    console.log(`✅ ${cache.size} deshechos cargados en caché`);
  } catch (err) {
    console.error("Error precargando deshechos:", err.message);
  }
}

preloadDeshechos();
export function loadDeshecho(id) { return cache.get(id.toLowerCase()) ?? null; }
