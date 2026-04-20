import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";

//
// GET /ordenes
// Lista todas las órdenes con el número de personajes de cada una
//
export function listarOrdenes(req, res) {
  const lista = loadList();
  const ordenesMap = {};

  for (const p of lista) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;

    const orden = detalle.orden_radiantes?.orden;
    if (!orden || orden.trim() === "") continue;

    if (!ordenesMap[orden]) {
      ordenesMap[orden] = {
        nombre: orden,
        total_personajes: 0,
        personajes: [],
      };
    }

    ordenesMap[orden].total_personajes++;
    ordenesMap[orden].personajes.push({
      id: detalle.id,
      nombre: detalle.nombre,
      nivel_ideal: detalle.orden_radiantes?.nivel_ideal ?? null,
      estado_actual: detalle.estado_actual ?? null,
    });
  }

  const ordenes = Object.values(ordenesMap).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es")
  );

  res.json({
    total_ordenes: ordenes.length,
    ordenes,
  });
}

//
// GET /ordenes/:nombre
// Detalle de una orden concreta con todos sus personajes
//
export function detalleOrden(req, res) {
  const nombreBuscado = decodeURIComponent(req.params.nombre).toLowerCase().trim();
  const lista = loadList();

  const personajesDeLaOrden = [];
  let nombreOficial = null;

  for (const p of lista) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;

    const orden = detalle.orden_radiantes?.orden;
    if (!orden || orden.trim() === "") continue;

    if (orden.toLowerCase() === nombreBuscado) {
      nombreOficial = orden;
      personajesDeLaOrden.push({
        id: detalle.id,
        nombre: detalle.nombre,
        nivel_ideal: detalle.orden_radiantes?.nivel_ideal ?? null,
        spren_asociado: detalle.orden_radiantes?.spren_asociado ?? null,
        estado_del_vinculo: detalle.orden_radiantes?.estado_del_vinculo ?? null,
        estado_actual: detalle.estado_actual ?? null,
        habilidades_magicas: detalle.habilidades?.magia ?? null,
      });
    }
  }

  if (personajesDeLaOrden.length === 0) {
    return res.status(404).json({
      error: `No se encontró la orden "${req.params.nombre}"`,
      sugerencia: "Consulta GET /ordenes para ver las órdenes disponibles",
    });
  }

  res.json({
    orden: nombreOficial,
    total_personajes: personajesDeLaOrden.length,
    personajes: personajesDeLaOrden,
  });
}
