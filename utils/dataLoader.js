import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/**
 * Crea un loader para una entidad con caché en memoria.
 * La carga de archivos individuales se hace en PARALELO con Promise.all.
 *
 * @param {object}  config
 * @param {string}  [config.dir]           - Subdirectorio bajo /data/ con los JSON individuales.
 *                                           Omitir si la entidad no tiene ficheros individuales.
 * @param {string}  config.listFile        - JSON índice bajo /data/ (e.g. "personajes.json")
 * @param {string}  config.label           - Nombre legible para logs (e.g. "personajes")
 * @param {boolean} [config.skipPlantilla] - Ignora archivos que empiezan por "00" (default: true)
 * @param {boolean} [config.buildIndex]    - Pre-calcula índice de texto para búsquedas (default: false)
 *
 * @returns {{ loadOne, loadList, searchText, ready }}
 *   - loadOne(id)       → objeto completo o null
 *   - loadList()        → array índice
 *   - searchText(term)  → array de ids que contienen el término (solo si buildIndex: true)
 *   - ready             → Promise que resuelve cuando la carga paralela ha terminado
 */
export function createLoader({ dir, listFile, label, skipPlantilla = true, buildIndex = false }) {
  const dataRoot = path.join(__dirname, "..", "data");
  const listPath = path.join(dataRoot, listFile);

  // ── Caché individual (Map id → objeto) ───────────────────
  const cache = new Map();

  // ── Índice de texto (Map id → string serializado en minúsculas) ──
  // Solo se construye si buildIndex: true — evita el coste en entidades
  // que nunca usan búsqueda de texto libre.
  const textIndex = new Map();

  // ── Caché de lista ────────────────────────────────────────
  let listCache = [];

  // ── Carga paralela ────────────────────────────────────────
  // readFileSync bloqueaba el event loop al arrancar. Ahora todas las
  // lecturas se lanzan a la vez con Promise.all y fs.promises.
  const ready = (async () => {
    // 1. Leer el índice de lista
    try {
      const raw = await fs.promises.readFile(listPath, "utf8");
      const arr = JSON.parse(raw);
      listCache = Array.isArray(arr) ? arr : [];
    } catch (err) {
      console.error(`Error cargando ${listFile}:`, err.message);
    }

    // 2. Leer los JSON individuales en paralelo
    if (dir) {
      const entityDir = path.join(dataRoot, dir);
      try {
        const files = (await fs.promises.readdir(entityDir)).filter(
          (f) => f.endsWith(".json") && (!skipPlantilla || !f.startsWith("00"))
        );

        await Promise.all(
          files.map(async (file) => {
            const id = file.replace(".json", "").toLowerCase();
            try {
              const raw = await fs.promises.readFile(path.join(entityDir, file), "utf8");
              const obj = JSON.parse(raw);
              cache.set(id, obj);
              if (buildIndex) {
                textIndex.set(id, JSON.stringify(obj).toLowerCase());
              }
            } catch (err) {
              console.error(`Error cargando ${label} "${id}":`, err.message);
            }
          })
        );

        console.log(`✅ ${cache.size} ${label} cargados en caché`);
      } catch (err) {
        console.error(`Error accediendo al directorio de ${label}:`, err.message);
      }
    }

    console.log(`✅ Lista de ${listCache.length} ${label} cargada en caché`);
  })();

  return {
    ready,
    loadOne:  (id) => cache.get(String(id).toLowerCase()) ?? null,
    loadList: ()   => listCache,
    /** Devuelve los ids cuyo contenido contiene el término (requiere buildIndex: true) */
    searchText: (term) => {
      if (!buildIndex) return [];
      const t = term.toLowerCase();
      const ids = [];
      for (const [id, text] of textIndex) {
        if (text.includes(t)) ids.push(id);
      }
      return ids;
    },
  };
}
