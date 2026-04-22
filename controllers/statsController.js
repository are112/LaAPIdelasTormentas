import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";
import { loadHeraldosList } from "../utils/loadHeraldosList.js";
import { loadSprenList } from "../utils/loadSprenList.js";

const ESTADOS_VIVO      = ["vivo", "viva"];
const ESTADOS_FALLECIDO = ["fallecido", "fallecida", "muerto", "muerta"];
const ORDENES_EXCLUIDAS = ["ninguna", ""];

export function stats(req, res) {
  const lista = loadList();

  const totales = {
    personajes:           lista.length,
    heraldos:             loadHeraldosList().length,
    spren:                loadSprenList().length,
    vivos:                0,
    fallecidos:           0,
    sin_estado:           0,
    caballeros_radiantes: 0,
    no_radiantes:         0,
    por_orden:            {},
    por_especie:          {},
    por_sexo:             {},
    por_nacionalidad:     {},
    nivel_ideal_promedio: null,
    libros:               {},
  };

  let sumaNiveles  = 0;
  let countNiveles = 0;

  for (const p of lista) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;

    // Estado actual — cubre vivo/viva y fallecido/fallecida/muerto
    const estado = String(detalle.estado_actual ?? "").toLowerCase();
    if (ESTADOS_VIVO.includes(estado))           totales.vivos++;
    else if (ESTADOS_FALLECIDO.includes(estado)) totales.fallecidos++;
    else                                          totales.sin_estado++;

    // Orden radiante — excluir "Ninguna" y vacío
    const orden = String(detalle.orden_radiantes?.orden ?? "").trim();
    if (orden && !ORDENES_EXCLUIDAS.includes(orden.toLowerCase())) {
      totales.caballeros_radiantes++;
      totales.por_orden[orden] = (totales.por_orden[orden] || 0) + 1;
    } else {
      totales.no_radiantes++;
    }

    // Nivel ideal
    const nivel = detalle.orden_radiantes?.nivel_ideal;
    if (nivel !== null && nivel !== undefined && !isNaN(nivel)) {
      sumaNiveles += Number(nivel);
      countNiveles++;
    }

    // Especie
    const especie = detalle.especie ?? "desconocida";
    totales.por_especie[especie] = (totales.por_especie[especie] || 0) + 1;

    // Sexo
    const sexo = detalle.sexo ?? "desconocido";
    totales.por_sexo[sexo] = (totales.por_sexo[sexo] || 0) + 1;

    // Nacionalidad
    const nac = detalle.nacionalidad ?? "desconocida";
    totales.por_nacionalidad[nac] = (totales.por_nacionalidad[nac] || 0) + 1;

    // Libros
    for (const libro of detalle.apariciones?.libros ?? []) {
      if (libro.titulo)
        totales.libros[libro.titulo] = (totales.libros[libro.titulo] || 0) + 1;
    }
  }

  if (countNiveles > 0)
    totales.nivel_ideal_promedio = parseFloat((sumaNiveles / countNiveles).toFixed(2));

  res.json(totales);
}
