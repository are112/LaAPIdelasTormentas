import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";
import { loadHeraldosList } from "../utils/loadHeraldosList.js";
import { loadSprenList } from "../utils/loadSprenList.js";
import { loadDeshechosList } from "../utils/loadDeshechosList.js";
import { loadDeshecho } from "../utils/loadDeshecho.js";
import { loadEsquirlasList } from "../utils/loadEsquirlasList.js";
import { loadEsquirla } from "../utils/loadEsquirla.js";

const ESTADOS_VIVO      = ["vivo", "viva", "activo", "activa"];
const ESTADOS_FALLECIDO = ["fallecido", "fallecida", "muerto", "muerta"];
const ORDENES_EXCLUIDAS = ["ninguna", ""];

export function stats(req, res) {
  const lista        = loadList();
  const heraldos     = loadHeraldosList();
  const spren        = loadSprenList();
  const deshechos    = loadDeshechosList();
  const esquirlas    = loadEsquirlasList();

  // ── Personajes ──────────────────────────────────────────
  const totales = {
    resumen: {
      personajes:  lista.length,
      heraldos:    heraldos.length,
      spren:       spren.length,
      deshechos:   deshechos.length,
      esquirlas:   esquirlas.length,
      total:       lista.length + heraldos.length + spren.length + deshechos.length + esquirlas.length,
    },
    personajes: {
      total:                lista.length,
      vivos:                0,
      fallecidos:           0,
      sin_estado:           0,
      caballeros_radiantes: 0,
      no_radiantes:         0,
      nivel_ideal_promedio: null,
      por_orden:            {},
      por_especie:          {},
      por_sexo:             {},
      por_nacionalidad:     {},
      por_libro:            {},
    },
    spren: {
      total:        spren.length,
      por_tipo:     {},
      por_libro:    {},
    },
    deshechos: {
      total:         deshechos.length,
      aprisionados:  0,
      activos:       0,
      sin_estado:    0,
      por_libro:     {},
    },
    esquirlas: {
      total:         esquirlas.length,
      activas:       0,
      fragmentadas:  0,
      absorbidas:    0,
      sin_estado:    0,
    },
  };

  let sumaNiveles  = 0;
  let countNiveles = 0;

  // ── Estadísticas de personajes ──────────────────────────
  for (const p of lista) {
    const d = loadCharacter(p.id);
    if (!d) continue;

    const estado = String(d.estado_actual ?? "").toLowerCase();
    if (ESTADOS_VIVO.includes(estado))           totales.personajes.vivos++;
    else if (ESTADOS_FALLECIDO.includes(estado)) totales.personajes.fallecidos++;
    else                                          totales.personajes.sin_estado++;

    const orden = String(d.orden_radiantes?.orden ?? "").trim();
    if (orden && !ORDENES_EXCLUIDAS.includes(orden.toLowerCase())) {
      totales.personajes.caballeros_radiantes++;
      totales.personajes.por_orden[orden] = (totales.personajes.por_orden[orden] || 0) + 1;
    } else {
      totales.personajes.no_radiantes++;
    }

    const nivel = d.orden_radiantes?.nivel_ideal;
    if (nivel !== null && nivel !== undefined && !isNaN(nivel)) {
      sumaNiveles += Number(nivel);
      countNiveles++;
    }

    const especie = d.especie ?? "desconocida";
    totales.personajes.por_especie[especie] = (totales.personajes.por_especie[especie] || 0) + 1;

    const sexo = d.sexo ?? "desconocido";
    totales.personajes.por_sexo[sexo] = (totales.personajes.por_sexo[sexo] || 0) + 1;

    const nac = d.nacionalidad ?? "desconocida";
    totales.personajes.por_nacionalidad[nac] = (totales.personajes.por_nacionalidad[nac] || 0) + 1;

    for (const libro of d.apariciones?.libros ?? []) {
      if (libro.titulo)
        totales.personajes.por_libro[libro.titulo] = (totales.personajes.por_libro[libro.titulo] || 0) + 1;
    }
  }

  if (countNiveles > 0)
    totales.personajes.nivel_ideal_promedio = parseFloat((sumaNiveles / countNiveles).toFixed(2));

  // ── Estadísticas de spren ───────────────────────────────
  for (const s of spren) {
    if (s.tipo_spren)
      totales.spren.por_tipo[s.tipo_spren] = (totales.spren.por_tipo[s.tipo_spren] || 0) + 1;
  }

  // ── Estadísticas de deshechos ───────────────────────────
  for (const item of deshechos) {
    const d = loadDeshecho(item.id);
    if (!d) continue;
    const estado = String(d.estado_actual ?? "").toLowerCase();
    if (estado.includes("aprisiona"))     totales.deshechos.aprisionados++;
    else if (estado.includes("activo") || estado.includes("activa")) totales.deshechos.activos++;
    else                                  totales.deshechos.sin_estado++;

    for (const libro of d.apariciones?.libros ?? []) {
      if (libro.titulo)
        totales.deshechos.por_libro[libro.titulo] = (totales.deshechos.por_libro[libro.titulo] || 0) + 1;
    }
  }

  // ── Estadísticas de esquirlas ───────────────────────────
  for (const item of esquirlas) {
    const e = loadEsquirla(item.id);
    if (!e) continue;
    const estado = String(e.estado_actual ?? "").toLowerCase();
    if (estado.includes("activa") || estado.includes("activo")) totales.esquirlas.activas++;
    else if (estado.includes("fragment"))  totales.esquirlas.fragmentadas++;
    else if (estado.includes("absorbida")) totales.esquirlas.absorbidas++;
    else                                   totales.esquirlas.sin_estado++;
  }

  res.json(totales);
}
