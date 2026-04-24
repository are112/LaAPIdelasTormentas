import { loadEsquirlasList } from "../utils/loadEsquirlasList.js";
import { loadEsquirla } from "../utils/loadEsquirla.js";

export function listarEsquirlas(req, res) {
  res.json(loadEsquirlasList());
}

export function esquirlaDetalle(req, res) {
  const e = loadEsquirla(req.params.id);
  if (!e) return res.status(404).json({ error: "Esquirla no encontrada" });
  res.json(e);
}

export function esquirlaSeccion(req, res) {
  const e = loadEsquirla(req.params.id);
  if (!e) return res.status(404).json({ error: "Esquirla no encontrada" });
  const seccion = e[req.params.seccion];
  if (seccion === undefined) return res.status(404).json({ error: "Sección no encontrada" });
  res.json(seccion);
}
