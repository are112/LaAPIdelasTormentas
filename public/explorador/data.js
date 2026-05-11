// data.js — Conecta el explorador con la API real de LaAPIdelasTormentas.
// Carga las 5 categorías desde sus endpoints respectivos.

window.TORMENTAS_DATA = { categorias: [], destacados: [], ordenes: [] };

// ── Helpers ────────────────────────────────────────────────────────────────

async function fetchJson(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const data = await r.json();
    if (Array.isArray(data)) return data;
    return data.data || data.results || data.items || data;
  } catch (err) {
    console.warn(`Error cargando ${url}`, err);
    return null;
  }
}

function mapOrden(nombre) {
  if (!nombre) return null;
  const n = String(nombre).toLowerCase();
  if (n.includes('corredor')) return 'corredores';
  if (n.includes('tejedor'))  return 'tejedores';
  if (n.includes('vínculo') || n.includes('vinculo')) return 'forjadores';
  if (n.includes('danzante')) return 'danzantes';
  if (n.includes('rompedor')) return 'rompedores';
  if (n.includes('vigilante')) return 'vigilantes';
  if (n.includes('custodio')) return 'custodios';
  if (n.includes('llamador')) return 'llamadores';
  if (n.includes('portador')) return 'portadores';
  if (n.includes('forjador'))  return 'forjadores2';
  return null;
}

const ORDENES_STATIC = [
  { id: 'corredores',  nombre: 'Corredores del Viento',  spren: 'Honorspren',      atributos: ['Protector','Líder'],     potencias: ['Adhesión','Gravitación'] },
  { id: 'tejedores',   nombre: 'Tejedores de Luz',       spren: 'Crípticos',       atributos: ['Creativo','Honesto'],    potencias: ['Iluminación','Transformación'] },
  { id: 'forjadores',  nombre: 'Forjadores de Vínculos', spren: 'el Padre Tormenta', atributos: ['Piadoso','Guía'],      potencias: ['Tensión','Adhesión'] },
  { id: 'danzantes',   nombre: 'Danzantes del Filo',     spren: 'Cultivaspren',    atributos: ['Cariñoso','Leal'],       potencias: ['Abrasión','Progresión'] },
  { id: 'rompedores',  nombre: 'Rompedores del Cielo',   spren: 'Altospren',       atributos: ['Justo','Confiado'],      potencias: ['Gravitación','División'] },
  { id: 'vigilantes',  nombre: 'Vigilantes de la Verdad',spren: 'Mistspren',       atributos: ['Aprendido','Pacífico'],  potencias: ['Progresión','Iluminación'] },
  { id: 'custodios',   nombre: 'Custodios de Piedra',    spren: 'Picapiedraspren', atributos: ['Firme','Diestro'],       potencias: ['Tensión','División'] },
  { id: 'forjadores2', nombre: 'Forjadores',             spren: 'Reachers',        atributos: ['Resoluto','Erudito'],    potencias: ['Transformación','Cohesión'] },
  { id: 'llamadores',  nombre: 'Llamadores del Más Allá',spren: 'Inkspren',        atributos: ['Sabio','Cuidadoso'],     potencias: ['Transformación','Transporte'] },
  { id: 'portadores',  nombre: 'Portadores del Polvo',   spren: 'Ashspren',        atributos: ['Valiente','Obediente'],  potencias: ['División','Abrasión'] }
];

// Adaptador genérico: convierte un item de cualquier endpoint a entrada destacada
function toDestacado(item, categoria) {
  return {
    id:        item.id || item.slug || item._id || item.nombre?.toLowerCase().replace(/\s+/g, '-'),
    nombre:    item.nombre || item.name || item.titulo,
    categoria,
    orden:     mapOrden(item.orden),
    tipo:      item.tipo || categoriaSingular(categoria),
    juramento: item.nivel_ideal ?? item.juramento ?? null,
    numero:    item.numero ?? item.numero_heraldo ?? null,
    epigrafe:  item.descripcion_breve || item.epigrafe || item.lema || item.descripcion?.slice(0, 140) || ''
  };
}

function categoriaSingular(cat) {
  return ({
    personajes: 'Personaje',
    spren: 'Spren',
    heraldos: 'Heraldo',
    deshechos: 'Deshecho',
    esquirlas: 'Esquirla'
  })[cat] || cat;
}

