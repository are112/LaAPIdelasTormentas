import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";
import { loadHeraldosList } from "../utils/loadHeraldosList.js";
import { loadHeraldo } from "../utils/loadHeraldo.js";
import { loadSprenList } from "../utils/loadSprenList.js";
import { loadSpren } from "../utils/loadSpren.js";
import { loadDeshechosList } from "../utils/loadDeshechosList.js";
import { loadDeshecho } from "../utils/loadDeshecho.js";
import { loadEsquirlasList } from "../utils/loadEsquirlasList.js";
import { loadEsquirla } from "../utils/loadEsquirla.js";

// ─── Helpers ────────────────────────────────────────────

function deepGet(obj, path) {
  if (!path || typeof path !== "string") return undefined;
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return acc[key];
    return undefined;
  }, obj);
}

function deepSet(target, path, value) {
  const keys = path.split(".");
  let ref = target;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) { ref[k] = value; }
    else {
      if (!ref[k] || typeof ref[k] !== "object") ref[k] = {};
      ref = ref[k];
    }
  });
}

function deepPick(obj, paths = []) {
  if (!paths || paths.length === 0) return obj;
  const result = {};
  for (const p of paths) {
    const v = deepGet(obj, p);
    if (v !== undefined) deepSet(result, p, v);
  }
  return result;
}

function getSortValue(obj, pathOrKey) {
  const raw = pathOrKey.includes(".") ? deepGet(obj, pathOrKey) : obj?.[pathOrKey];
  return JSON.stringify(raw ?? "").toLowerCase();
}

// ─── Filtro genérico (compartido por todos los tipos) ────

function aplicarFiltros(detalle, filtros) {
  const {
    orden, nivel_ideal, especie, sexo, nacionalidad,
    origen, estado_actual, afiliacion, libro, texto,
    ...otrosFiltros
  } = filtros;

  if (orden) {
    const val = String(detalle.orden_radiantes?.orden ?? "").toLowerCase();
    if (val !== orden.toLowerCase()) return false;
  }

  if (nivel_ideal) {
    const valor = Number(detalle.orden_radiantes?.nivel_ideal);
    if (isNaN(valor)) return false;
    if (nivel_ideal.includes(">=") && !(valor >= parseInt(nivel_ideal.split(">=")[1]))) return false;
    else if (nivel_ideal.includes("<=") && !(valor <= parseInt(nivel_ideal.split("<=")[1]))) return false;
    else if (nivel_ideal.includes(">")  && !(valor >  parseInt(nivel_ideal.split(">")[1])))  return false;
    else if (nivel_ideal.includes("<")  && !(valor <  parseInt(nivel_ideal.split("<")[1])))  return false;
    else if (!nivel_ideal.match(/[><]/) && valor !== parseInt(nivel_ideal))                  return false;
  }

  if (especie      && String(detalle.especie      ?? "").toLowerCase() !== especie.toLowerCase())      return false;
  if (sexo         && String(detalle.sexo         ?? "").toLowerCase() !== sexo.toLowerCase())         return false;
  if (nacionalidad && String(detalle.nacionalidad ?? "").toLowerCase() !== nacionalidad.toLowerCase()) return false;
  if (origen       && String(detalle.origen       ?? "").toLowerCase() !== origen.toLowerCase())       return false;
  if (estado_actual && String(detalle.estado_actual ?? "").toLowerCase() !== estado_actual.toLowerCase()) return false;

  if (afiliacion) {
    const tiene = (detalle.afiliaciones ?? []).some(
      (a) => String(a).toLowerCase() === afiliacion.toLowerCase()
    );
    if (!tiene) return false;
  }

  if (libro) {
    const aparece = (detalle.apariciones?.libros ?? []).some(
      (l) => String(l.titulo ?? "").toLowerCase() === libro.toLowerCase()
    );
    if (!aparece) return false;
  }

  if (texto) {
    if (!JSON.stringify(detalle).toLowerCase().includes(texto.toLowerCase())) return false;
  }

  for (const clave of Object.keys(otrosFiltros)) {
    const valorFiltro = String(otrosFiltros[clave]).toLowerCase();
    const contenido = JSON.stringify(deepGet(detalle, clave) ?? "").toLowerCase();
    if (!contenido.includes(valorFiltro)) return false;
  }

  return true;
}

// ─── Controlador principal ───────────────────────────────

