import { loadSprenList } from "../utils/loadSprenList.js";
import { loadSpren } from "../utils/loadSpren.js";

//
// GET /spren
// Lista resumida de todos los spren
//
export function listarSpren(req, res) {
  const lista = loadSprenList();
  res.json(lista);
}

//
// GET /spren/:id
// Detalle completo de un spren
//
export function sprenDetalle(req, res) {
  const spren = loadSpren(req.params.id);
  if (!spren) {
    return res.status(404).json({
      error: "Spren no encontrado",
      id: req.params.id,
      sugerencia: "Consulta GET /spren para ver los spren disponibles",
    });
  }
  res.json(spren);
}

//
// GET /spren/:id/:seccion
// Sección concreta de un spren
//
export function sprenSeccion(req, res) {
  const spren = loadSpren(req.params.id);
  if (!spren) {
    return res.status(404).json({
      error: "Spren no encontrado",
      id: req.params.id,
    });
  }

  const seccion = req.params.seccion;

  if (!(seccion in spren)) {
    return res.status(404).json({
      error: `La sección "${seccion}" no existe en este spren`,
      secciones_disponibles: Object.keys(spren),
    });
  }

  res.json(spren[seccion]);
}
