import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";

//
// =========================
//  HELPERS (deep get/pick)
// =========================
//

// Obtiene un valor profundo usando "a.b.c"
function deepGet(obj, path) {
  if (!path || typeof path !== "string") return undefined;
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

// Construye un objeto de salida con estructura anidada
function deepSet(target, path, value) {
  const keys = path.split(".");
  let ref = target;

  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      ref[k] = value;
    } else {
      if (!ref[k] || typeof ref[k] !== "object") {
        ref[k] = {};
      }
      ref = ref[k];
    }
  });
}

// Extrae solo los campos indicados (rutas profundas)
function deepPick(obj, paths = []) {
  if (!paths || paths.length === 0) return obj; // sin fields → devuelve todo
  const result = {};
  for (const p of paths) {
    const v = deepGet(obj, p);
    if (v !== undefined) deepSet(result, p, v);
  }
  return result;
}

// Obtiene un valor para ordenación; acepta ruta profunda
function getSortValue(obj, pathOrKey) {
  const raw = pathOrKey.includes(".") ? deepGet(obj, pathOrKey) : obj?.[pathOrKey];
  // Normalizamos a string para comparación consistente
  return JSON.stringify(raw ?? "").toLowerCase();
}

//
// ======================================
//      CONTROLADOR PRINCIPAL DE BÚSQUEDA
// ======================================
//

export function buscar(req, res) {
  const {
    // filtros “explícitos”
    id,
    orden,
    nivel_ideal,
    especie,
    sexo,
    nacionalidad,
    origen,
    estado_actual,
    afiliacion,
    libro,
    texto,
    // utilidades
    sort,
    page,
    limit,
    fields,
    // filtros dinámicos (rutas profundas)
    ...otrosFiltros
  } = req.query;

  const lista = loadList();
  let resultados = [];

  //
  // Si viene ?id=..., limitamos la iteración (opcional y eficiente)
  //
  const idsARecorrer = id
    ? lista.filter((x) => String(x.id).toLowerCase() === String(id).toLowerCase())
    : lista;

  //
  // === PROCESO PRINCIPAL DE FILTRO POR PERSONAJE ===
  //
  for (const p of idsARecorrer) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;

    let coincide = true;

    // -----------------------------
    // ORDEN RADIANTE
    // -----------------------------
    if (orden) {
      const val = String(detalle.orden_radiantes?.orden ?? "").toLowerCase();
      if (val !== orden.toLowerCase()) coincide = false;
    }

    // -----------------------------
    // NIVEL IDEAL (con operadores)
    // -----------------------------
    if (nivel_ideal) {
      const valor = Number(detalle.orden_radiantes?.nivel_ideal);
      if (Number.isNaN(valor)) {
        coincide = false;
      } else {
        if (nivel_ideal.includes(">=")) {
          const n = parseInt(nivel_ideal.split(">=")[1]);
          if (!(valor >= n)) coincide = false;
        } else if (nivel_ideal.includes("<=")) {
          const n = parseInt(nivel_ideal.split("<=")[1]);
          if (!(valor <= n)) coincide = false;
        } else if (nivel_ideal.includes(">")) {
          const n = parseInt(nivel_ideal.split(">")[1]);
          if (!(valor > n)) coincide = false;
        } else if (nivel_ideal.includes("<")) {
          const n = parseInt(nivel_ideal.split("<")[1]);
          if (!(valor < n)) coincide = false;
        } else {
          const n = parseInt(nivel_ideal);
          if (valor !== n) coincide = false;
        }
      }
    }

    // -----------------------------
    // ATRIBUTOS GENERALES
    // -----------------------------
    if (especie && String(detalle.especie ?? "").toLowerCase() !== especie.toLowerCase())
      coincide = false;

    if (sexo && String(detalle.sexo ?? "").toLowerCase() !== sexo.toLowerCase())
      coincide = false;

    if (
      nacionalidad &&
      String(detalle.nacionalidad ?? "").toLowerCase() !== nacionalidad.toLowerCase()
    )
      coincide = false;

    if (origen && String(detalle.origen ?? "").toLowerCase() !== origen.toLowerCase())
      coincide = false;

    if (
      estado_actual &&
      String(detalle.estado_actual ?? "").toLowerCase() !== estado_actual.toLowerCase()
    )
      coincide = false;

    // -----------------------------
    // AFILIACIONES
    // -----------------------------
    if (afiliacion) {
      const tiene = (detalle.afiliaciones ?? []).some(
        (a) => String(a).toLowerCase() === afiliacion.toLowerCase()
      );
      if (!tiene) coincide = false;
    }

    // -----------------------------
    // LIBROS EN LOS QUE APARECE
    // -----------------------------
    if (libro) {
      const aparece = (detalle.apariciones?.libros ?? []).some(
        (l) => String(l.titulo ?? "").toLowerCase() === libro.toLowerCase()
      );
      if (!aparece) coincide = false;
    }

    // -----------------------------
    // TEXTO LIBRE
    // -----------------------------
    if (texto) {
      const contenido = JSON.stringify(detalle).toLowerCase();
      if (!contenido.includes(texto.toLowerCase())) coincide = false;
    }

    // -----------------------------
    // FILTRADO DINÁMICO PROFUNDO
    // Permite: ?situacion_actual.rol=sanador
    //          ?habilidades.magia.potencias=Gravitación
    //          ?orden_radiantes.spren_asociado=Sylphrena
    // -----------------------------
    for (const clave of Object.keys(otrosFiltros)) {
      // si alguno de estos filtros no coincide, descartamos
      const valorFiltro = String(otrosFiltros[clave]).toLowerCase();
      const contenidoBruto = deepGet(detalle, clave); // ruta profunda
      const contenido = JSON.stringify(contenidoBruto ?? "").toLowerCase();
      if (!contenido.includes(valorFiltro)) {
        coincide = false;
        break;
      }
    }

    if (coincide) resultados.push(detalle);
  }

  //
  // --- SI NO HAY RESULTADOS ---
  //
  if (resultados.length === 0) {
    return res.json({
      mensaje:
        "No se ha encontrado ningún personaje que cumpla los parámetros de búsqueda.",
      resultados: [],
    });
  }

  //
  // --- ORDENACIÓN (acepta rutas profundas)
  //
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

  //
  // --- PAGINACIÓN ---
  //
  const pagina = parseInt(page) || 1;
  const tam = parseInt(limit) || resultados.length;

  const inicio = (pagina - 1) * tam;
  const fin = pagina * tam;

  let paginado = resultados.slice(inicio, fin);

  //
  // --- APLICAR `fields=` (rutas profundas, separadas por coma)
  //
  if (fields) {
    const listaCampos = fields
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    paginado = paginado.map((personaje) => deepPick(personaje, listaCampos));
  }

  //
  // --- RESPUESTA FINAL ---
  //
  return res.json({
    total: resultados.length,
    pagina,
    limite: tam,
    resultados: paginado,
  });
}