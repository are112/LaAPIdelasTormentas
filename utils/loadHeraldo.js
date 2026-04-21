import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const heraldosDir = path.join(__dirname, "..", "data", "heraldos");

const cache = new Map();

function preloadHeraldos() {
  try {
    const files = fs.readdirSync(heraldosDir).filter(
      (f) => f.endsWith(".json") && !f.startsWith("00")
    );

    for (const file of files) {
      const id = file.replace(".json", "").toLowerCase();
      const filePath = path.join(heraldosDir, file);
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        cache.set(id, JSON.parse(raw));
      } catch (err) {
        console.error(`Error precargando heraldo "${id}":`, err.message);
      }
    }

    console.log(`✅ ${cache.size} heraldos cargados en caché`);
  } catch (err) {
    console.error("Error accediendo al directorio de heraldos:", err.message);
  }
}

preloadHeraldos();

export function loadHeraldo(id) {
  return cache.get(id.toLowerCase()) ?? null;
}
