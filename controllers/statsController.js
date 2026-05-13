import { personajes, heraldos, spren, deshechos, esquirlas } from "../utils/loaders.js";

const { loadOne: loadCharacter, loadList }                    = personajes;
const { loadList: loadHeraldosList }                          = heraldos;
const { loadList: loadSprenList }                             = spren;
const { loadOne: loadDeshecho,  loadList: loadDeshechosList } = deshechos;
const { loadOne: loadEsquirla,  loadList: loadEsquirlasList } = esquirlas;

const ESTADOS_VIVO      = ["vivo", "viva", "activo", "activa"];
const ESTADOS_FALLECIDO = ["fallecido", "fallecida", "muerto", "muerta"];
const ORDENES_EXCLUIDAS = ["ninguna", ""];

export function stats(req, res) {
  const lista    = loadList();
  const herList  = loadHeraldosList();
  const sprenList = loadSprenList();
  const deshechosList = loadDeshechosList();
  const esquirlasList = loadEsquirlasList();

  const totales = {
    resumen: {
      personajes: lista.length, heraldos: herList.length, spren: sprenList.length,
      deshechos: deshechosList.length, esquirlas: esquirlasList.length,
      total: lista.length + herList.length + sprenList.length + deshechosList.length + esquirlasList.length,
    },
    personajes: {
      total: lista.length, vivos: 0, fallecidos: 0, sin_estado: 0,
      caballeros_radiantes: 0, no_radiantes: 0, nivel_ideal_promedio: null,
      por_orden: {}, por_especie: {}, por_sexo: {}, por_nacionalidad: {}, por_libro: {},
    },
    spren:     { total: sprenList.length,     por_tipo: {}, por_libro: {} },
    deshechos: { total: deshechosList.length, aprisionados: 0, activos: 0, sin_estado: 0, por_libro: {} },
    esquirlas: { total: esquirlasList.length, activas: 0, fragmentadas: 0, absorbidas: 0, sin_estado: 0 },
  };

  let sumaNiveles = 0, countNiveles = 0;

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
    if (nivel !== null && nivel !== undefined && !isNaN(nivel)) { sumaNiveles += Number(nivel); countNiveles++; }

    const especie = d.especie ?? "desconocida";
    totales.personajes.por_especie[especie] = (totales.personajes.por_especie[especie] || 0) + 1;
    const sexo = d.sexo ?? "desconocido";
    totales.personajes.por_sexo[sexo] = (totales.personajes.por_sexo[sexo] || 0) + 1;
    const nac = d.nacionalidad ?? "desconocida";
    totales.personajes.por_nacionalidad[nac] = (totales.personajes.por_nacionalidad[nac] || 0) + 1;
    for (const libro of d.apariciones?.libros ?? []) {
      if (libro.titulo) totales.personajes.por_libro[libro.titulo] = (totales.personajes.por_libro[libro.titulo] || 0) + 1;
    }
  }

  if (countNiveles > 0)
    totales.personajes.nivel_ideal_promedio = parseFloat((sumaNiveles / countNiveles).toFixed(2));

  for (const s of sprenList) {
    if (s.tipo_spren) totales.spren.por_tipo[s.tipo_spren] = (totales.spren.por_tipo[s.tipo_spren] || 0) + 1;
  }

  for (const item of deshechosList) {
    const d = loadDeshecho(item.id);
    if (!d) continue;
    const estado = String(d.estado_actual ?? "").toLowerCase();
    if (estado.includes("aprisiona"))                                totales.deshechos.aprisionados++;
    else if (estado.includes("activo") || estado.includes("activa")) totales.deshechos.activos++;
    else                                                              totales.deshechos.sin_estado++;
    for (const libro of d.apariciones?.libros ?? []) {
      if (libro.titulo) totales.deshechos.por_libro[libro.titulo] = (totales.deshechos.por_libro[libro.titulo] || 0) + 1;
    }
  }

  for (const item of esquirlasList) {
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
