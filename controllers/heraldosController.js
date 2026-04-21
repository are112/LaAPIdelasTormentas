import { loadHeraldosList } from "../utils/loadHeraldosList.js";
import { loadHeraldo } from "../utils/loadHeraldo.js";

//
// GET /heraldos
//
export function listarHeraldos(req, res) {
  res.json(loadHeraldosList());
}

//
// GET /heraldos/:id
//
export function heraldoDetalle(req, res) {
  const heraldo = loadHeraldo(req.params.id);
  if (!heraldo) {
    return res.status(404).json({
      error: "Heraldo no encontrado",
      id: req.params.id,
      sugerencia: "Consulta GET /heraldos para ver los heraldos disponibles",
    });
  }
  res.json(heraldo);
}

//
// GET /heraldos/:id/:seccion
//
export function heraldoSeccion(req, res) {
  const heraldo = loadHeraldo(req.params.id);
  if (!heraldo) {
    return res.status(404).json({
      error: "Heraldo no encontrado",
      id: req.params.id,
    });
  }

  const seccion = req.params.seccion;
  if (!(seccion in heraldo)) {
    return res.status(404).json({
      error: `La sección "${seccion}" no existe en este heraldo`,
      secciones_disponibles: Object.keys(heraldo),
    });
  }

  res.json(heraldo[seccion]);
}
