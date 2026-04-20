import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";

//
// --- LISTA GENERAL ---
//
export function listarPersonajes(req, res) {
  const lista = loadList();
  res.json(lista);
}

//
// --- DETALLE COMPLETO ---
//
export function personajeDetalle(req, res) {
  const personaje = loadCharacter(req.params.id);
  if (!personaje) return res.status(404).json({ error: "Personaje no encontrado" });
  res.json(personaje);
}

//
// --- RESUMEN (desde personajes.json) ---
//
export function personajeResumen(req, res) {
  const lista = loadList();
  const id = req.params.id.toLowerCase();
  const resumen = lista.find(p => p.id.toLowerCase() === id);
  if (!resumen) return res.status(404).json({ error: "Personaje no encontrado" });
  res.json(resumen);
}

//
// --- SECCIONES INTERNAS ---
//
export function personajeSeccion(req, res) {
  const personaje = loadCharacter(req.params.id);
  if (!personaje) return res.status(404).json({ error: "Personaje no encontrado" });

  const seccion = req.params.seccion;

  if (!(seccion in personaje)) {
    return res.status(404).json({ error: "La sección no existe en este personaje" });
  }

  res.json(personaje[seccion]);
}

//
// --- COMBINADO RESUMEN + DETALLE ---
//
export function personajeCompleto(req, res) {
  const lista = loadList();
  const detalle = loadCharacter(req.params.id);

  if (!detalle) return res.status(404).json({ error: "Personaje no encontrado" });

  const id = req.params.id.toLowerCase();
  const resumen = lista.find(p => p.id.toLowerCase() === id) || {};

  res.json({ ...resumen, ...detalle });
}