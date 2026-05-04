import { loadSprenList } from "../utils/loadSprenList.js";
import { loadSpren } from "../utils/loadSpren.js";

//
// GET /spren
//
export function listarSpren(req, res) {
  res.json(loadSprenList());
}

//
// GET /spren/:id
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
// GET /spren/:id/resumen
// Devuelve solo los campos básicos del spren
//
export function sprenResumen(req, res) {
  const lista = loadSprenList();
  const id = req.params.id.toLowerCase();
  const resumen = lista.find(s => s.id.toLowerCase() === id);
  if (!resumen) {
    return res.status(404).json({
      error: "Spren no encontrado",
      id: req.params.id,
    });
  }
  res.json(resumen);
}

//
// GET /spren/:id/relaciones
// Devuelve las relaciones del spren (vínculo Nahel + otras relaciones)
//
export function sprenRelaciones(req, res) {
  const spren = loadSpren(req.params.id);
  if (!spren) {
    return res.status(404).json({
      error: "Spren no encontrado",
      id: req.params.id,
    });
  }

  const resultado = {
    id: spren.id,
    nombre: spren.nombre,
  };

  if (spren.vinculo_nahel) resultado.vinculo_nahel = spren.vinculo_nahel;
  if (spren.relaciones)    resultado.relaciones     = spren.relaciones;

  if (!spren.vinculo_nahel && !spren.relaciones) {
    return res.status(404).json({
      error: "Este spren no tiene relaciones registradas",
    });
  }

  res.json(resultado);
}

//
// GET /spren/:id/:seccion
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
