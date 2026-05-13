import { ordenes as ordenesLoader, personajes, spren as sprenLoader } from "../utils/loaders.js";

const { loadList: loadOrdenes }                            = ordenesLoader;
const { loadOne: loadCharacter, loadList }                 = personajes;
const { loadOne: loadSpren,     loadList: loadSprenList }   = sprenLoader;

const ORDENES_EXCLUIDAS = ["ninguna", ""];

function normalizarOrden(nombre) {
  if (nombre.toLowerCase().startsWith("corredor del viento")) return "Corredores del Viento";
  return nombre;
}

function buildPersonajesPorOrden() {
  const map = {};
  for (const p of loadList()) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;
    const orden = detalle.orden_radiantes?.orden?.trim();
    if (!orden || ORDENES_EXCLUIDAS.includes(orden.toLowerCase())) continue;
    const ordenNorm = normalizarOrden(orden);
    if (!map[ordenNorm]) map[ordenNorm] = [];
    map[ordenNorm].push({
      id:                  detalle.id,
      nombre:              detalle.nombre,
      nivel_ideal:         detalle.orden_radiantes?.nivel_ideal ?? null,
      spren_asociado:      detalle.orden_radiantes?.spren_asociado ?? null,
      estado_del_vinculo:  detalle.orden_radiantes?.estado_del_vinculo ?? null,
      estado_actual:       detalle.estado_actual ?? null,
      habilidades_magicas: detalle.habilidades?.magia ?? null,
    });
  }
  return map;
}

function buildSprenPorOrden() {
  const map = {};
  for (const s of loadSprenList()) {
    const detalle = loadSpren(s.id);
    if (!detalle) continue;
    const orden = detalle.vinculo_nahel?.orden_radiante?.trim();
    if (!orden) continue;
    if (!map[orden]) map[orden] = [];
    map[orden].push({
      id:              detalle.id,
      nombre:          detalle.nombre,
      tipo_spren:      detalle.tipo_spren ?? null,
      radiante_actual: detalle.vinculo_nahel?.radiante_actual ?? null,
      estado_vinculo:  detalle.vinculo_nahel?.estado_vinculo ?? null,
      estado_actual:   detalle.estado_actual ?? null,
    });
  }
  return map;
}

export function listarOrdenes(req, res) {
  const ords = loadOrdenes();
  const ppo  = buildPersonajesPorOrden();
  res.json({
    total_ordenes: ords.length,
    ordenes: ords.map((o) => ({
      id: o.id, nombre: o.nombre, herald: o.herald, virtud: o.virtud,
      potencias: o.potencias, spren_tipico: o.spren_tipico, imagen: o.imagen,
      total_personajes: ppo[o.nombre]?.length ?? 0,
    })),
  });
}

export function detalleOrden(req, res) {
  const busq = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const ordenData = loadOrdenes().find((o) => o.nombre.toLowerCase() === busq || o.id.toLowerCase() === busq);
  if (!ordenData) return res.status(404).json({ error: `No se encontró la orden "${req.params.nombre}"`, sugerencia: "Consulta GET /ordenes" });
  const miembros = buildPersonajesPorOrden()[ordenData.nombre] ?? [];
  res.json({ id: ordenData.id, nombre: ordenData.nombre, herald: ordenData.herald, virtud: ordenData.virtud,
    defecto: ordenData.defecto, potencias: ordenData.potencias, spren_tipico: ordenData.spren_tipico,
    descripcion: ordenData.descripcion, imagen: ordenData.imagen, total_personajes: miembros.length, personajes: miembros });
}

export function ordenPersonajes(req, res) {
  const busq = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const ordenData = loadOrdenes().find((o) => o.nombre.toLowerCase() === busq || o.id.toLowerCase() === busq);
  if (!ordenData) return res.status(404).json({ error: `No se encontró la orden "${req.params.nombre}"`, sugerencia: "Consulta GET /ordenes" });
  const miembros = buildPersonajesPorOrden()[ordenData.nombre] ?? [];
  res.json({ orden: ordenData.nombre, total: miembros.length, personajes: miembros });
}

export function ordenSpren(req, res) {
  const busq = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const ordenData = loadOrdenes().find((o) => o.nombre.toLowerCase() === busq || o.id.toLowerCase() === busq);
  if (!ordenData) return res.status(404).json({ error: `No se encontró la orden "${req.params.nombre}"`, sugerencia: "Consulta GET /ordenes" });
  const spren = buildSprenPorOrden()[ordenData.nombre] ?? [];
  res.json({ orden: ordenData.nombre, spren_tipico: ordenData.spren_tipico ?? null, total: spren.length, spren });
}
