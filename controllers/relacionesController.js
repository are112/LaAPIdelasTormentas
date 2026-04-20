import { loadCharacter } from "../utils/loadCharacter.js";

// Tipos de relación válidos
const TIPOS_VALIDOS = ["familia", "amigos", "enemigos"];

//
// GET /personajes/:id/relaciones
// Devuelve todas las relaciones del personaje
//
export function personajeRelaciones(req, res) {
  const personaje = loadCharacter(req.params.id);
  if (!personaje) {
    return res.status(404).json({
      error: "Personaje no encontrado",
      id: req.params.id,
    });
  }

  const relaciones = personaje.relaciones;

  if (!relaciones || Object.keys(relaciones).length === 0) {
    return res.status(404).json({
      error: "Este personaje no tiene relaciones registradas",
      id: req.params.id,
    });
  }

  res.json({
    personaje: personaje.nombre,
    relaciones,
  });
}

//
// GET /personajes/:id/relaciones/:tipo
// Devuelve un tipo concreto: familia | amigos | enemigos
//
export function personajeRelacionTipo(req, res) {
  const { id, tipo } = req.params;

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({
      error: `Tipo de relación no válido: "${tipo}"`,
      tipos_validos: TIPOS_VALIDOS,
    });
  }

  const personaje = loadCharacter(id);
  if (!personaje) {
    return res.status(404).json({
      error: "Personaje no encontrado",
      id,
    });
  }

  const grupo = personaje.relaciones?.[tipo];

  if (!grupo || grupo.length === 0) {
    return res.status(404).json({
      error: `El personaje no tiene "${tipo}" registrados`,
      personaje: personaje.nombre,
    });
  }

  res.json({
    personaje: personaje.nombre,
    tipo,
    total: grupo.length,
    resultados: grupo,
  });
}