export function buscar(req, res) {
  const {
    id, tipo,
    orden, nivel_ideal, especie, sexo, nacionalidad,
    origen, estado_actual, afiliacion, libro, texto,
    sort, page, limit, fields,
    ...otrosFiltros
  } = req.query;

  const filtros = {
    orden, nivel_ideal, especie, sexo, nacionalidad,
    origen, estado_actual, afiliacion, libro, texto,
    ...otrosFiltros,
  };

  let resultados = [];

  const buscarPersonajes = !tipo || tipo === "personaje";
  const buscarHeraldos   = !tipo || tipo === "heraldo";
  const buscarSpren      = !tipo || tipo === "spren";
  const buscarDeshechos  = !tipo || tipo === "deshecho";
  const buscarEsquirlas  = !tipo || tipo === "esquirla";

  // ── Personajes ──────────────────────────────────────────
  if (buscarPersonajes) {
    const lista = id
      ? loadList().filter((x) => String(x.id).toLowerCase() === String(id).toLowerCase())
      : loadList();

    for (const p of lista) {
      const detalle = loadCharacter(p.id);
      if (!detalle) continue;
      if (aplicarFiltros(detalle, filtros))
        resultados.push({ ...detalle, _tipo: "personaje" });
    }
  }

  // ── Heraldos ────────────────────────────────────────────
  if (buscarHeraldos) {
    const listaH = id
      ? loadHeraldosList().filter((x) => String(x.id).toLowerCase() === String(id).toLowerCase())
      : loadHeraldosList();

    for (const h of listaH) {
      const detalle = loadHeraldo(h.id);
      if (!detalle) continue;
      if (aplicarFiltros(detalle, filtros))
        resultados.push({ ...detalle, _tipo: "heraldo" });
    }
  }

  // ── Spren ───────────────────────────────────────────────
  if (buscarSpren) {
    const listaS = id
      ? loadSprenList().filter((x) => String(x.id).toLowerCase() === String(id).toLowerCase())
      : loadSprenList();

    for (const s of listaS) {
      const detalle = loadSpren(s.id);
      if (!detalle) continue;
      if (aplicarFiltros(detalle, filtros))
        resultados.push({ ...detalle, _tipo: "spren" });
    }
  }

  // ── Deshechos ───────────────────────────────────────────
  if (buscarDeshechos) {
    const listaD = id
      ? loadDeshechosList().filter((x) => String(x.id).toLowerCase() === String(id).toLowerCase())
      : loadDeshechosList();

    for (const d of listaD) {
      const detalle = loadDeshecho(d.id);
      if (!detalle) continue;
      if (aplicarFiltros(detalle, filtros))
        resultados.push({ ...detalle, _tipo: "deshecho" });
    }
  }

  // ── Esquirlas ───────────────────────────────────────────
  if (buscarEsquirlas) {
    const listaE = id
      ? loadEsquirlasList().filter((x) => String(x.id).toLowerCase() === String(id).toLowerCase())
      : loadEsquirlasList();

    for (const e of listaE) {
      const detalle = loadEsquirla(e.id);
      if (!detalle) continue;
      if (aplicarFiltros(detalle, filtros))
        resultados.push({ ...detalle, _tipo: "esquirla" });
    }
  }

  if (resultados.length === 0) {
    return res.json({
      mensaje: "No se ha encontrado ningún resultado que cumpla los parámetros de búsqueda.",
      resultados: [],
    });
  }

  // ── Ordenación ──────────────────────────────────────────
  if (sort) {
    const descendente = sort.startsWith("-");
    const campo = descendente ? sort.slice(1) : sort;
    resultados.sort((a, b) => {
      const va = getSortValue(a, campo);
      const vb = getSortValue(b, campo);
      if (va < vb) return descendente ? 1 : -1;
      if (va > vb) return descendente ? -1 : 1;
      return 0;
    });
  }

  // ── Paginación ──────────────────────────────────────────
  const pagina = parseInt(page) || 1;
  const tam    = parseInt(limit) || resultados.length;
  let paginado = resultados.slice((pagina - 1) * tam, pagina * tam);

  // ── Fields ──────────────────────────────────────────────
  if (fields) {
    const listaCampos = fields.split(",").map((s) => s.trim()).filter(Boolean);
    paginado = paginado.map((item) => deepPick(item, listaCampos));
  }

  return res.json({
    total: resultados.length,
    pagina,
    limite: tam,
    resultados: paginado,
  });
}
