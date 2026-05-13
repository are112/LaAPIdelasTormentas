import { personajes, heraldos, spren, deshechos, esquirlas } from "../utils/loaders.js";

// ─── Helpers ─────────────────────────────────────────────

function deepGet(obj, path) {
  if (!path || typeof path !== "string") return undefined;
  return path.split(".").reduce((acc, key) => (acc && typeof acc === "object" && key in acc ? acc[key] : undefined), obj);
}

function deepSet(target, path, value) {
  const keys = path.split(".");
  let ref = target;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) { ref[k] = value; }
    else { if (!ref[k] || typeof ref[k] !== "object") ref[k] = {}; ref = ref[k]; }
  });
}

function deepPick(obj, paths = []) {
  if (!paths || paths.length === 0) return obj;
  const result = {};
  for (const p of paths) { const v = deepGet(obj, p); if (v !== undefined) deepSet(result, p, v); }
  return result;
}

function getSortValue(obj, pathOrKey) {
  const raw = pathOrKey.includes(".") ? deepGet(obj, pathOrKey) : obj?.[pathOrKey];
  return JSON.stringify(raw ?? "").toLowerCase();
}

// ─── Filtro genérico ──────────────────────────────────────
// El filtro de texto ya NO usa JSON.stringify en caliente:
// usa el índice pre-calculado al arranque via searchText().

function aplicarFiltros(detalle, filtros, tipoEntidad, loadersMap) {
  const { orden, nivel_ideal, especie, sexo, nacionalidad, origen, estado_actual,
          afiliacion, libro, texto, ...otrosFiltros } = filtros;

  if (orden && String(detalle.orden_radiantes?.orden ?? "").toLowerCase() !== orden.toLowerCase()) return false;
  if (nivel_ideal) {
    const valor = Number(detalle.orden_radiantes?.nivel_ideal);
    if (isNaN(valor)) return false;
    if (nivel_ideal.includes(">=") && !(valor >= parseInt(nivel_ideal.split(">=")[1]))) return false;
    else if (nivel_ideal.includes("<=") && !(valor <= parseInt(nivel_ideal.split("<=")[1]))) return false;
    else if (nivel_ideal.includes(">")  && !(valor >  parseInt(nivel_ideal.split(">")[1])))  return false;
    else if (nivel_ideal.includes("<")  && !(valor <  parseInt(nivel_ideal.split("<")[1])))  return false;
    else if (!nivel_ideal.match(/[><]/) && valor !== parseInt(nivel_ideal))                  return false;
  }
  if (especie       && String(detalle.especie       ?? "").toLowerCase() !== especie.toLowerCase())       return false;
  if (sexo          && String(detalle.sexo          ?? "").toLowerCase() !== sexo.toLowerCase())          return false;
  if (nacionalidad  && String(detalle.nacionalidad  ?? "").toLowerCase() !== nacionalidad.toLowerCase())  return false;
  if (origen        && String(detalle.origen        ?? "").toLowerCase() !== origen.toLowerCase())        return false;
  if (estado_actual && String(detalle.estado_actual ?? "").toLowerCase() !== estado_actual.toLowerCase()) return false;
  if (afiliacion && !(detalle.afiliaciones ?? []).some((a) => String(a).toLowerCase() === afiliacion.toLowerCase())) return false;
  if (libro && !(detalle.apariciones?.libros ?? []).some((l) => String(l.titulo ?? "").toLowerCase() === libro.toLowerCase())) return false;
  // texto: ya filtrado antes de llamar a aplicarFiltros — no se evalúa aquí
  for (const clave of Object.keys(otrosFiltros)) {
    if (!JSON.stringify(deepGet(detalle, clave) ?? "").toLowerCase().includes(String(otrosFiltros[clave]).toLowerCase())) return false;
  }
  return true;
}

// ─── Controlador principal ────────────────────────────────

export function buscar(req, res) {
  const { id, tipo, orden, nivel_ideal, especie, sexo, nacionalidad, origen, estado_actual,
          afiliacion, libro, texto, sort, page, limit, fields, ...otrosFiltros } = req.query;

  const filtros = { orden, nivel_ideal, especie, sexo, nacionalidad, origen, estado_actual, afiliacion, libro, texto, ...otrosFiltros };

  const entidades = [
    { tipo: "personaje", ...personajes },
    { tipo: "heraldo",   ...heraldos },
    { tipo: "spren",     ...spren },
    { tipo: "deshecho",  ...deshechos },
    { tipo: "esquirla",  ...esquirlas },
  ];

  let resultados = [];

  for (const { tipo: tipoEntidad, loadOne, loadList, searchText } of entidades) {
    if (tipo && tipo !== tipoEntidad) continue;

    // Si hay filtro de texto, usar el índice pre-calculado para reducir
    // el conjunto de candidatos antes de aplicar el resto de filtros.
    let candidatos;
    if (texto) {
      const idsConTexto = new Set(searchText(texto));
      candidatos = loadList().filter((x) => idsConTexto.has(String(x.id).toLowerCase()));
    } else {
      candidatos = id
        ? loadList().filter((x) => String(x.id).toLowerCase() === String(id).toLowerCase())
        : loadList();
    }

    for (const item of candidatos) {
      const detalle = loadOne(item.id);
      if (!detalle) continue;
      if (aplicarFiltros(detalle, filtros)) resultados.push({ ...detalle, _tipo: tipoEntidad });
    }
  }

  if (resultados.length === 0) {
    return res.json({ mensaje: "No se ha encontrado ningún resultado que cumpla los parámetros de búsqueda.", resultados: [] });
  }

  if (sort) {
    const desc = sort.startsWith("-"), campo = desc ? sort.slice(1) : sort;
    resultados.sort((a, b) => {
      const va = getSortValue(a, campo), vb = getSortValue(b, campo);
      return va < vb ? (desc ? 1 : -1) : va > vb ? (desc ? -1 : 1) : 0;
    });
  }

  const pagina = parseInt(page) || 1;
  const tam    = parseInt(limit) || resultados.length;
  let paginado = resultados.slice((pagina - 1) * tam, pagina * tam);

  if (fields) {
    const listaCampos = fields.split(",").map((s) => s.trim()).filter(Boolean);
    paginado = paginado.map((item) => deepPick(item, listaCampos));
  }

  return res.json({ total: resultados.length, pagina, limite: tam, resultados: paginado });
}
