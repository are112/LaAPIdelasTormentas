import { personajes, heraldos, spren } from "../utils/loaders.js";

// ── Construcción del grafo ────────────────────────────────
// Incluye personajes, heraldos y spren como nodos.
// Se computa una vez al primer acceso y se cachea en memoria.

let grafoCache = null;

function buildGrafo() {
  if (grafoCache) return grafoCache;

  const fuentes = [
    { tipo: "personaje", loader: personajes },
    { tipo: "heraldo",   loader: heraldos },
    { tipo: "spren",     loader: spren },
  ];

  const nodosMap   = new Map();
  const aristasSet = new Set();
  const aristas    = [];

  // Índice global de IDs válidos
  const idsValidos = new Set();
  for (const { loader } of fuentes) {
    for (const item of loader.loadList()) idsValidos.add(item.id.toLowerCase());
  }

  // Nodos
  for (const { tipo, loader } of fuentes) {
    for (const item of loader.loadList()) {
      const detalle = loader.loadOne(item.id);
      nodosMap.set(item.id, {
        id:            item.id,
        nombre:        detalle?.nombre        ?? item.nombre,
        tipo,
        especie:       detalle?.especie       ?? item.especie       ?? null,
        orden:         item.orden             ?? detalle?.tipo_spren ?? null,
        nivel_ideal:   item.nivel_ideal       ?? null,
        estado_actual: item.estado_actual     ?? detalle?.estado_actual ?? null,
        grado: 0,
      });
    }
  }

  // Aristas
  for (const { loader } of fuentes) {
    for (const item of loader.loadList()) {
      const detalle = loader.loadOne(item.id);
      if (!detalle?.relaciones) continue;

      for (const tipoRel of ["familia", "amigos", "enemigos"]) {
        for (const rel of detalle.relaciones[tipoRel] ?? []) {
          const destinoId = rel.personaje?.toLowerCase().trim();
          if (!destinoId || !idsValidos.has(destinoId) || destinoId === item.id) continue;

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

  // ── Índice de adyacencia para algoritmos de grafo ──────
  // Map id → Set de ids vecinos (grafo no dirigido)
  const adyacencia = new Map();
  for (const n of nodos) adyacencia.set(n.id, new Set());
  for (const a of aristas) {
    adyacencia.get(a.origen)?.add(a.destino);
    adyacencia.get(a.destino)?.add(a.origen);
  }

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
    nodosMap,
    aristas,
    adyacencia,
  };

  return grafoCache;
}

// ── BFS: camino más corto entre dos nodos ─────────────────
// Devuelve el array de IDs del camino, o null si no existe.
function bfs(desde, hasta, adyacencia) {
  if (desde === hasta) return [desde];
  const visitados = new Map(); // id → id_padre
  visitados.set(desde, null);
  const cola = [desde];

  while (cola.length) {
    const actual = cola.shift();
    for (const vecino of adyacencia.get(actual) ?? []) {
      if (visitados.has(vecino)) continue;
      visitados.set(vecino, actual);
      if (vecino === hasta) {
        // Reconstruir camino
        const camino = [];
        let cur = hasta;
        while (cur !== null) { camino.unshift(cur); cur = visitados.get(cur); }
        return camino;
      }
      cola.push(vecino);
    }
  }
  return null; // sin conexión
}

// ── Comunidades por componentes conexas + densidad ────────
// Algoritmo: Union-Find para componentes + agrupación por orden/especie
// para sub-comunidades dentro de la componente principal.
function detectarComunidades(nodos, aristas, adyacencia) {
  // 1. Componentes conexas con BFS
  const componente = new Map(); // id → componenteId
  let compId = 0;

  for (const nodo of nodos) {
    if (componente.has(nodo.id)) continue;
    const cola = [nodo.id];
    componente.set(nodo.id, compId);
    while (cola.length) {
      const actual = cola.shift();
      for (const vecino of adyacencia.get(actual) ?? []) {
        if (componente.has(vecino)) continue;
        componente.set(vecino, compId);
        cola.push(vecino);
      }
    }
    compId++;
  }

  // 2. Agrupar nodos por componente
  const grupos = new Map(); // compId → [nodos]
  for (const nodo of nodos) {
    const c = componente.get(nodo.id);
    if (!grupos.has(c)) grupos.set(c, []);
    grupos.get(c).push(nodo);
  }

  // 3. Construir resultado ordenado por tamaño
  const comunidades = [...grupos.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([, miembros], idx) => {
      const ids = new Set(miembros.map((n) => n.id));
      const aristasInternas = aristas.filter(
        (a) => ids.has(a.origen) && ids.has(a.destino)
      );

      // Nombre de la comunidad: orden más frecuente entre sus miembros
      const frecOrdenes = {};
      for (const n of miembros) {
        const k = n.orden ?? n.tipo ?? "Desconocido";
        if (k && k !== "Ninguna") frecOrdenes[k] = (frecOrdenes[k] || 0) + 1;
      }
      const ordenPrincipal = Object.entries(frecOrdenes)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Comunidad " + (idx + 1);

      // Densidad: aristas reales / aristas posibles
      const n = miembros.length;
      const posibles = n > 1 ? (n * (n - 1)) / 2 : 1;
      const densidad = parseFloat((aristasInternas.length / posibles).toFixed(4));

      return {
        id:              idx,
        nombre:          ordenPrincipal,
        total_miembros:  miembros.length,
        total_aristas:   aristasInternas.length,
        densidad,
        miembros: miembros
          .sort((a, b) => b.grado - a.grado)
          .map((n) => ({ id: n.id, nombre: n.nombre, tipo: n.tipo, grado: n.grado })),
      };
    });

  return comunidades;
}

// ── GET /grafo ────────────────────────────────────────────
export function grafoCompleto(req, res) {
  const { tipo, orden, especie, entidad, fields } = req.query;
  let { nodos, aristas, meta } = buildGrafo();

  if (tipo) {
    const tipos = tipo.split(",").map((t) => t.trim().toLowerCase());
    aristas = aristas.filter((a) => tipos.includes(a.tipo));
  }

  const filtrosNodo = {};
  if (entidad) filtrosNodo.tipo    = entidad.toLowerCase();
  if (orden)   filtrosNodo.orden   = orden.toLowerCase();
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

// ── GET /grafo/camino?desde=X&hasta=Y ────────────────────
// Encuentra el camino más corto entre dos entidades.
// Opcionalmente filtra por tipo de relación: ?tipo=familia,amigos
export function grafoCamino(req, res) {
  const { desde, hasta, tipo } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({
      error: "Se requieren los parámetros 'desde' y 'hasta'",
      ejemplo: "/grafo/camino?desde=kaladin&hasta=taravangian",
    });
  }

  const desdeId = desde.toLowerCase().trim();
  const hastaId = hasta.toLowerCase().trim();

  const { nodosMap, aristas, adyacencia } = buildGrafo();

  if (!nodosMap.has(desdeId)) {
    return res.status(404).json({ error: `Entidad no encontrada: "${desde}"` });
  }
  if (!nodosMap.has(hastaId)) {
    return res.status(404).json({ error: `Entidad no encontrada: "${hasta}"` });
  }

  // Si se filtra por tipo, construir adyacencia reducida
  let adj = adyacencia;
  if (tipo) {
    const tipos = tipo.split(",").map((t) => t.trim().toLowerCase());
    const aristasFiltradas = aristas.filter((a) => tipos.includes(a.tipo));
    adj = new Map();
    for (const n of nodosMap.keys()) adj.set(n, new Set());
    for (const a of aristasFiltradas) {
      adj.get(a.origen)?.add(a.destino);
      adj.get(a.destino)?.add(a.origen);
    }
  }

  const camino = bfs(desdeId, hastaId, adj);

  if (!camino) {
    return res.json({
      conectados: false,
      desde:  nodosMap.get(desdeId)?.nombre ?? desdeId,
      hasta:  nodosMap.get(hastaId)?.nombre ?? hastaId,
      mensaje: "No existe ningún camino entre estas dos entidades",
      ...(tipo ? { filtro_tipo: tipo } : {}),
    });
  }

  // Enriquecer el camino con datos de cada nodo y la arista que los conecta
  const pasos = camino.map((id, idx) => {
    const nodo = nodosMap.get(id);
    const arista = idx < camino.length - 1
      ? aristas.find(
          (a) =>
            (a.origen === id && a.destino === camino[idx + 1]) ||
            (a.destino === id && a.origen === camino[idx + 1])
        )
      : null;
    return {
      paso:        idx + 1,
      id:          nodo.id,
      nombre:      nodo.nombre,
      tipo:        nodo.tipo,
      orden:       nodo.orden,
      ...(arista ? {
        conexion: {
          tipo:        arista.tipo,
          descripcion: arista.descripcion,
          hacia:       camino[idx + 1],
        },
      } : {}),
    };
  });

  res.json({
    conectados:   true,
    desde:        nodosMap.get(desdeId)?.nombre ?? desdeId,
    hasta:        nodosMap.get(hastaId)?.nombre ?? hastaId,
    distancia:    camino.length - 1,
    ...(tipo ? { filtro_tipo: tipo } : {}),
    camino:       camino,
    pasos,
  });
}

// ── GET /grafo/comunidades ────────────────────────────────
// Detecta grupos de entidades interconectadas.
// ?min_miembros=N filtra comunidades con menos de N miembros.
export function grafoComunidades(req, res) {
  const minMiembros = parseInt(req.query.min_miembros) || 1;
  const { nodos, aristas, adyacencia, meta } = buildGrafo();

  const comunidades = detectarComunidades(nodos, aristas, adyacencia)
    .filter((c) => c.total_miembros >= minMiembros);

  res.json({
    meta: {
      total_comunidades: comunidades.length,
      total_nodos:       meta.total_nodos,
      algoritmo:         "BFS por componentes conexas",
    },
    comunidades,
  });
}

// ── GET /grafo/:id ────────────────────────────────────────
export function grafoEntidad(req, res) {
  const id     = req.params.id.toLowerCase();
  const saltos = parseInt(req.query.saltos) === 2 ? 2 : 1;
  const { nodosMap, nodos: todosNodos, aristas: todasAristas, adyacencia } = buildGrafo();

  const nodoRaiz = nodosMap.get(id);
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
    meta: {
      entidad:       nodoRaiz.nombre,
      tipo:          nodoRaiz.tipo,
      saltos,
      total_nodos:   nodos.length,
      total_aristas: aristas.length,
    },
    nodos,
    aristas,
  });
}
