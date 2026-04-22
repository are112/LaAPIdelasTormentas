import { loadOrdenes } from "../utils/loadOrdenes.js";
import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";

// IDs de orden que no son órdenes reales y deben ignorarse
const ORDENES_EXCLUIDAS = ["ninguna", ""];

/**
 * Construye el mapa de personajes agrupados por nombre de orden.
 * Se ejecuta una vez y se reutiliza en ambos handlers.
 */
function buildPersonajesPorOrden() {
  const lista = loadList();
  const map = {};

  for (const p of lista) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;

    const orden = detalle.orden_radiantes?.orden?.trim();
    if (!orden || ORDENES_EXCLUIDAS.includes(orden.toLowerCase())) continue;

    // Normalizar variantes (ej: "Corredor del Viento (caído...)" → "Corredores del Viento")
    const ordenNormalizada = normalizarOrden(orden);

    if (!map[ordenNormalizada]) map[ordenNormalizada] = [];

    map[ordenNormalizada].push({
      id: detalle.id,
      nombre: detalle.nombre,
      nivel_ideal: detalle.orden_radiantes?.nivel_ideal ?? null,
      spren_asociado: detalle.orden_radiantes?.spren_asociado ?? null,
      estado_del_vinculo: detalle.orden_radiantes?.estado_del_vinculo ?? null,
      estado_actual: detalle.estado_actual ?? null,
      habilidades_magicas: detalle.habilidades?.magia ?? null,
    });
  }

  return map;
}

/**
 * Normaliza variantes de nombres de orden al nombre canónico.
 * Por ejemplo: "Corredor del Viento (caído / nunca completado el vínculo)"
 * se mapea a "Corredores del Viento".
 */
function normalizarOrden(nombre) {
  const lower = nombre.toLowerCase();
  if (lower.startsWith("corredor del viento")) return "Corredores del Viento";
  return nombre;
}

//
// GET /ordenes
// Lista todas las órdenes con sus datos estáticos y el número de personajes
//
export function listarOrdenes(req, res) {
  const ordenes = loadOrdenes();
  const personajesPorOrden = buildPersonajesPorOrden();

  const resultado = ordenes.map((orden) => ({
    id: orden.id,
    nombre: orden.nombre,
    herald: orden.herald,
    virtud: orden.virtud,
    potencias: orden.potencias,
    spren_tipico: orden.spren_tipico,
    imagen: orden.imagen,
    total_personajes: personajesPorOrden[orden.nombre]?.length ?? 0,
  }));

  res.json({
    total_ordenes: resultado.length,
    ordenes: resultado,
  });
}

//
// GET /ordenes/:nombre
// Detalle completo de una orden: datos estáticos + todos sus personajes
//
export function detalleOrden(req, res) {
  const nombreBuscado = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const ordenes = loadOrdenes();

  // Buscar la orden por nombre o por id
  const ordenData = ordenes.find(
    (o) =>
      o.nombre.toLowerCase() === nombreBuscado ||
      o.id.toLowerCase() === nombreBuscado
  );

  if (!ordenData) {
    return res.status(404).json({
      error: `No se encontró la orden "${req.params.nombre}"`,
      sugerencia: "Consulta GET /ordenes para ver las órdenes disponibles",
    });
  }

  const personajesPorOrden = buildPersonajesPorOrden();
  const miembros = personajesPorOrden[ordenData.nombre] ?? [];

  res.json({
    id: ordenData.id,
    nombre: ordenData.nombre,
    herald: ordenData.herald,
    virtud: ordenData.virtud,
    defecto: ordenData.defecto,
    potencias: ordenData.potencias,
    spren_tipico: ordenData.spren_tipico,
    descripcion: ordenData.descripcion,
    imagen: ordenData.imagen,
    total_personajes: miembros.length,
    personajes: miembros,
  });
}
