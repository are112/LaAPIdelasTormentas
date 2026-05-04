import { loadOrdenes } from "../utils/loadOrdenes.js";
import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";
import { loadSprenList } from "../utils/loadSprenList.js";
import { loadSpren } from "../utils/loadSpren.js";

const ORDENES_EXCLUIDAS = ["ninguna", ""];

function normalizarOrden(nombre) {
  const lower = nombre.toLowerCase();
  if (lower.startsWith("corredor del viento")) return "Corredores del Viento";
  return nombre;
}

function buildPersonajesPorOrden() {
  const lista = loadList();
  const map = {};

  for (const p of lista) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;
    const orden = detalle.orden_radiantes?.orden?.trim();
    if (!orden || ORDENES_EXCLUIDAS.includes(orden.toLowerCase())) continue;
    const ordenNorm = normalizarOrden(orden);
    if (!map[ordenNorm]) map[ordenNorm] = [];
    map[ordenNorm].push({
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

function buildSprenPorOrden() {
  const lista = loadSprenList();
  const map = {};

  for (const s of lista) {
    const detalle = loadSpren(s.id);
    if (!detalle) continue;
    const orden = detalle.vinculo_nahel?.orden_radiante?.trim();
    if (!orden) continue;
    if (!map[orden]) map[orden] = [];
    map[orden].push({
      id: detalle.id,
      nombre: detalle.nombre,
      tipo_spren: detalle.tipo_spren ?? null,
      radiante_actual: detalle.vinculo_nahel?.radiante_actual ?? null,
      estado_vinculo: detalle.vinculo_nahel?.estado_vinculo ?? null,
      estado_actual: detalle.estado_actual ?? null,
    });
  }

  return map;
}

//
// GET /ordenes
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

  res.json({ total_ordenes: resultado.length, ordenes: resultado });
}

//
// GET /ordenes/:nombre
//
export function detalleOrden(req, res) {
  const nombreBuscado = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const ordenes = loadOrdenes();
  const ordenData = ordenes.find(
    (o) => o.nombre.toLowerCase() === nombreBuscado || o.id.toLowerCase() === nombreBuscado
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

//
// GET /ordenes/:nombre/personajes
// Lista de personajes que pertenecen a esta orden
//
export function ordenPersonajes(req, res) {
  const nombreBuscado = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const ordenes = loadOrdenes();
  const ordenData = ordenes.find(
    (o) => o.nombre.toLowerCase() === nombreBuscado || o.id.toLowerCase() === nombreBuscado
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
    orden: ordenData.nombre,
    total: miembros.length,
    personajes: miembros,
  });
}

//
// GET /ordenes/:nombre/spren
// Lista de spren vinculados a esta orden
//
export function ordenSpren(req, res) {
  const nombreBuscado = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const ordenes = loadOrdenes();
  const ordenData = ordenes.find(
    (o) => o.nombre.toLowerCase() === nombreBuscado || o.id.toLowerCase() === nombreBuscado
  );

  if (!ordenData) {
    return res.status(404).json({
      error: `No se encontró la orden "${req.params.nombre}"`,
      sugerencia: "Consulta GET /ordenes para ver las órdenes disponibles",
    });
  }

  const sprenPorOrden = buildSprenPorOrden();
  const spren = sprenPorOrden[ordenData.nombre] ?? [];

  res.json({
    orden: ordenData.nombre,
    spren_tipico: ordenData.spren_tipico ?? null,
    total: spren.length,
    spren,
  });
}
