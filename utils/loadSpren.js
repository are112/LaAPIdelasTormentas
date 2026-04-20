import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sprenDir = path.join(__dirname, "..", "data", "spren");

const cache = new Map();

function preloadSpren() {
  try {
    const files = fs.readdirSync(sprenDir).filter(
      (f) => f.endsWith(".json") && !f.startsWith("00")
    );

    for (const file of files) {
      const id = file.replace(".json", "").toLowerCase();
      const filePath = path.join(sprenDir, file);
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        cache.set(id, JSON.parse(raw));
      } catch (err) {
        console.error(`Error precargando spren "${id}":`, err.message);
      }
    }

    console.log(`✅ ${cache.size} spren cargados en caché`);
  } catch (err) {
    console.error("Error accediendo al directorio de spren:", err.message);
  }
}

preloadSpren();

export function loadSpren(id) {
  return cache.get(id.toLowerCase()) ?? null;
}
