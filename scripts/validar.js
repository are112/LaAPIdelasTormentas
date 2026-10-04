// Validación de datos de La API de las Tormentas
// Uso: npm run validar
// Devuelve código 1 si hay errores, para poder usarlo antes de subir.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "data");

const errores = [];
const avisos = [];
const error = (m) => errores.push(m);
const aviso = (m) => avisos.push(m);

function leerJSON(ruta) {
  try {
    return JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch (e) {
    error(`JSON no válido: ${path.relative(DATA, ruta)} (${e.message})`);
    return null;
  }
}

function leerFichas(dir) {
  const fichas = new Map();
  for (const f of fs.readdirSync(path.join(DATA, dir))) {
    if (!f.endsWith(".json") || f.startsWith("00")) continue;
    const obj = leerJSON(path.join(DATA, dir, f));
    if (!obj) continue;
    const id = f.replace(".json", "");
    if (String(obj.id) !== id) error(`${dir}/${f}: el campo id ("${obj.id}") no coincide con el nombre del archivo`);
    fichas.set(id, obj);
  }
  return fichas;
}

// ── 1. Índices y fichas de todas las entidades ────────────
const ENTIDADES = ["personajes", "spren", "heraldos", "deshechos", "esquirlas"];
const datos = {};

for (const e of ENTIDADES) {
  const indice = leerJSON(path.join(DATA, `${e}.json`)) ?? [];
  const fichas = leerFichas(e);
  datos[e] = { indice, fichas };

  const vistos = new Set();
  for (const item of indice) {
    if (!item.id) { error(`${e}.json: entrada sin id (${JSON.stringify(item).slice(0, 60)})`); continue; }
    if (vistos.has(item.id)) error(`${e}.json: id duplicado "${item.id}"`);
    vistos.add(item.id);
    if (!fichas.has(item.id)) error(`${e}.json: "${item.id}" está en el índice pero no tiene ficha`);
  }
  for (const id of fichas.keys()) {
    if (!vistos.has(id)) error(`${e}/${id}.json: tiene ficha pero no está en ${e}.json`);
  }
}

// ── 2. Reglas de personajes ───────────────────────────────
const ordenes = (leerJSON(path.join(DATA, "ordenes.json")) ?? []).map((o) => o.nombre);
const ORDENES_VALIDAS = new Set([...ordenes, "Ninguna", "Desconocida"]);
const ESTADOS_VALIDOS = new Set(["vivo", "viva", "fallecido", "fallecida", "desconocido", "activo", "activa"]);
const CAMPOS_SINCRONIZADOS = ["nombre", "orden", "nivel_ideal", "estado_actual", "especie"];

const { indice: pIndice, fichas: pFichas } = datos.personajes;
for (const item of pIndice) {
  const f = pFichas.get(item.id);
  if (!f) continue;
  const enFicha = {
    nombre:        f.nombre,
    orden:         f.orden_radiantes?.orden || "Ninguna",
    nivel_ideal:   f.orden_radiantes?.nivel_ideal ?? null,
    estado_actual: f.estado_actual,
    especie:       f.especie,
  };

  if (!ORDENES_VALIDAS.has(enFicha.orden)) {
    error(`personajes/${item.id}: orden "${enFicha.orden}" no es una orden válida`);
  }
  if (!ESTADOS_VALIDOS.has(enFicha.estado_actual)) {
    error(`personajes/${item.id}: estado_actual "${enFicha.estado_actual}" no es un valor estándar`);
  }
  if (/spren/i.test(String(enFicha.especie))) {
    error(`personajes/${item.id}: especie "${enFicha.especie}" es un spren; debe ir en data/spren`);
  }
  for (const c of CAMPOS_SINCRONIZADOS) {
    const vi = item[c] ?? null;
    const vf = enFicha[c] ?? null;
    if (vi !== vf) error(`personajes.json "${item.id}": ${c} = ${JSON.stringify(vi)}, pero la ficha dice ${JSON.stringify(vf)}`);
  }
}

// ── 3. Relaciones (solo avisos) ───────────────────────────
// Referencias que el grafo no podrá conectar porque no existe la entidad.
const normalizar = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/['’`]/g, "").trim().replace(/[\s\-]+/g, "_");
const conocidos = new Set();
for (const e of ENTIDADES) {
  for (const [id, f] of datos[e].fichas) {
    conocidos.add(normalizar(id));
    if (f.nombre) conocidos.add(normalizar(f.nombre));
  }
}
let sinDestino = 0;
for (const e of ["personajes", "spren", "heraldos"]) {
  for (const [, f] of datos[e].fichas) {
    for (const valor of Object.values(f.relaciones ?? {})) {
      const lista = Array.isArray(valor) ? valor : valor && typeof valor === "object" ? [valor] : [];
      for (const r of lista) if (r?.personaje && !conocidos.has(normalizar(r.personaje))) sinDestino++;
    }
  }
}
if (sinDestino) aviso(`${sinDestino} relaciones apuntan a entidades sin ficha (no aparecen en el grafo)`);

// ── Resultado ─────────────────────────────────────────────
const totales = ENTIDADES.map((e) => `${e}: ${datos[e].indice.length}`).join(" | ");
console.log(`Entidades -> ${totales}`);
for (const a of avisos) console.log(`AVISO  ${a}`);
for (const e of errores) console.log(`ERROR  ${e}`);
if (errores.some((e) => e.includes("no es una orden válida"))) {
  console.log(`\nÓrdenes válidas: ${[...ORDENES_VALIDAS].join(", ")}`);
}
console.log(errores.length ? `\n${errores.length} errores. Corrígelos antes de subir.` : "\nTodo correcto.");
process.exit(errores.length ? 1 : 0);
