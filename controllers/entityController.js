/**
 * Crea los handlers Express estándar para una entidad:
 *   listar   → GET /entidad
 *   detalle  → GET /entidad/:id
 *   seccion  → GET /entidad/:id/:seccion
 *
 * Opcionalmente también:
 *   resumen    → GET /entidad/:id/resumen   (busca en la lista índice)
 *   relaciones → GET /entidad/:id/relaciones
 *
 * @param {object} config
 * @param {Function} config.loadOne      - loader individual (id) → objeto | null
 * @param {Function} config.loadList     - loader de lista () → array
 * @param {string}   config.singular     - nombre legible en singular (para mensajes de error)
 * @param {object}   [config.notFound]   - campos extra en el 404 del detalle
 * @param {boolean}  [config.withResumen=false]    - genera handler resumen
 * @param {boolean}  [config.withRelaciones=false] - genera handler relaciones
 */
export function createEntityController({
  loadOne,
  loadList,
  singular,
  notFound = {},
  withResumen    = false,
  withRelaciones = false,
}) {
  const nombreCapital = singular.charAt(0).toUpperCase() + singular.slice(1);

  // ── GET /entidad ─────────────────────────────────────────
  function listar(req, res) {
    res.json(loadList());
  }

  // ── GET /entidad/:id ─────────────────────────────────────
  function detalle(req, res) {
    const entidad = loadOne(req.params.id);
    if (!entidad) {
      return res.status(404).json({
        error: `${nombreCapital} no encontrado`,
        id: req.params.id,
        ...notFound,
      });
    }
    res.json(entidad);
  }

  // ── GET /entidad/:id/:seccion ────────────────────────────
  function seccion(req, res) {
    const entidad = loadOne(req.params.id);
    if (!entidad) {
      return res.status(404).json({
        error: `${nombreCapital} no encontrado`,
        id: req.params.id,
      });
    }
    const sec = req.params.seccion;
    if (!(sec in entidad)) {
      return res.status(404).json({
        error: `La sección "${sec}" no existe en este ${singular}`,
        secciones_disponibles: Object.keys(entidad),
      });
    }
    res.json(entidad[sec]);
  }

  // ── GET /entidad/:id/resumen ─────────────────────────────
  function resumen(req, res) {
    const id   = req.params.id.toLowerCase();
    const item = loadList().find((x) => String(x.id).toLowerCase() === id);
    if (!item) {
      return res.status(404).json({
        error: `${nombreCapital} no encontrado`,
        id: req.params.id,
      });
    }
    res.json(item);
  }

  // ── GET /entidad/:id/relaciones ──────────────────────────
  function relaciones(req, res) {
    const entidad = loadOne(req.params.id);
    if (!entidad) {
      return res.status(404).json({
        error: `${nombreCapital} no encontrado`,
        id: req.params.id,
      });
    }
    const rels = entidad.relaciones ?? {};
    if (!Object.keys(rels).length) {
      return res.status(404).json({
        error: `Este ${singular} no tiene relaciones registradas`,
      });
    }
    res.json({ id: entidad.id, nombre: entidad.nombre, relaciones: rels });
  }

  // Devuelve solo los handlers que corresponden según config
  return {
    listar,
    detalle,
    seccion,
    ...(withResumen    ? { resumen }    : {}),
    ...(withRelaciones ? { relaciones } : {}),
  };
}
