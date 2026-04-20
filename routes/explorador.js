import express from "express";
import { loadList } from "../utils/loadList.js";
import { loadCharacter } from "../utils/loadCharacter.js";

const router = express.Router();

router.get("/", (req, res) => {
  // Cargamos todos los datos directamente en el servidor
  const lista = loadList();
  const personajes = lista.map(p => loadCharacter(p.id)).filter(Boolean);
  const datosJSON = JSON.stringify(personajes);
  const listaJSON = JSON.stringify(lista);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>La API de las Tormentas</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --azul-tormenta: #0a1628;
      --azul-profundo: #0d1f3c;
      --azul-medio: #122a52;
      --celeste-luz: #4fc3f7;
      --celeste-vivo: #29b6f6;
      --dorado: #f0c040;
      --dorado-suave: #c8922a;
      --blanco-perla: #e8f4fd;
      --gris-plata: #8baabf;
      --rojo-sangre: #c0392b;
      --verde-esmeralda: #27ae60;
      --sombra: rgba(0,0,0,0.6);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Crimson Pro', Georgia, serif;
      background-color: var(--azul-tormenta);
      color: var(--blanco-perla);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Fondo animado */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(79,195,247,0.06) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(41,182,246,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(192,57,43,0.03) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    /* Partículas de luz tormentosa */
    .particulas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .particula {
      position: absolute;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: var(--celeste-luz);
      opacity: 0;
      animation: flotar var(--dur, 8s) var(--delay, 0s) infinite ease-in-out;
    }
    @keyframes flotar {
      0%   { opacity: 0; transform: translateY(100vh) scale(0); }
      10%  { opacity: 0.8; }
      90%  { opacity: 0.4; }
      100% { opacity: 0; transform: translateY(-10vh) scale(1.5); }
    }

    /* Header */
    header {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 3rem 2rem 2rem;
      border-bottom: 1px solid rgba(79,195,247,0.2);
      background: linear-gradient(to bottom, rgba(10,22,40,0.9), transparent);
    }
    header::after {
      content: '⚡';
      position: absolute;
      top: 1rem; left: 50%;
      transform: translateX(-50%);
      font-size: 1.2rem;
      opacity: 0.5;
      animation: pulsar 3s infinite;
    }
    @keyframes pulsar {
      0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
      50%       { opacity: 0.8; transform: translateX(-50%) scale(1.3); }
    }

    h1 {
      font-family: 'Cinzel Decorative', serif;
      font-size: clamp(1.4rem, 4vw, 2.6rem);
      font-weight: 700;
      color: var(--celeste-luz);
      text-shadow: 0 0 30px rgba(79,195,247,0.5), 0 0 60px rgba(79,195,247,0.2);
      letter-spacing: 0.05em;
      margin-top: 1rem;
    }
    .subtitulo {
      font-size: 1rem;
      color: var(--gris-plata);
      font-style: italic;
      margin-top: 0.5rem;
      letter-spacing: 0.1em;
    }

    /* Layout principal */
    .contenedor {
      position: relative;
      z-index: 10;
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 0;
      min-height: calc(100vh - 160px);
    }

    /* Panel izquierdo */
    .panel-izq {
      border-right: 1px solid rgba(79,195,247,0.15);
      padding: 1.5rem;
      background: rgba(13,31,60,0.5);
      backdrop-filter: blur(4px);
    }

    /* Buscador */
    .buscador-wrap {
      position: relative;
      margin-bottom: 1.5rem;
    }
    .buscador-wrap::before {
      content: '🔍';
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.85rem;
      opacity: 0.5;
    }
    #buscador {
      width: 100%;
      padding: 0.6rem 0.75rem 0.6rem 2.2rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(79,195,247,0.25);
      border-radius: 6px;
      color: var(--blanco-perla);
      font-family: 'Crimson Pro', serif;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #buscador:focus {
      border-color: var(--celeste-luz);
      box-shadow: 0 0 12px rgba(79,195,247,0.2);
    }
    #buscador::placeholder { color: var(--gris-plata); opacity: 0.6; }

    /* Filtro de orden */
    .filtro-seccion {
      margin-bottom: 1.5rem;
    }
    .filtro-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--gris-plata);
      margin-bottom: 0.5rem;
      display: block;
    }
    #filtro-orden {
      width: 100%;
      padding: 0.5rem 0.75rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(79,195,247,0.2);
      border-radius: 6px;
      color: var(--blanco-perla);
      font-family: 'Crimson Pro', serif;
      font-size: 0.95rem;
      outline: none;
      cursor: pointer;
    }
    #filtro-orden option { background: var(--azul-profundo); }

    /* Lista de personajes */
    .lista-titulo {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--gris-plata);
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lista-titulo span {
      background: rgba(79,195,247,0.15);
      color: var(--celeste-luz);
      border-radius: 10px;
      padding: 0.1rem 0.5rem;
      font-size: 0.7rem;
    }
    #lista-personajes {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      max-height: calc(100vh - 380px);
      overflow-y: auto;
      padding-right: 0.25rem;
    }
    #lista-personajes::-webkit-scrollbar { width: 4px; }
    #lista-personajes::-webkit-scrollbar-track { background: transparent; }
    #lista-personajes::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }

    .item-personaje {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      background: rgba(255,255,255,0.02);
    }
    .item-personaje:hover {
      background: rgba(79,195,247,0.08);
      border-color: rgba(79,195,247,0.2);
    }
    .item-personaje.activo {
      background: rgba(79,195,247,0.12);
      border-color: rgba(79,195,247,0.4);
      box-shadow: inset 3px 0 0 var(--celeste-luz);
    }
    .item-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      background: rgba(79,195,247,0.1);
      border: 1px solid rgba(79,195,247,0.2);
      flex-shrink: 0;
    }
    .item-info { flex: 1; min-width: 0; }
    .item-nombre {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--blanco-perla);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-orden {
      font-size: 0.75rem;
      color: var(--gris-plata);
      font-style: italic;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-estado {
      width: 7px; height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .vivo  { background: var(--verde-esmeralda); box-shadow: 0 0 6px var(--verde-esmeralda); }
    .muerto { background: var(--rojo-sangre); box-shadow: 0 0 6px var(--rojo-sangre); }

    /* Panel derecho - detalle */
    .panel-der {
      padding: 2rem;
      overflow-y: auto;
    }

    /* Estado vacío */
    .estado-vacio {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      opacity: 0.4;
      text-align: center;
      gap: 1rem;
    }
    .estado-vacio .icono { font-size: 4rem; animation: pulsar 4s infinite; }
    .estado-vacio p { font-size: 1.1rem; font-style: italic; color: var(--gris-plata); }

    /* Cargando */
    .cargando {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      gap: 1rem;
      color: var(--gris-plata);
      font-style: italic;
    }
    .spinner {
      width: 28px; height: 28px;
      border: 2px solid rgba(79,195,247,0.2);
      border-top-color: var(--celeste-luz);
      border-radius: 50%;
      animation: girar 0.8s linear infinite;
    }
    @keyframes girar { to { transform: rotate(360deg); } }

    /* Ficha de personaje */
    .ficha { animation: aparecer 0.3s ease; }
    @keyframes aparecer {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ficha-header {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(79,195,247,0.15);
    }
    .ficha-avatar {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(79,195,247,0.2), rgba(79,195,247,0.05));
      border: 2px solid rgba(79,195,247,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem;
      flex-shrink: 0;
      box-shadow: 0 0 20px rgba(79,195,247,0.15);
    }
    .ficha-titulo h2 {
      font-family: 'Cinzel Decorative', serif;
      font-size: clamp(1.2rem, 3vw, 1.8rem);
      color: var(--celeste-luz);
      text-shadow: 0 0 20px rgba(79,195,247,0.3);
      margin-bottom: 0.25rem;
    }
    .ficha-titulo .nombre-completo {
      font-size: 0.9rem;
      color: var(--gris-plata);
      font-style: italic;
      margin-bottom: 0.5rem;
    }
    .badges { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
    .badge {
      font-size: 0.72rem;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-family: 'Crimson Pro', serif;
      letter-spacing: 0.05em;
    }
    .badge-orden   { background: rgba(240,192,64,0.15); color: var(--dorado); border: 1px solid rgba(240,192,64,0.3); }
    .badge-vivo    { background: rgba(39,174,96,0.15);  color: #5dca8a; border: 1px solid rgba(39,174,96,0.3); }
    .badge-muerto  { background: rgba(192,57,43,0.15);  color: #e57367; border: 1px solid rgba(192,57,43,0.3); }
    .badge-especie { background: rgba(79,195,247,0.1);  color: var(--celeste-luz); border: 1px solid rgba(79,195,247,0.25); }
    .badge-nivel   { background: rgba(200,146,42,0.15); color: var(--dorado-suave); border: 1px solid rgba(200,146,42,0.3); }

    /* Descripción */
    .descripcion {
      background: rgba(79,195,247,0.04);
      border-left: 3px solid rgba(79,195,247,0.3);
      padding: 1rem 1.25rem;
      border-radius: 0 6px 6px 0;
      font-style: italic;
      color: var(--gris-plata);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    /* Grid de secciones */
    .grid-secciones {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .seccion {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(79,195,247,0.1);
      border-radius: 8px;
      padding: 1.25rem;
      transition: border-color 0.2s;
    }
    .seccion:hover { border-color: rgba(79,195,247,0.25); }
    .seccion-titulo {
      font-family: 'Cinzel Decorative', serif;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--dorado-suave);
      margin-bottom: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .seccion-titulo::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(200,146,42,0.2);
    }

    /* Campos básicos */
    .campo { margin-bottom: 0.5rem; display: flex; gap: 0.5rem; align-items: baseline; }
    .campo-label {
      font-size: 0.75rem;
      color: var(--gris-plata);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      flex-shrink: 0;
      min-width: 90px;
    }
    .campo-valor { font-size: 0.95rem; color: var(--blanco-perla); }

    /* Tags */
    .tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.25rem; }
    .tag {
      font-size: 0.8rem;
      padding: 0.15rem 0.5rem;
      background: rgba(79,195,247,0.08);
      border: 1px solid rgba(79,195,247,0.15);
      border-radius: 4px;
      color: var(--celeste-luz);
    }

    /* Relaciones */
    .relacion-grupo { margin-bottom: 0.75rem; }
    .relacion-grupo-titulo {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--gris-plata);
      margin-bottom: 0.35rem;
    }
    .relacion-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.3rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 0.9rem;
    }
    .relacion-icono { font-size: 0.9rem; }
    .relacion-nombre { color: var(--blanco-perla); }
    .relacion-tipo { font-size: 0.75rem; color: var(--gris-plata); font-style: italic; margin-left: auto; }

    /* Libros */
    .libro-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 0.9rem;
    }
    .libro-titulo { color: var(--blanco-perla); flex: 1; }
    .libro-rol { font-size: 0.75rem; color: var(--dorado-suave); font-style: italic; }
    .libro-pov {
      font-size: 0.65rem;
      padding: 0.1rem 0.35rem;
      background: rgba(240,192,64,0.15);
      color: var(--dorado);
      border-radius: 3px;
      border: 1px solid rgba(240,192,64,0.3);
    }

    /* Arco narrativo */
    .arco-resumen {
      font-size: 0.95rem;
      line-height: 1.65;
      color: var(--blanco-perla);
      margin-bottom: 0.75rem;
      font-style: italic;
    }
    .punto-clave {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
      padding: 0.25rem 0;
      font-size: 0.88rem;
      color: var(--gris-plata);
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .punto-clave::before { content: '▸'; color: var(--celeste-luz); flex-shrink: 0; }

    /* Estado mental */
    .mental-item { margin-bottom: 0.5rem; font-size: 0.9rem; }
    .mental-label { color: var(--gris-plata); font-size: 0.8rem; margin-bottom: 0.15rem; }
    .mental-valor { color: var(--blanco-perla); }

    /* Barra nivel ideal */
    .nivel-barra-wrap { margin-top: 0.5rem; }
    .nivel-barra-bg {
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.3rem;
    }
    .nivel-barra-fill {
      height: 100%;
      background: linear-gradient(to right, var(--dorado-suave), var(--dorado));
      border-radius: 3px;
      transition: width 0.8s ease;
      box-shadow: 0 0 8px rgba(240,192,64,0.4);
    }
    .nivel-texto {
      font-size: 0.8rem;
      color: var(--gris-plata);
      margin-top: 0.25rem;
    }

    /* Stats bar */
    .stats-bar {
      display: flex;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      background: rgba(79,195,247,0.04);
      border: 1px solid rgba(79,195,247,0.1);
      border-radius: 8px;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .stat-item { text-align: center; }
    .stat-num {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.4rem;
      color: var(--celeste-luz);
      display: block;
    }
    .stat-label { font-size: 0.72rem; color: var(--gris-plata); text-transform: uppercase; letter-spacing: 0.1em; }

    /* Afiliaciones seccion completa */
    .afiliacion-item {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.3rem 0;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .afiliacion-item::before { content: '⚔'; font-size: 0.7rem; color: var(--dorado-suave); }

    /* Sin datos */
    .sin-datos {
      font-size: 0.85rem;
      color: var(--gris-plata);
      font-style: italic;
      opacity: 0.6;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .contenedor { grid-template-columns: 1fr; }
      .panel-izq { border-right: none; border-bottom: 1px solid rgba(79,195,247,0.15); }
      #lista-personajes { max-height: 200px; }
      .ficha-header { flex-direction: column; }
      .grid-secciones { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Partículas de luz tormentosa -->
  <div class="particulas" id="particulas"></div>

  <header>
    <h1>La API de las Tormentas</h1>
    <p class="subtitulo">Un Proyecto Fan del Cosmere</p>
  </header>

  <div class="contenedor">
    <!-- Panel izquierdo -->
    <aside class="panel-izq">
      <div class="buscador-wrap">
        <input type="text" id="buscador" placeholder="Buscar personaje..." autocomplete="off" />
      </div>

      <div class="filtro-seccion">
        <label class="filtro-label" for="filtro-orden">Filtrar por orden</label>
        <select id="filtro-orden">
          <option value="">Todas las órdenes</option>
        </select>
      </div>

      <div class="lista-titulo">
        Personajes <span id="contador">0</span>
      </div>
      <div id="lista-personajes"></div>
    </aside>

    <!-- Panel derecho -->
    <main class="panel-der" id="panel-detalle">
      <div class="estado-vacio">
        <div class="icono">⚡</div>
        <p>Selecciona un personaje para explorar su ficha</p>
      </div>
    </main>
  </div>

  <script>
    // Datos inyectados directamente desde el servidor
    const PERSONAJES = ${datosJSON};
    const LISTA = ${listaJSON};

    let todos = [];
    let filtrados = [];
    let seleccionado = null;

    // ── Partículas ─────────────────────────────────────────
    function crearParticulas() {
      const wrap = document.getElementById('particulas');
      for (let i = 0; i < 35; i++) {
        const p = document.createElement('div');
        p.className = 'particula';
        p.style.cssText = \`
          left: \${Math.random() * 100}%;
          --dur: \${6 + Math.random() * 10}s;
          --delay: \${-Math.random() * 15}s;
          width: \${1 + Math.random() * 2}px;
          height: \${1 + Math.random() * 2}px;
          opacity: \${0.3 + Math.random() * 0.5};
        \`;
        wrap.appendChild(p);
      }
    }

    // ── Emoji por orden ────────────────────────────────────
    function emojiOrden(orden) {
      const m = {
        'Corredores del Viento': '💨',
        'Tejedores de Luz': '✨',
        'Forjadores de Vínculos': '🔗',
        'Nominadores de Lo Otro': '📖',
        'Vigilantes de la Verdad': '👁',
        'Danzantes del Filo': '⚔',
        'Rompedores del Cielo': '🌩',
        'Escultores de Voluntad': '🌀',
      };
      return m[orden] || '⚡';
    }

    // ── Cargar lista ───────────────────────────────────────
    function cargarLista() {
      todos = LISTA;
      poblarFiltroOrden();
      renderLista(todos);
    }

    function poblarFiltroOrden() {
      const ordenes = [...new Set(todos.map(p => p.orden).filter(o => o && o.trim()))].sort();
      const sel = document.getElementById('filtro-orden');
      ordenes.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        sel.appendChild(opt);
      });
    }

    function renderLista(lista) {
      filtrados = lista;
      document.getElementById('contador').textContent = lista.length;
      const wrap = document.getElementById('lista-personajes');
      if (!lista.length) {
        wrap.innerHTML = '<p class="sin-datos">Sin resultados</p>';
        return;
      }
      wrap.innerHTML = lista.map(p => \`
        <div class="item-personaje \${seleccionado === p.id ? 'activo' : ''}"
             onclick="verPersonaje('\${p.id}')" data-id="\${p.id}">
          <div class="item-avatar">\${emojiOrden(p.orden)}</div>
          <div class="item-info">
            <div class="item-nombre">\${p.nombre}</div>
            <div class="item-orden">\${p.orden || 'Sin orden'}</div>
          </div>
        </div>
      \`).join('');
    }

    // ── Filtros ────────────────────────────────────────────
    document.getElementById('buscador').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-orden').addEventListener('change', aplicarFiltros);

    function aplicarFiltros() {
      const texto = document.getElementById('buscador').value.toLowerCase();
      const orden = document.getElementById('filtro-orden').value;
      const res = todos.filter(p => {
        const matchTexto = !texto || p.nombre.toLowerCase().includes(texto);
        const matchOrden = !orden || p.orden === orden;
        return matchTexto && matchOrden;
      });
      renderLista(res);
    }

    // ── Ver personaje ──────────────────────────────────────
    function verPersonaje(id) {
      seleccionado = id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === id);
      });

      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';

      const p = PERSONAJES.find(x => x.id === id);
      if (!p) {
        panel.innerHTML = '<p class="sin-datos">Personaje no encontrado</p>';
        return;
      }

      // Construir relaciones en formato compatible
      const rel = p.relaciones
        ? { relaciones: p.relaciones }
        : null;

      panel.innerHTML = renderFicha(p, rel);
    }

    // ── Render ficha ───────────────────────────────────────
    function renderFicha(p, rel) {
      const orden = p.orden_radiantes?.orden;
      const nivel = p.orden_radiantes?.nivel_ideal;
      const estado = p.estado_actual?.toLowerCase();
      const libros = p.apariciones?.libros ?? [];
      const habilidades = p.habilidades;
      const mental = p.estado_mental;
      const arco = p.arco_narrativo;
      const situacion = p.situacion_actual;
      const apodos = p.apodos ?? [];

      // Badges
      const badges = [
        orden ? \`<span class="badge badge-orden">\${emojiOrden(orden)} \${orden}</span>\` : '',
        estado === 'vivo'  ? '<span class="badge badge-vivo">● Vivo</span>' : '',
        estado === 'muerto'? '<span class="badge badge-muerto">● Muerto</span>' : '',
        p.especie ? \`<span class="badge badge-especie">\${p.especie}</span>\` : '',
        nivel !== null && nivel !== undefined ? \`<span class="badge badge-nivel">Ideal \${nivel}</span>\` : '',
      ].filter(Boolean).join('');

      // Relaciones
      let relHtml = '<p class="sin-datos">Sin relaciones registradas</p>';
      if (rel?.relaciones) {
        const iconos = { familia: '👪', amigos: '🤝', enemigos: '⚔' };
        relHtml = Object.entries(rel.relaciones).map(([tipo, items]) => \`
          <div class="relacion-grupo">
            <div class="relacion-grupo-titulo">\${iconos[tipo] || '•'} \${tipo}</div>
            \${items.map(r => \`
              <div class="relacion-item">
                <span class="relacion-nombre">\${r.personaje}</span>
                <span class="relacion-tipo">\${r.relacion}</span>
              </div>
            \`).join('')}
          </div>
        \`).join('');
      }

      // Libros
      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">📕 \${l.titulo}</span>
            \${l.rol ? \`<span class="libro-rol">\${l.rol}</span>\` : ''}
            \${l.pov ? '<span class="libro-pov">POV</span>' : ''}
          </div>
        \`).join('')
        : '<p class="sin-datos">Sin apariciones registradas</p>';

      // Habilidades
      const potencias = habilidades?.magia?.potencias ?? [];
      const noMagicas = habilidades?.no_magicas ?? [];
      const habilidadesHtml = \`
        \${potencias.length ? \`
          <div class="campo-label" style="margin-bottom:0.3rem">Potencias mágicas</div>
          <div class="tags">\${potencias.map(t => \`<span class="tag">⚡ \${t}</span>\`).join('')}</div>
        \` : ''}
        \${habilidades?.magia?.fuente_de_luz ? \`
          <div class="campo" style="margin-top:0.5rem">
            <span class="campo-label">Fuente</span>
            <span class="campo-valor">\${habilidades.magia.fuente_de_luz}</span>
          </div>
        \` : ''}
        \${noMagicas.length ? \`
          <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">No mágicas</div>
          <div class="tags">\${noMagicas.map(t => \`<span class="tag" style="border-color:rgba(200,146,42,0.2);color:var(--dorado-suave)">\${t}</span>\`).join('')}</div>
        \` : ''}
        \${!potencias.length && !noMagicas.length ? '<p class="sin-datos">Sin habilidades registradas</p>' : ''}
      \`;

      // Nivel barra
      const nivelHtml = orden && nivel !== null && nivel !== undefined ? \`
        <div class="nivel-barra-wrap">
          <div class="campo-label">Nivel del Ideal</div>
          <div class="nivel-barra-bg">
            <div class="nivel-barra-fill" style="width:\${(nivel/5)*100}%"></div>
          </div>
          <div class="nivel-texto">Nivel \${nivel} de 5</div>
        </div>
      \` : '';

      // Afiliaciones
      const afiliaciones = p.afiliaciones ?? [];
      const afilHtml = afiliaciones.length
        ? afiliaciones.map(a => \`<div class="afiliacion-item">\${a}</div>\`).join('')
        : '<p class="sin-datos">Sin afiliaciones registradas</p>';

      // Arco narrativo
      const arcoHtml = arco ? \`
        \${arco.resumen ? \`<p class="arco-resumen">\${arco.resumen}</p>\` : ''}
        \${(arco.puntos_clave ?? []).map(pk => \`<div class="punto-clave">\${pk}</div>\`).join('')}
      \` : '<p class="sin-datos">Sin arco registrado</p>';

      // Estado mental
      const mentalHtml = mental ? Object.entries(mental).map(([k, v]) => \`
        <div class="mental-item">
          <div class="mental-label">\${k.replace(/_/g,' ')}</div>
          <div class="mental-valor">\${v}</div>
        </div>
      \`).join('') : '<p class="sin-datos">Sin datos</p>';

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar">\${emojiOrden(orden)}</div>
            <div class="ficha-titulo">
              <h2>\${p.nombre}</h2>
              \${p.nombre_completo && p.nombre_completo !== p.nombre
                ? \`<div class="nombre-completo">\${p.nombre_completo}</div>\` : ''}
              \${apodos.length ? \`<div class="nombre-completo" style="color:var(--gris-plata)">"<em>\${apodos.join('", "')}</em>"</div>\` : ''}
              <div class="badges">\${badges}</div>
            </div>
          </div>

          \${p.descripcion_breve ? \`<div class="descripcion">\${p.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">

            <!-- Datos generales -->
            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[
                ['Especie',      p.especie],
                ['Sexo',         p.sexo],
                ['Nacionalidad', p.nacionalidad],
                ['Origen',       p.origen],
                ['Planeta',      p.planeta_natal],
                ['Estado',       p.estado_actual],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>
              \` : '').join('')}
            </div>

            <!-- Orden radiante -->
            <div class="seccion">
              <div class="seccion-titulo">Orden Radiante</div>
              \${orden ? \`
                <div class="campo"><span class="campo-label">Orden</span><span class="campo-valor">\${orden}</span></div>
                \${p.orden_radiantes?.spren_asociado?.principal
                  ? \`<div class="campo"><span class="campo-label">Spren</span><span class="campo-valor">\${p.orden_radiantes.spren_asociado.principal}</span></div>\`
                  : ''}
                \${p.orden_radiantes?.estado_del_vinculo
                  ? \`<div class="campo"><span class="campo-label">Vínculo</span><span class="campo-valor">\${p.orden_radiantes.estado_del_vinculo}</span></div>\`
                  : ''}
                \${nivelHtml}
              \` : '<p class="sin-datos">No es Caballero Radiante</p>'}
            </div>

            <!-- Habilidades -->
            <div class="seccion">
              <div class="seccion-titulo">Habilidades</div>
              \${habilidadesHtml}
            </div>

            <!-- Relaciones -->
            <div class="seccion">
              <div class="seccion-titulo">Relaciones</div>
              \${relHtml}
            </div>

            <!-- Apariciones -->
            <div class="seccion">
              <div class="seccion-titulo">Apariciones</div>
              \${librosHtml}
            </div>

            <!-- Afiliaciones -->
            <div class="seccion">
              <div class="seccion-titulo">Afiliaciones</div>
              \${afilHtml}
            </div>

            <!-- Situación actual -->
            \${situacion ? \`
            <div class="seccion">
              <div class="seccion-titulo">Situación actual</div>
              \${Object.entries(situacion).map(([k,v]) => \`
                <div class="campo">
                  <span class="campo-label">\${k.replace(/_/g,' ')}</span>
                  <span class="campo-valor">\${v}</span>
                </div>
              \`).join('')}
            </div>
            \` : ''}

            <!-- Estado mental -->
            <div class="seccion">
              <div class="seccion-titulo">Estado mental</div>
              \${mentalHtml}
            </div>

          </div>

          <!-- Arco narrativo (ancho completo) -->
          <div class="seccion" style="margin-bottom:2rem">
            <div class="seccion-titulo">Arco narrativo</div>
            \${arcoHtml}
          </div>

        </div>
      \`;
    }

    // ── Init ───────────────────────────────────────────────
    crearParticulas();
    cargarLista();
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
