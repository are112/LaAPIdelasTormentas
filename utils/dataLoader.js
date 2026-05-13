import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/**
 * Crea un loader para una entidad con caché en memoria.
 *
 * @param {object}  config
 * @param {string}  [config.dir]             - Subdirectorio bajo /data/ con los JSON individuales.
 *                                             Omitir si la entidad no tiene ficheros individuales.
 * @param {string}  config.listFile          - JSON índice bajo /data/ (e.g. "personajes.json")
 * @param {string}  config.label             - Nombre legible para logs (e.g. "personajes")
 * @param {boolean} [config.skipPlantilla]   - Ignora archivos que empiezan por "00" (default: true)
 *
 * @returns {{ loadOne: (id: string) => object|null, loadList: () => object[] }}
 */
export function createLoader({ dir, listFile, label, skipPlantilla = true }) {
  const dataRoot = path.join(__dirname, "..", "data");
  const listPath = path.join(dataRoot, listFile);

  // ── Caché individual (Map id → objeto) ──────────────────
  const cache = new Map();

  if (dir) {
    const entityDir = path.join(dataRoot, dir);
    try {
      const files = fs.readdirSync(entityDir).filter(
        (f) => f.endsWith(".json") && (!skipPlantilla || !f.startsWith("00"))
      );
      for (const file of files) {
        const id = file.replace(".json", "").toLowerCase();
        try {
          const raw = fs.readFileSync(path.join(entityDir, file), "utf8");
          cache.set(id, JSON.parse(raw));
        } catch (err) {
          console.error(`Error precargando ${label} "${id}":`, err.message);
        }
      }
      console.log(`✅ ${cache.size} ${label} cargados en caché`);
    } catch (err) {
      console.error(`Error accediendo al directorio de ${label}:`, err.message);
    }
  }

  // ── Caché de lista (array índice) ────────────────────────
  let listCache = null;

  try {
    const raw = fs.readFileSync(listPath, "utf8");
    const arr = JSON.parse(raw);
    listCache = Array.isArray(arr) ? arr : [];
    console.log(`✅ Lista de ${listCache.length} ${label} cargada en caché`);
  } catch (err) {
    console.error(`Error precargando ${listFile}:`, err.message);
    listCache = [];
  }

  return {
    /** Devuelve el objeto completo por id, o null si no existe */
    loadOne:  (id) => cache.get(String(id).toLowerCase()) ?? null,
    /** Devuelve el array índice completo */
    loadList: ()   => listCache,
  };
}
