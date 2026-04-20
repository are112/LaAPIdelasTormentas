import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const personajesDir = path.join(__dirname, "..", "data", "personajes");

// Caché en memoria: se carga una sola vez al arrancar
const cache = new Map();

function preloadCharacters() {
  try {
    const files = fs.readdirSync(personajesDir).filter(
      (f) => f.endsWith(".json") && !f.startsWith("00")
    );

    for (const file of files) {
      const id = file.replace(".json", "").toLowerCase();
      const filePath = path.join(personajesDir, file);
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        cache.set(id, JSON.parse(raw));
      } catch (err) {
        console.error(`Error precargando personaje "${id}":`, err.message);
      }
    }

    console.log(`✅ ${cache.size} personajes cargados en caché`);
  } catch (err) {
    console.error("Error accediendo al directorio de personajes:", err.message);
  }
}

// Precarga al importar el módulo
preloadCharacters();

export function loadCharacter(id) {
  return cache.get(id.toLowerCase()) ?? null;
}