import { personajes, heraldos, spren } from "../utils/loaders.js";

// ── Construcción del grafo ────────────────────────────────
// Incluye personajes, heraldos y spren como nodos.
// Se computa una vez al primer acceso y se cachea en memoria.

let grafoCache = null;

function buildGrafo() {
  if (grafoCache) return grafoCache;

  // ── Fuentes de datos por tipo de entidad ──────────────
  const fuentes = [
    { tipo: "personaje", loader: personajes, dir: "personajes" },
    { tipo: "heraldo",   loader: heraldos,   dir: "heraldos" },
    { tipo: "spren",     loader: spren,      dir: "spren" },
  ];

  const nodosMap   = new Map();  // id → nodo
  const aristasSet = new Set();  // evitar duplicados bidireccionales
  const aristas    = [];

  // ── Construir índice global de IDs válidos ────────────
  const idsValidos = new Set();
  for (const { loader } of fuentes) {
    for (const item of loader.loadList()) {
      idsValidos.add(item.id.toLowerCase());
    }
  }

  // ── Nodos ─────────────────────────────────────────────
  for (const { tipo, loader } of fuentes) {
    for (const item of loader.loadList()) {
      const detalle = loader.loadOne(item.id);
      nodosMap.set(item.id, {
        id:           item.id,
        nombre:       detalle?.nombre       ?? item.nombre,
        tipo,                                               // "personaje" | "heraldo" | "spren"
        especie:      detalle?.especie      ?? item.especie      ?? null,
        orden:        item.orden            ?? detalle?.tipo_spren ?? null,
        nivel_ideal:  item.nivel_ideal      ?? null,
        estado_actual: item.estado_actual   ?? detalle?.estado_actual ?? null,
        grado: 0,
      });
    }
  }

  // ── Aristas ───────────────────────────────────────────
  for (const { loader } of fuentes) {
    for (const item of loader.loadList()) {
      const detalle = loader.loadOne(item.id);
      if (!detalle?.relaciones) continue;

      for (const tipoRel of ["familia", "amigos", "enemigos"]) {
        for (const rel of detalle.relaciones[tipoRel] ?? []) {
          const destinoId = rel.personaje?.toLowerCase().trim();

          if (!destinoId || !idsValidos.has(destinoId)) continue;
          if (destinoId === item.id) continue;

          const clave = [item.id, destinoId].sort().join("||") + "||" + tipoRel;
          if (aristasSet.has(clave)) continue;
          aristasSet.add(clave);

          aristas.push({
            origen:      item.id,
            destino:     destinoId,
            tipo:        tipoRel,
            descripcion: rel.relacion ?? null,
          });

          if (nodosMap.has(item.id))    nodosMap.get(item.id).grado++;
          if (nodosMap.has(destinoId))  nodosMap.get(destinoId).grado++;
        }
      }
    }
  }

  const nodos = [...nodosMap.values()];

  grafoCache = {
    meta: {
      total_nodos:   nodos.length,
      total_aristas: aristas.length,
      por_entidad: {
        personajes: nodos.filter((n) => n.tipo === "personaje").length,
        heraldos:   nodos.filter((n) => n.tipo === "heraldo").length,
        spren:      nodos.filter((n) => n.tipo === "spren").length,
      },
      por_tipo: {
        familia:  aristas.filter((a) => a.tipo === "familia").length,
        amigos:   aristas.filter((a) => a.tipo === "amigos").length,
        enemigos: aristas.filter((a) => a.tipo === "enemigos").length,
      },
    },
    nodos,
    aristas,
  };

  return grafoCache;
}

// ── GET /grafo ────────────────────────────────────────────
export function grafoCompleto(req, res) {
  const { tipo, orden, especie, entidad, fields } = req.query;
  let { nodos, aristas, meta } = buildGrafo();

  // Filtrar aristas por tipo de relación (familia, amigos, enemigos)
  if (tipo) {
    const tipos = tipo.split(",").map((t) => t.trim().toLowerCase());
    aristas = aristas.filter((a) => tipos.includes(a.tipo));
  }

  // Filtrar nodos por tipo de entidad (personaje, heraldo, spren)
  const filtrosNodo = {};
  if (entidad) filtrosNodo.tipo   = entidad.toLowerCase();
  if (orden)   filtrosNodo.orden  = orden.toLowerCase();
  if (especie) filtrosNodo.especie = especie.toLowerCase();

  if (Object.keys(filtrosNodo).length) {
    const idsPermitidos = new Set(
      nodos
        .filter((n) => Object.entries(filtrosNodo).every(([k, v]) => (n[k] ?? "").toLowerCase() === v))
        .map((n) => n.id)
    );
    nodos   = nodos.filter((n) => idsPermitidos.has(n.id));
    aristas = aristas.filter((a) => idsPermitidos.has(a.origen) && idsPermitidos.has(a.destino));
  }

  if (fields) {
    const campos = fields.split(",").map((f) => f.trim());
    nodos = nodos.map((n) => Object.fromEntries(campos.filter((c) => c in n).map((c) => [c, n[c]])));
  }

  res.json({ meta: { ...meta, total_nodos: nodos.length, total_aristas: aristas.length }, nodos, aristas });
}

// ── GET /grafo/:id ────────────────────────────────────────
export function grafoEntidad(req, res) {
  const id     = req.params.id.toLowerCase();
  const saltos = parseInt(req.query.saltos) === 2 ? 2 : 1;
  const { nodos: todosNodos, aristas: todasAristas } = buildGrafo();

  const nodoRaiz = todosNodos.find((n) => n.id === id);
  if (!nodoRaiz) {
    return res.status(404).json({
      error: "Entidad no encontrada en el grafo",
      id,
      sugerencia: "Consulta GET /grafo para ver todos los nodos disponibles",
    });
  }

  const vecinos = new Set(
    todasAristas
      .filter((a) => a.origen === id || a.destino === id)
      .map((a) => (a.origen === id ? a.destino : a.origen))
  );
  vecinos.add(id);

  if (saltos === 2) {
    for (const vecino of [...vecinos]) {
      todasAristas
        .filter((a) => a.origen === vecino || a.destino === vecino)
        .forEach((a) => { vecinos.add(a.origen); vecinos.add(a.destino); });
    }
  }

  const nodos   = todosNodos.filter((n) => vecinos.has(n.id));
  const aristas = todasAristas.filter((a) => vecinos.has(a.origen) && vecinos.has(a.destino));

  res.json({
    meta: { entidad: nodoRaiz.nombre, tipo: nodoRaiz.tipo, saltos, total_nodos: nodos.length, total_aristas: aristas.length },
    nodos,
    aristas,
  });
}

// ── GET /grafo/stats ──────────────────────────────────────
export function grafoStats(req, res) {
  const { nodos, aristas, meta } = buildGrafo();

  const porGrado = [...nodos].sort((a, b) => b.grado - a.grado);
  const distribucion = {};
  for (const n of nodos) distribucion[n.grado] = (distribucion[n.grado] || 0) + 1;

  res.json({
    meta,
    grado_promedio:    parseFloat((nodos.reduce((s, n) => s + n.grado, 0) / nodos.length).toFixed(2)),
    nodos_sin_aristas: nodos.filter((n) => n.grado === 0).length,
    top_conectados:    porGrado.slice(0, 10).map((n) => ({ id: n.id, nombre: n.nombre, tipo: n.tipo, grado: n.grado })),
    distribucion_grados: distribucion,
  });
}
