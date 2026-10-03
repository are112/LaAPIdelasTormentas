import { personajes, heraldos, spren, ordenes } from "../utils/loaders.js";

// ── Construcción del grafo ────────────────────────────────
// Incluye personajes, heraldos y spren como nodos.
// Se computa una vez al primer acceso y se cachea en memoria.

let grafoCache = null;

// Cada clave de "relaciones" se traduce a uno de estos tipos de arista.
// Personajes usan familia/amigos/enemigos; spren y heraldos usan otras claves.
const TIPO_RELACION = {
  familia:            "familia",
  amigos:             "amigos",
  enemigos:           "enemigos",
  radiante_vinculado: "vinculo",   // spren → su Radiante (vínculo Nahel)
  anterior_radiante:  "vinculo",
  heraldos:           "amigos",    // compañeros Heraldos
  creador:            "otros",
  otros:              "otros",
};
export const TIPOS_ARISTA = ["familia", "amigos", "enemigos", "vinculo", "otros"];

// Si dos entidades se mencionan con tipos distintos (p. ej. Kaladin tiene a
// Sylphrena en "amigos" y ella a él en "radiante_vinculado"), gana el más fuerte.
const PRIORIDAD = { vinculo: 5, familia: 4, enemigos: 3, amigos: 2, otros: 1 };

// Normaliza nombres e IDs para poder casar "Lin Davar" con lin_davar,
// "Padre Tormenta" con padre-tormenta, "Sagaz" con hoid, etc.
function normalizar(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, "")
    .trim()
    .replace(/[\s\-]+/g, "_");
}

// Una relación puede venir como lista, como objeto suelto o como null
function comoLista(valor) {
  if (Array.isArray(valor)) return valor;
  if (valor && typeof valor === "object") return [valor];
  return [];
}

