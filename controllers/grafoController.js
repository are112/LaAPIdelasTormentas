import { personajes } from "../utils/loaders.js";

// ── Construcción del grafo ────────────────────────────────
// Se computa una vez al primer acceso y se cachea en memoria.
// Se invalida automáticamente si el servidor se reinicia (nuevo deploy).

let grafoCache = null;

function buildGrafo() {
  if (grafoCache) return grafoCache;

  const lista    = personajes.loadList();
  const idsValidos = new Set(lista.map((p) => p.id.toLowerCase()));

  const nodosMap  = new Map();  // id → nodo
  const aristasSet = new Set(); // evitar aristas duplicadas (A→B y B→A)
  const aristas   = [];

  // ── Nodos ─────────────────────────────────────────────
  for (const p of lista) {
    const detalle = personajes.loadOne(p.id);
    nodosMap.set(p.id, {
      id:           p.id,
      nombre:       detalle?.nombre      ?? p.nombre,
      especie:      detalle?.especie     ?? p.especie     ?? null,
      orden:        p.orden              ?? null,
      nivel_ideal:  p.nivel_ideal        ?? null,
      estado_actual: p.estado_actual     ?? null,
      // Número de relaciones válidas — se rellena al procesar aristas
      grado: 0,
    });
  }

  // ── Aristas ───────────────────────────────────────────
  for (const p of lista) {
    const detalle = personajes.loadOne(p.id);
    if (!detalle?.relaciones) continue;

    for (const tipo of ["familia", "amigos", "enemigos"]) {
      for (const rel of detalle.relaciones[tipo] ?? []) {
        const destinoId = rel.personaje?.toLowerCase().trim();

        // Descartar referencias a IDs inexistentes o grupos ficticios
        if (!destinoId || !idsValidos.has(destinoId)) continue;
        // Descartar autoreferencias
        if (destinoId === p.id) continue;

        // Clave canónica para evitar duplicados bidireccionales
        const clave = [p.id, destinoId].sort().join("||") + "||" + tipo;
        if (aristasSet.has(clave)) continue;
        aristasSet.add(clave);

        aristas.push({
          origen:  p.id,
          destino: destinoId,
          tipo,                          // "familia" | "amigos" | "enemigos"
          descripcion: rel.relacion ?? null,
        });

        // Incrementar grado de ambos nodos
        if (nodosMap.has(p.id))       nodosMap.get(p.id).grado++;
        if (nodosMap.has(destinoId))  nodosMap.get(destinoId).grado++;
      }
    }
  }

  const nodos = [...nodosMap.values()];

  grafoCache = {
    meta: {
      total_nodos:   nodos.length,
      total_aristas: aristas.length,
      por_tipo: {
        familia: aristas.filter((a) => a.tipo === "familia").length,
        amigos:  aristas.filter((a) => a.tipo === "amigos").length,
        enemigos: aristas.filter((a) => a.tipo === "enemigos").length,
      },
    },
    nodos,
    aristas,
  };

  return grafoCache;
}

// ── GET /grafo ────────────────────────────────────────────
// Devuelve el grafo completo. Compatible con D3.js, Cytoscape.js, etc.
export function grafoCompleto(req, res) {
  const { tipo, orden, especie, fields } = req.query;
  let { nodos, aristas, meta } = buildGrafo();

  // Filtrar aristas por tipo de relación
  if (tipo) {
    const tipos = tipo.split(",").map((t) => t.trim().toLowerCase());
    aristas = aristas.filter((a) => tipos.includes(a.tipo));
  }

  // Filtrar nodos por orden o especie y recalcular aristas
  if (orden || especie) {
    const idsPermitidos = new Set(
      nodos
        .filter((n) => {
          if (orden   && (n.orden   ?? "").toLowerCase()   !== orden.toLowerCase())   return false;
          if (especie && (n.especie ?? "").toLowerCase()   !== especie.toLowerCase()) return false;
          return true;
        })
        .map((n) => n.id)
    );
    nodos   = nodos.filter((n) => idsPermitidos.has(n.id));
    aristas = aristas.filter((a) => idsPermitidos.has(a.origen) && idsPermitidos.has(a.destino));
  }

  // Selección de campos en nodos
  if (fields) {
    const campos = fields.split(",").map((f) => f.trim());
    nodos = nodos.map((n) => {
      const obj = {};
      for (const c of campos) if (c in n) obj[c] = n[c];
      return obj;
    });
  }

  res.json({
    meta: {
      ...meta,
      total_nodos:   nodos.length,
      total_aristas: aristas.length,
    },
    nodos,
    aristas,
  });
}

// ── GET /grafo/:id ────────────────────────────────────────
// Subgrafo centrado en un personaje: sus conexiones directas (1 salto)
// y opcionalmente las de sus vecinos (2 saltos).
export function grafoPersonaje(req, res) {
  const id     = req.params.id.toLowerCase();
  const saltos = parseInt(req.query.saltos) === 2 ? 2 : 1;
  const { nodos: todosNodos, aristas: todasAristas } = buildGrafo();

  const nodoRaiz = todosNodos.find((n) => n.id === id);
  if (!nodoRaiz) {
    return res.status(404).json({
      error: "Personaje no encontrado en el grafo",
      id,
      sugerencia: "Consulta GET /grafo para ver todos los nodos disponibles",
    });
  }

  // Vecinos directos (1 salto)
  const vecinosDirectos = new Set(
    todasAristas
      .filter((a) => a.origen === id || a.destino === id)
      .map((a) => (a.origen === id ? a.destino : a.origen))
  );
  vecinosDirectos.add(id);

  // Vecinos de vecinos (2 saltos)
  if (saltos === 2) {
    for (const vecino of [...vecinosDirectos]) {
      todasAristas
        .filter((a) => a.origen === vecino || a.destino === vecino)
        .forEach((a) => {
          vecinosDirectos.add(a.origen);
          vecinosDirectos.add(a.destino);
        });
    }
  }

  const nodos   = todosNodos.filter((n) => vecinosDirectos.has(n.id));
  const aristas = todasAristas.filter(
    (a) => vecinosDirectos.has(a.origen) && vecinosDirectos.has(a.destino)
  );

  res.json({
    meta: {
      personaje:     nodoRaiz.nombre,
      saltos,
      total_nodos:   nodos.length,
      total_aristas: aristas.length,
    },
    nodos,
    aristas,
  });
}

// ── GET /grafo/stats ──────────────────────────────────────
// Métricas del grafo: nodos más conectados, distribución de grados, etc.
export function grafoStats(req, res) {
  const { nodos, aristas, meta } = buildGrafo();

  const porGrado = [...nodos].sort((a, b) => b.grado - a.grado);

  const distribucion = {};
  for (const n of nodos) {
    distribucion[n.grado] = (distribucion[n.grado] || 0) + 1;
  }

  const gradoPromedio = nodos.length
    ? (nodos.reduce((s, n) => s + n.grado, 0) / nodos.length).toFixed(2)
    : 0;

  res.json({
    meta,
    grado_promedio:    parseFloat(gradoPromedio),
    nodos_sin_aristas: nodos.filter((n) => n.grado === 0).length,
    top_conectados:    porGrado.slice(0, 10).map((n) => ({ id: n.id, nombre: n.nombre, grado: n.grado })),
    distribucion_grados: distribucion,
  });
}
