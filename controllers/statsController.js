import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";

//
// GET /stats
// Estadísticas generales de la API
//
export function stats(req, res) {
  const lista = loadList();

  const totales = {
    personajes: lista.length,
    vivos: 0,
    muertos: 0,
    sin_estado: 0,
    caballeros_radiantes: 0,
    no_radiantes: 0,
    por_orden: {},
    por_especie: {},
    por_sexo: {},
    por_nacionalidad: {},
    nivel_ideal_promedio: null,
    libros: {},
  };

  let sumaNiveles = 0;
  let countNiveles = 0;

  for (const p of lista) {
    const detalle = loadCharacter(p.id);
    if (!detalle) continue;

    // Estado actual
    const estado = String(detalle.estado_actual ?? "").toLowerCase();
    if (estado === "vivo") totales.vivos++;
    else if (estado === "muerto") totales.muertos++;
    else totales.sin_estado++;

    // Orden radiante
    const orden = detalle.orden_radiantes?.orden;
    if (orden && orden.trim() !== "") {
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
      const titulo = libro.titulo;
      if (titulo) {
        totales.libros[titulo] = (totales.libros[titulo] || 0) + 1;
      }
    }
  }

  if (countNiveles > 0) {
    totales.nivel_ideal_promedio = parseFloat(
      (sumaNiveles / countNiveles).toFixed(2)
    );
  }

  res.json(totales);
}
