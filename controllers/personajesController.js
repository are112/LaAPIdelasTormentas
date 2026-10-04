import { personajes } from "../utils/loaders.js";

const { loadOne: loadCharacter, loadList } = personajes;

const noEncontrado = (id) => ({
  error: "Personaje no encontrado",
  id,
  sugerencia: "Consulta GET /personajes para ver los personajes disponibles",
});

export function listarPersonajes(req, res) {
  res.json(loadList());
}

export function personajeDetalle(req, res) {
  const personaje = loadCharacter(req.params.id);
  if (!personaje) return res.status(404).json(noEncontrado(req.params.id));
  res.json(personaje);
}

export function personajeResumen(req, res) {
  const id = req.params.id.toLowerCase();
  const resumen = loadList().find((p) => p.id.toLowerCase() === id);
  if (!resumen) return res.status(404).json(noEncontrado(req.params.id));
  res.json(resumen);
}

export function personajeSeccion(req, res) {
  const personaje = loadCharacter(req.params.id);
  if (!personaje) return res.status(404).json(noEncontrado(req.params.id));
  const seccion = req.params.seccion;
  if (!(seccion in personaje)) {
    return res.status(404).json({
      error: `La sección "${seccion}" no existe en este personaje`,
      id: req.params.id,
      secciones_disponibles: Object.keys(personaje),
    });
  }
  res.json(personaje[seccion]);
}

export function personajeCompleto(req, res) {
  const detalle = loadCharacter(req.params.id);
  if (!detalle) return res.status(404).json(noEncontrado(req.params.id));
  const id = req.params.id.toLowerCase();
  const resumen = loadList().find((p) => p.id.toLowerCase() === id) || {};
  res.json({ ...resumen, ...detalle });
}