// Selección curada de destacados por categoría
function seleccionarDestacados(porCategoria) {
  const prioridades = {
    personajes: ['kaladin', 'shallan', 'dalinar', 'adolin', 'jasnah', 'szeth', 'navani', 'renarin', 'lift', 'venli'],
    spren:      ['sylphrena', 'syl', 'patron', 'glys', 'wyndle', 'ivory'],
    heraldos:   ['jezrien', 'ishar', 'nale', 'chana', 'vedel', 'palah', 'shalash', 'battar', 'kalak', 'taln'],
    deshechos:  ['sja-anat', 'sjaanat', 'nergaoul', 'ashertmarn', 'moelach', 'reshephan'],
    esquirlas:  ['honor', 'cultivacion', 'cultivación', 'odio', 'odium', 'preservacion', 'preservación', 'ruina']
  };

  const sortBy = (arr, prio) => {
    if (!arr) return [];
    return [...arr].sort((a, b) => {
      const ai = prio.indexOf((a.id || a.nombre || '').toLowerCase());
      const bi = prio.indexOf((b.id || b.nombre || '').toLowerCase());
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  };

  // Mezcla 3-4 destacados de cada categoría no vacía
  const out = [];
  Object.entries(porCategoria).forEach(([cat, list]) => {
    const top = sortBy(list, prioridades[cat] || []).slice(0, cat === 'personajes' ? 4 : 2);
    top.forEach(item => out.push(toDestacado(item, cat)));
  });
  return out;
}

// ── Carga principal ────────────────────────────────────────────────────────

window.TORMENTAS_LOAD = async () => {
  const [personajes, spren, heraldos, deshechos, esquirlas] = await Promise.all([
    fetchJson('/personajes'),
    fetchJson('/spren'),
    fetchJson('/heraldos'),
    fetchJson('/deshechos'),
    fetchJson('/esquirlas')
  ]);

  const buckets = {
    personajes: personajes || [],
    spren:      spren      || [],
    heraldos:   heraldos   || [],
    deshechos:  deshechos  || [],
    esquirlas:  esquirlas  || []
  };

  window.TORMENTAS_DATA = {
    categorias: [
      { id: 'personajes', nombre: 'Personajes', glyph: 'figure',   count: buckets.personajes.length,
        tagline: 'Humanos, parshendi, herederos del juramento.',
        descripcion: 'Protagonistas, antagonistas y figuras secundarias del Archivo. Cada ficha contiene afiliaciones, jurameros y vinculaciones.' },
      { id: 'spren',      nombre: 'Spren',      glyph: 'spiral',   count: buckets.spren.length,
        tagline: 'Trozos vivos del mundo cognitivo.',
        descripcion: 'Manifestaciones de fuerzas y emociones. Algunos son sapientes, otros simples reflejos. Los Radiantes vinculan los más nobles.' },
      { id: 'heraldos',   nombre: 'Heraldos',   glyph: 'sun',      count: buckets.heraldos.length,
        tagline: 'Los diez campeones de Honor.',
        descripcion: 'Antaño humanos, ahora mitad-dioses unidos por el Juramento. Cada uno encarna un atributo divino y un orden de los Radiantes.' },
      { id: 'deshechos',  nombre: 'Deshechos',  glyph: 'fracture', count: buckets.deshechos.length,
        tagline: 'Esquirlas corruptas de Odium.',
        descripcion: 'Spren rotos por la voluntad de la pasión. Sembraron Roshar de miseria durante milenios.' },
      { id: 'esquirlas',  nombre: 'Esquirlas',  glyph: 'shard',    count: buckets.esquirlas.length,
        tagline: 'Fragmentos del poder de Adonalsium.',
        descripcion: 'Las dieciséis Esquirlas de la Astilla. Cada una un Intento sostenido por un portador mortal o lo que queda de él.' }
    ],
    destacados: seleccionarDestacados(buckets),
    ordenes: ORDENES_STATIC
  };
};

// Carga del detalle completo al abrir el overlay
window.TORMENTAS_LOAD_DETAIL = async (categoria, id) => {
  if (!categoria || !id) return null;
  // Intenta primero la variante /completo (existe para personajes), luego la simple
  const completo = await fetchJson(`/${categoria}/${id}/completo`);
  if (completo) return completo;
  return await fetchJson(`/${categoria}/${id}`);
};
