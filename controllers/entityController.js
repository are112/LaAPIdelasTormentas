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
 * @param {boolean}  [config.femenino=false] - concordancia de los mensajes ("Esquirla no encontrada")
 * @param {Function} [config.enrichList]  - (item, detalle) → campos extra para cada
 *                                          elemento del listado (evita peticiones N+1)
 */
export function createEntityController({
  loadOne,
  loadList,
  singular,
  notFound = {},
  withResumen    = false,
  withRelaciones = false,
  enrichList     = null,
  femenino       = false,
}) {
  const nombreCapital = singular.charAt(0).toUpperCase() + singular.slice(1);
  const noEncontrado  = `${nombreCapital} no encontrad${femenino ? "a" : "o"}`;
  const este          = femenino ? "esta" : "este";
  const error404      = (id) => ({ error: noEncontrado, id, ...notFound });

  // ── GET /entidad ─────────────────────────────────────────
  function listar(req, res) {
    if (!enrichList) return res.json(loadList());
    res.json(loadList().map((item) => ({ ...item, ...enrichList(item, loadOne(item.id)) })));
  }

  // ── GET /entidad/:id ─────────────────────────────────────
  function detalle(req, res) {
    const entidad = loadOne(req.params.id);
    if (!entidad) {
      return res.status(404).json(error404(req.params.id));
    }
    res.json(entidad);
  }

  // ── GET /entidad/:id/:seccion ────────────────────────────
  function seccion(req, res) {
    const entidad = loadOne(req.params.id);
    if (!entidad) {
      return res.status(404).json(error404(req.params.id));
    }
    const sec = req.params.seccion;
    if (!(sec in entidad)) {
      return res.status(404).json({
        error: `La sección "${sec}" no existe en ${este} ${singular}`,
        id: req.params.id,
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
      return res.status(404).json(error404(req.params.id));
    }
    res.json(item);
  }

  // ── GET /entidad/:id/relaciones ──────────────────────────
  function relaciones(req, res) {
    const entidad = loadOne(req.params.id);
    if (!entidad) {
      return res.status(404).json(error404(req.params.id));
    }
    const rels = entidad.relaciones ?? {};
    if (!Object.keys(rels).length) {
      return res.status(404).json({
        error: `${este.charAt(0).toUpperCase() + este.slice(1)} ${singular} no tiene relaciones registradas`,
        id: req.params.id,
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
