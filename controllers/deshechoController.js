import { loadDeshechosList } from "../utils/loadDeshechosList.js";
import { loadDeshecho } from "../utils/loadDeshecho.js";

export function listarDeshechos(req, res) {
  res.json(loadDeshechosList());
}

export function deshechoDetalle(req, res) {
  const d = loadDeshecho(req.params.id);
  if (!d) return res.status(404).json({ error: "Deshecho no encontrado" });
  res.json(d);
}

export function deshechoSeccion(req, res) {
  const d = loadDeshecho(req.params.id);
  if (!d) return res.status(404).json({ error: "Deshecho no encontrado" });
  const seccion = d[req.params.seccion];
  if (seccion === undefined) return res.status(404).json({ error: "Sección no encontrada" });
  res.json(seccion);
}