function buildGrafo() {
  if (grafoCache) return grafoCache;

  const fuentes = [
    { tipo: "personaje", loader: personajes },
    { tipo: "heraldo",   loader: heraldos },
    { tipo: "spren",     loader: spren },
  ];

  const nodosMap = new Map();

  // ── Nodos y resolutor de referencias ──────────────────
  const porId    = new Map();   // id normalizado → id real
  const porAlias = new Map();   // nombre/apodo normalizado → Set de ids reales
  const addAlias = (alias, id) => {
    if (!alias || typeof alias !== "string") return;
    const k = normalizar(alias);
    if (!porAlias.has(k)) porAlias.set(k, new Set());
    porAlias.get(k).add(id);
  };

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
      porId.set(normalizar(item.id), item.id);
      addAlias(detalle?.nombre ?? item.nombre, item.id);
      addAlias(detalle?.nombre_completo, item.id);
      addAlias(detalle?.apodo ?? item.apodo, item.id);
      for (const a of detalle?.apodos ?? []) addAlias(a, item.id);
    }
  }

  // Primero por ID; si no, por nombre/apodo siempre que no sea ambiguo
  const resolver = (ref) => {
    if (!ref) return null;
    const k = normalizar(ref);
    if (porId.has(k)) return porId.get(k);
    const candidatos = porAlias.get(k);
    return candidatos && candidatos.size === 1 ? [...candidatos][0] : null;
  };

  // ── Aristas (una por pareja, con el tipo de mayor prioridad) ──
  const porPareja = new Map();
  for (const { loader } of fuentes) {
    for (const item of loader.loadList()) {
      const relaciones = loader.loadOne(item.id)?.relaciones;
      if (!relaciones || typeof relaciones !== "object") continue;

      for (const [clave, valor] of Object.entries(relaciones)) {
        const tipo = TIPO_RELACION[clave] ?? "otros";
        for (const rel of comoLista(valor)) {
          const destino = resolver(rel?.personaje);
          if (!destino || destino === item.id) continue;

          const pareja = [item.id, destino].sort().join("||");
          const previa = porPareja.get(pareja);
          if (previa && PRIORIDAD[previa.tipo] >= PRIORIDAD[tipo]) continue;
          porPareja.set(pareja, {
            origen:      item.id,
            destino,
            tipo,
            descripcion: rel.relacion ?? null,
          });
        }
      }
    }
  }

  const aristas = [...porPareja.values()];
  for (const a of aristas) {
    nodosMap.get(a.origen).grado++;
    nodosMap.get(a.destino).grado++;
  }

  const nodos = [...nodosMap.values()];

  // ── Índice de adyacencia para algoritmos de grafo ──────
  const adyacencia = new Map();
  for (const n of nodos) adyacencia.set(n.id, new Set());
  for (const a of aristas) {
    adyacencia.get(a.origen).add(a.destino);
    adyacencia.get(a.destino).add(a.origen);
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
      por_tipo: Object.fromEntries(
        TIPOS_ARISTA.map((t) => [t, aristas.filter((a) => a.tipo === t).length])
      ),
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

// ── Comunidades por propagación de etiquetas ponderada ────
// Cada nodo adopta la etiqueta con más peso entre sus vecinos hasta que
// nada cambia. Familia y vínculo pesan más; enemigos casi no cuentan, para
// que dos bandos enfrentados no acaben en la misma comunidad.
// Es determinista: siempre da el mismo resultado con los mismos datos.
const PESO_COMUNIDAD = { familia: 3, vinculo: 3, amigos: 2, otros: 1, enemigos: 0.25 };

function detectarComunidades(nodos, aristas) {
  const vecinos = new Map(nodos.map((n) => [n.id, []]));
  for (const a of aristas) {
    const w = PESO_COMUNIDAD[a.tipo] ?? 1;
    vecinos.get(a.origen).push([a.destino, w]);
    vecinos.get(a.destino).push([a.origen, w]);
  }

  const etiqueta = new Map(nodos.map((n) => [n.id, n.id]));
  const orden = [...nodos].sort((a, b) => b.grado - a.grado || a.id.localeCompare(b.id));

  for (let ronda = 0; ronda < 50; ronda++) {
    let cambios = 0;
    for (const n of orden) {
      const lista = vecinos.get(n.id);
      if (!lista.length) continue;
      const pesos = new Map();
      for (const [v, w] of lista) {
        const e = etiqueta.get(v);
        pesos.set(e, (pesos.get(e) || 0) + w);
      }
      const max = Math.max(...pesos.values());
      const actual = etiqueta.get(n.id);
      if (pesos.get(actual) === max) continue;   // si empata, conserva la suya
      const mejor = [...pesos.entries()]
        .filter(([, w]) => w === max)
        .map(([e]) => e)
        .sort()[0];
      etiqueta.set(n.id, mejor);
      cambios++;
    }
    if (!cambios) break;
  }

  const grupos = new Map();
  for (const n of nodos) {
    if (!vecinos.get(n.id).length) continue;           // aislados: no son comunidad
    const e = etiqueta.get(n.id);
    if (!grupos.has(e)) grupos.set(e, []);
    grupos.get(e).push(n);
  }

  return [...grupos.values()]
    .filter((m) => m.length >= 2)
    .sort((a, b) => b.length - a.length)
    .map((miembros, idx) => {
      miembros.sort((a, b) => b.grado - a.grado || a.nombre.localeCompare(b.nombre));
      const ids = new Set(miembros.map((n) => n.id));
      const internas = aristas.filter((a) => ids.has(a.origen) && ids.has(a.destino));

      // Solo cuentan las diez órdenes reales (no tipos de spren ni notas)
      const ordenesValidas = new Set(ordenes.loadList().map((o) => o.nombre));
      const frec = {};
      for (const n of miembros) {
        if (ordenesValidas.has(n.orden)) frec[n.orden] = (frec[n.orden] || 0) + 1;
      }
      const [ordenTop, cuenta] = Object.entries(frec).sort((a, b) => b[1] - a[1])[0] ?? [null, 0];

      const n = miembros.length;
      const destacados = miembros.slice(0, 3).map((m) => m.nombre);
      return {
        id:                 idx,
        nombre:             destacados.join(", "),
        orden_predominante: cuenta >= 2 ? ordenTop : null,
        total_miembros:     n,
        total_aristas:      internas.length,
        densidad:           parseFloat((internas.length / ((n * (n - 1)) / 2)).toFixed(4)),
        miembros:           miembros.map((m) => ({ id: m.id, nombre: m.nombre, tipo: m.tipo, grado: m.grado })),
      };
    });
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
  const minMiembros = Math.max(2, parseInt(req.query.min_miembros) || 2);
  const { nodos, aristas, meta } = buildGrafo();

  const todas = detectarComunidades(nodos, aristas);
  const comunidades = todas.filter((c) => c.total_miembros >= minMiembros);

  res.json({
    meta: {
      total_comunidades: comunidades.length,
      total_nodos:       meta.total_nodos,
      nodos_aislados:    nodos.filter((n) => n.grado === 0).length,
      algoritmo:         "Propagación de etiquetas ponderada por tipo de relación",
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
