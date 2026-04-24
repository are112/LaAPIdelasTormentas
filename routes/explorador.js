import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>La API de las Tormentas — Explorador</title>
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

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .tab {
      flex: 1;
      padding: 0.5rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(79,195,247,0.15);
      border-radius: 6px;
      color: var(--gris-plata);
      font-family: 'Crimson Pro', serif;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tab:hover {
      background: rgba(79,195,247,0.08);
      color: var(--blanco-perla);
    }
    .tab.activo {
      background: rgba(79,195,247,0.12);
      border-color: rgba(79,195,247,0.4);
      color: var(--celeste-luz);
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
      z-index: 1;
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

    /* Autocomplete */
    .autocomplete-lista {
      position: absolute;
      top: 100%;
      left: 0; right: 0;
      background: var(--azul-profundo);
      border: 1px solid rgba(79,195,247,0.3);
      border-top: none;
      border-radius: 0 0 6px 6px;
      max-height: 220px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 0 8px 20px rgba(0,0,0,0.4);
    }
    .autocomplete-lista::-webkit-scrollbar { width: 4px; }
    .autocomplete-lista::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }
    .autocomplete-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-family: 'Crimson Pro', serif;
      font-size: 0.95rem;
      color: var(--blanco-perla);
      transition: background 0.1s;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .autocomplete-item:last-child { border-bottom: none; }
    .autocomplete-item:hover, .autocomplete-item.seleccionado-ac {
      background: rgba(79,195,247,0.12);
    }
    .autocomplete-tipo {
      font-size: 0.72rem;
      color: var(--gris-plata);
      font-style: italic;
      margin-left: auto;
      white-space: nowrap;
    }
    .autocomplete-badge {
      font-size: 0.65rem;
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      background: rgba(79,195,247,0.15);
      color: var(--celeste-luz);
      border: 1px solid rgba(79,195,247,0.2);
      white-space: nowrap;
    }

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
    #filtro-tipo {
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
    #filtro-tipo option { background: var(--azul-profundo); }

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
    #lista-spren {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      max-height: calc(100vh - 380px);
      overflow-y: auto;
      padding-right: 0.25rem;
    }
    #lista-spren::-webkit-scrollbar { width: 4px; }
    #lista-spren::-webkit-scrollbar-track { background: transparent; }
    #lista-spren::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }
    #lista-esquirlas {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      padding-right: 0.25rem;
    }
    #lista-esquirlas::-webkit-scrollbar { width: 4px; }
    #lista-esquirlas::-webkit-scrollbar-track { background: transparent; }
    #lista-esquirlas::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }
    #lista-deshechos {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      padding-right: 0.25rem;
    }
    #lista-deshechos::-webkit-scrollbar { width: 4px; }
    #lista-deshechos::-webkit-scrollbar-track { background: transparent; }
    #lista-deshechos::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }
    #lista-heraldos {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      max-height: calc(100vh - 380px);
      overflow-y: auto;
      padding-right: 0.25rem;
    }
    #lista-heraldos::-webkit-scrollbar { width: 4px; }
    #lista-heraldos::-webkit-scrollbar-track { background: transparent; }
    #lista-heraldos::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }

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
    /* Heraldo lista — foto circular con borde dorado estático */
    .item-avatar-heraldo {
      width: 32px; height: 32px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: 2px solid #c8922a;
      box-shadow: 0 0 6px rgba(200,146,42,0.5);
    }
    .item-avatar-heraldo img {
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: center 10%;
      filter: sepia(0.3) contrast(1.1) brightness(1.0);
      display: block;
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
    /* Heraldo ficha grande — anillo dorado giratorio */
    .ficha-avatar-heraldo {
      width: 80px; height: 80px;
      border-radius: 50%;
      flex-shrink: 0;
      position: relative;
      display: flex; align-items: center; justify-content: center;
    }
    .ring-l {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: conic-gradient(#f0c040 0deg, #c8922a 120deg, transparent 180deg, #f0c040 360deg);
      animation: girar-heraldo 4s linear infinite;
      z-index: 0;
    }
    .ring-l-inner {
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: var(--azul-profundo, #0d1f3c);
      z-index: 1;
    }
    .ficha-avatar-heraldo img {
      position: relative;
      width: 72px; height: 72px;
      border-radius: 50%;
      object-fit: cover;
      object-position: center 10%;
      filter: sepia(0.3) contrast(1.1) brightness(1.0);
      z-index: 2;
      display: block;
    }
    @keyframes girar-heraldo { to { transform: rotate(360deg); } }
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
    .relacion-nombre.clickable {
      color: var(--celeste-luz);
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: rgba(79,195,247,0.3);
      text-underline-offset: 3px;
      transition: color 0.15s, text-decoration-color 0.15s;
    }
    .relacion-nombre.clickable:hover {
      color: #fff;
      text-decoration-color: var(--celeste-luz);
    }
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
    <p class="subtitulo">Un proyecto Fan del Cosmere</p>
  </header>

  <div class="contenedor">
    <!-- Panel izquierdo -->
    <aside class="panel-izq">

      <!-- Buscador global -->
      <div class="buscador-wrap">
        <input type="text" id="buscador" placeholder="Buscar..." autocomplete="off" />
        <div class="autocomplete-lista" id="autocomplete-lista" style="display:none"></div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab activo" id="tab-personajes" onclick="cambiarTab('personajes')">Personajes</button>
        <button class="tab" id="tab-spren" onclick="cambiarTab('spren')">Spren</button>
        <button class="tab" id="tab-deshechos" onclick="cambiarTab('deshechos')">Deshechos</button>
        <button class="tab" id="tab-heraldos" onclick="cambiarTab('heraldos')">Heraldos</button>
        <button class="tab" id="tab-esquirlas" onclick="cambiarTab('esquirlas')">Esquirlas</button>
      </div>

      <!-- Filtro personajes -->
      <div class="filtro-seccion" id="filtro-personajes-wrap">
        <label class="filtro-label" for="filtro-orden">Filtrar por orden</label>
        <select id="filtro-orden">
          <option value="">Todas las órdenes</option>
        </select>
      </div>

      <!-- Filtro spren -->
      <div class="filtro-seccion" id="filtro-spren-wrap" style="display:none">
        <label class="filtro-label" for="filtro-tipo">Filtrar por tipo</label>
        <select id="filtro-tipo">
          <option value="">Todos los tipos</option>
        </select>
      </div>

      <div class="lista-titulo">
        <span id="label-lista">Personajes</span> <span id="contador">0</span>
      </div>
      <div id="lista-personajes"></div>
      <div id="lista-spren" style="display:none;flex-direction:column"></div>
      <div id="lista-deshechos" style="display:none;flex-direction:column"></div>
      <div id="lista-esquirlas" style="display:none;flex-direction:column"></div>
      <div id="lista-heraldos" style="display:none;flex-direction:column"></div>
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
    const API = '';
    let todos = [];
    let todosHeraldos = [];
    let todosSpren = [];
    let todosDeshechos = [];
    let todosEsquirlas = [];
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

    // ── Logo por orden ─────────────────────────────────────
    const ORDEN_SLUG = {
      'Corredores del Viento':   'corredores-del-viento',
      'Tejedores de Luz':        'tejedores-de-luz',
      'Forjadores de Vínculos':  'forjadores-de-vinculos',
      'Nominadores de Lo Otro':  'nominadores-de-lo-otro',
      'Vigilantes de la Verdad': 'vigilantes-de-la-verdad',
      'Danzantes del Filo':      'danzantes-del-filo',
      'Rompedores del Cielo':    'rompedores-del-cielo',
      'Escultores de Voluntad':  'escultores-de-voluntad',
      'Custodios de la Piedra':  'custodios-de-la-piedra',
      'Portadores del Polvo':    'portadores-del-polvo',
    };

    function logoOrden(orden, size) {
      const s = size || 28;
      const slug = ORDEN_SLUG[orden];
      if (slug) {
        return \`<img src="/images/ordenes/\${slug}.svg" width="\${s}" height="\${s}" style="filter:brightness(2.5) saturate(1.2);object-fit:contain" alt="\${orden}" />\`;
      }
      return '⚡';
    }

    function logoSpren(tipo, size) {
      const s = size || 28;
      return \`<span style="font-size:\${s * 0.8}px;line-height:1;filter:brightness(1.5)">\${emojiSpren(tipo)}</span>\`;
    }

    // ── Cargar lista ───────────────────────────────────────
    async function cargarLista() {
      try {
        const res = await fetch(\`\${API}/personajes\`);
        todos = await res.json();
        poblarFiltroOrden();
        renderLista(todos);
      } catch (e) {
        document.getElementById('lista-personajes').innerHTML =
          '<p class="sin-datos">Error cargando personajes</p>';
      }
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
      if (tabActual === 'personajes') document.getElementById('contador').textContent = lista.length;
      const wrap = document.getElementById('lista-personajes');
      if (!lista.length) {
        wrap.innerHTML = '<p class="sin-datos">Sin resultados</p>';
        return;
      }
      wrap.innerHTML = lista.map(p => \`
        <div class="item-personaje \${seleccionado === p.id ? 'activo' : ''}"
             onclick="verPersonaje('\${p.id}')" data-id="\${p.id}">
          <div class="item-avatar">\${logoOrden(p.orden)}</div>
          <div class="item-info">
            <div class="item-nombre">\${p.nombre}</div>
            <div class="item-orden">\${p.orden || 'Sin orden'}</div>
          </div>
        </div>
      \`).join('');
    }

    // ── Filtros ────────────────────────────────────────────
    document.getElementById('buscador').addEventListener('input', () => {
      const v = document.getElementById('buscador').value;
      mostrarAutocomplete(v);
      renderLista(todos);
      renderListaSpren(todosSpren);
      renderListaHeraldos(todosHeraldos);
    });
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
    async function verPersonaje(id) {
      seleccionado = id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === id);
      });

      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';

      try {
        const [detRes, relRes] = await Promise.allSettled([
          fetch(\`\${API}/personajes/\${id}\`),
          fetch(\`\${API}/personajes/\${id}/relaciones\`),
        ]);
        const p = await detRes.value.json();
        const rel = relRes.status === 'fulfilled' && relRes.value.ok
          ? (await relRes.value.json())
          : null;

        panel.innerHTML = renderFicha(p, rel);
      } catch (e) {
        panel.innerHTML = '<p class="sin-datos">Error cargando el personaje</p>';
      }
    }

    // ── Render ficha ───────────────────────────────────────
    // ── Enlace automático de entidades por nombre ─────────
    function enlazarEntidad(nombre) {
      if (!nombre || typeof nombre !== 'string') return nombre;
      const nombreLower = nombre.toLowerCase().trim();

      const persona = todos.find(p =>
        p.nombre.toLowerCase() === nombreLower ||
        p.id.toLowerCase() === nombreLower
      );
      if (persona) return "<span class='relacion-nombre clickable' onclick='verPersonaje(" + JSON.stringify(persona.id) + ")'>" + nombre + "</span>";

      const spren = todosSpren.find(s =>
        s.nombre.toLowerCase() === nombreLower ||
        s.id.toLowerCase() === nombreLower
      );
      if (spren) return "<span class='relacion-nombre clickable' onclick='verSpren(" + JSON.stringify(spren.id) + ")'>" + nombre + "</span>";

      const heraldo = todosHeraldos.find(h =>
        h.nombre.toLowerCase() === nombreLower ||
        h.id.toLowerCase() === nombreLower
      );
      if (heraldo) return "<span class='relacion-nombre clickable' onclick='verHeraldo(" + JSON.stringify(heraldo.id) + ")'>" + nombre + "</span>";

      return nombre;
    }

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
        orden ? \`<span class="badge badge-orden">\${orden}</span>\` : '',
        (estado === 'vivo' || estado === 'viva') ? \`<span class=\"badge badge-vivo\">\${estado === 'viva' ? 'Viva' : 'Vivo'}</span>\` : '',
        (estado === 'fallecido' || estado === 'fallecida' || estado === 'muerto') ? \`<span class=\"badge badge-muerto\">\${estado === 'fallecida' ? 'Fallecida' : 'Fallecido'}</span>\` : '',
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
            \${items.map(r => {
              const personajeRef = todos.find(p => p.id === r.personaje);
              const tieneJSON = !!personajeRef;
              const nombreMostrado = personajeRef ? personajeRef.nombre : r.personaje;
              const clickAttr = tieneJSON ? \`onclick="verPersonaje('\${r.personaje}')"\` : '';
              const clase = tieneJSON ? 'relacion-nombre clickable' : 'relacion-nombre';
              return \`
              <div class="relacion-item">
                <span class="\${clase}" \${clickAttr}>\${nombreMostrado}</span>
                <span class="relacion-tipo">\${r.relacion}</span>
              </div>\`;
            }).join('')}
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
            <div class="ficha-avatar">\${logoOrden(orden, 60)}</div>
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
                  ? \`<div class="campo"><span class="campo-label">Spren</span><span class="campo-valor">\${enlazarEntidad(p.orden_radiantes.spren_asociado.principal)}</span></div>\`
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

    // ── Autocompletado ─────────────────────────────────────
    let acIndice = -1;

    function todosLosNombres() {
      const resultados = [];
      for (const p of todos) {
        resultados.push({ id: p.id, nombre: p.nombre, tipo: 'personaje', subtipo: p.orden || 'Sin orden', accion: () => { cambiarTab('personajes'); verPersonaje(p.id); } });
      }
      for (const s of todosSpren) {
        resultados.push({ id: s.id, nombre: s.nombre, tipo: 'spren', subtipo: s.tipo_spren || 'Spren', accion: () => { cambiarTab('spren'); verSpren(s.id); } });
      }
      for (const h of todosHeraldos) {
        resultados.push({ id: h.id, nombre: h.nombre, tipo: 'heraldo', subtipo: h.titulo || 'Heraldo', accion: () => { cambiarTab('heraldos'); verHeraldo(h.id); } });
      for (const d of todosDeshechos)
        if (!texto || d.nombre.toLowerCase().includes(texto) || (d.apodos?.[0] ?? '').toLowerCase().includes(texto))
          resultados.push({ id: d.id, nombre: d.nombre, tipo: 'deshecho', subtipo: d.apodos?.[0] || 'Deshecho', accion: () => { cambiarTab('deshechos'); verDeshecho(d.id); } });
      for (const e of todosEsquirlas)
        if (!texto || e.nombre.toLowerCase().includes(texto))
          resultados.push({ id: e.id, nombre: e.nombre, tipo: 'esquirla', subtipo: e.estado_actual || 'Esquirla', accion: () => { cambiarTab('esquirlas'); verEsquirla(e.id); } });
      }
      return resultados;
    }

    function mostrarAutocomplete(texto) {
      const lista = document.getElementById('autocomplete-lista');
      if (!texto || texto.length < 2) { lista.style.display = 'none'; return; }

      const lower = texto.toLowerCase();
      const matches = todosLosNombres()
        .filter(r => r.nombre.toLowerCase().includes(lower))
        .slice(0, 8);

      if (!matches.length) { lista.style.display = 'none'; return; }

      const badgeColor = { personaje: 'rgba(79,195,247,0.15)', spren: 'rgba(200,146,42,0.15)', heraldo: 'rgba(192,57,43,0.15)' };
      const badgeText = { personaje: 'Personaje', spren: 'Spren', heraldo: 'Heraldo' };

      lista.innerHTML = matches.map((r, i) => \`
        <div class="autocomplete-item" data-idx="\${i}" onmousedown="seleccionarAC(\${i})">
          <span>\${r.nombre}</span>
          <span class="autocomplete-tipo">\${r.subtipo}</span>
          <span class="autocomplete-badge" style="background:\${badgeColor[r.tipo]}">\${badgeText[r.tipo]}</span>
        </div>
      \`).join('');

      lista._matches = matches;
      acIndice = -1;
      lista.style.display = 'block';
    }

    function seleccionarAC(idx) {
      const lista = document.getElementById('autocomplete-lista');
      const match = lista._matches?.[idx];
      if (!match) return;
      document.getElementById('buscador').value = match.nombre;
      lista.style.display = 'none';
      match.accion();
    }

    function navegarAC(dir) {
      const lista = document.getElementById('autocomplete-lista');
      if (lista.style.display === 'none') return false;
      const items = lista.querySelectorAll('.autocomplete-item');
      if (!items.length) return false;
      items[acIndice]?.classList.remove('seleccionado-ac');
      acIndice = Math.max(-1, Math.min(items.length - 1, acIndice + dir));
      if (acIndice >= 0) items[acIndice].classList.add('seleccionado-ac');
      return true;
    }

    document.getElementById('buscador').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); navegarAC(1); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); navegarAC(-1); return; }
      if (e.key === 'Enter') {
        const lista = document.getElementById('autocomplete-lista');
        if (acIndice >= 0 && lista.style.display !== 'none') {
          e.preventDefault();
          seleccionarAC(acIndice);
        } else if (acIndice === -1 && lista._matches?.length) {
          e.preventDefault();
          seleccionarAC(0);
        }
        return;
      }
      if (e.key === 'Escape') {
        document.getElementById('autocomplete-lista').style.display = 'none';
      }
    });

    document.getElementById('buscador').addEventListener('blur', () => {
      setTimeout(() => { document.getElementById('autocomplete-lista').style.display = 'none'; }, 150);
    });

    document.getElementById('buscador').addEventListener('focus', () => {
      const v = document.getElementById('buscador').value;
      if (v.length >= 2) mostrarAutocomplete(v);
    });

    // ── Init ───────────────────────────────────────────────
    function heraldoImgError(img, id) {
      if (!img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = '/images/heraldos/' + id + '.jpg';
      } else {
        img.parentElement.innerHTML = '&#128081;';
      }
    }

    crearParticulas();
    cargarLista();
    cargarSpren();
    cargarHeraldos();
    cargarDeshechos();
    cargarEsquirlas();

    // ── Tabs ───────────────────────────────────────────────
    let tabActual = 'personajes';

    function cambiarTab(tab) {
      tabActual = tab;
      ['personajes','spren','deshechos','heraldos','esquirlas'].forEach(t => {
        document.getElementById('tab-' + t).classList.toggle('activo', t === tab);
        document.getElementById('lista-' + t).style.display = t === tab ? 'flex' : 'none';
      });
      document.getElementById('filtro-personajes-wrap').style.display = tab === 'personajes' ? '' : 'none';
      document.getElementById('filtro-spren-wrap').style.display = tab === 'spren' ? '' : 'none';
      document.getElementById('label-lista').textContent =
        tab === 'personajes' ? 'Personajes' : tab === 'spren' ? 'Spren' : tab === 'deshechos' ? 'Deshechos' : tab === 'heraldos' ? 'Heraldos' : 'Esquirlas';
      if (tab === 'personajes') aplicarFiltros();
      else if (tab === 'spren') renderListaSpren(todosSpren);
      else if (tab === 'deshechos') renderListaDeshechos(todosDeshechos);
      else if (tab === 'heraldos') renderListaHeraldos(todosHeraldos);
      else renderListaEsquirlas(todosEsquirlas);
    }

    // ── Deshechos ──────────────────────────────────────────

    async function cargarDeshechos() {
      try {
        const res = await fetch(\`\${API}/deshechos\`);
        todosDeshechos = await res.json();
        if (tabActual === 'deshechos') renderListaDeshechos(todosDeshechos);
      } catch (e) {
        document.getElementById('lista-deshechos').innerHTML =
          '<p class=\"sin-datos\">Error cargando deshechos</p>';
      }
    }

    function renderListaDeshechos(lista) {
      const texto = document.getElementById('buscador').value.toLowerCase();
      const filtrada = lista.filter(d =>
        !texto || d.nombre.toLowerCase().includes(texto) ||
        (d.apodos?.[0] ?? '').toLowerCase().includes(texto)
      );
      if (tabActual === 'deshechos') document.getElementById('contador').textContent = filtrada.length;
      const wrap = document.getElementById('lista-deshechos');
      if (!filtrada.length) { wrap.innerHTML = '<p class=\"sin-datos\">Sin resultados</p>'; return; }
      wrap.innerHTML = filtrada.map(d => {
        const activo = seleccionado === 'deshecho_' + d.id ? 'activo' : '';
        return \`
          <div class="item-personaje \${activo}"
               onclick="verDeshecho('\${d.id}')" data-id="deshecho_\${d.id}">
            <div class="item-avatar" style="font-size:1.1rem">🔴</div>
            <div class="item-info">
              <div class="item-nombre">\${d.nombre}</div>
              <div class="item-orden">\${d.apodos?.[0] || 'Deshecho'}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function verDeshecho(id) {
      seleccionado = 'deshecho_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'deshecho_' + id);
      });
      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class=\"cargando\"><div class=\"spinner\"></div>Invocando la ficha...</div>';
      try {
        const res = await fetch(\`\${API}/deshechos/\${id}\`);
        const d = await res.json();
        panel.innerHTML = renderFichaDeshecho(d);
      } catch (e) {
        panel.innerHTML = '<p class=\"sin-datos\">Error cargando el deshecho</p>';
      }
    }

    function renderFichaDeshecho(d) {
      const libros = d.apariciones?.libros ?? [];
      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">📕 \${l.titulo}</span>
            \${l.rol ? \`<span class="libro-rol">\${l.rol}</span>\` : ''}
            \${l.pov ? '<span class="libro-pov">POV</span>' : ''}
          </div>\`).join('')
        : '<p class=\"sin-datos\">Sin apariciones registradas</p>';

      const poderesHtml = (d.poderes ?? []).length
        ? \`<div class="tags">\${d.poderes.map(p => \`<span class="tag">⚡ \${p}</span>\`).join('')}</div>\`
        : '<p class=\"sin-datos\">Sin poderes registrados</p>';

      const histHtml = d.historia
        ? \`
          \${d.historia.resumen ? \`<p class="arco-resumen">\${d.historia.resumen}</p>\` : ''}
          \${(d.historia.puntos_clave ?? []).map(pk => \`<div class="punto-clave">\${pk}</div>\`).join('')}
        \` : '<p class=\"sin-datos\">Sin historia registrada</p>';

      const badgeEstado = d.estado_actual?.includes('aprisiona') ? 'badge-muerto' :
                          d.estado_actual?.includes('activo') ? 'badge-vivo' : 'badge-orden';

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar" style="font-size:2.5rem;background:rgba(192,57,43,0.15);border-color:rgba(192,57,43,0.4)">🔴</div>
            <div class="ficha-titulo">
              <h2>\${d.nombre}</h2>
              \${(d.apodos ?? []).length ? \`<div class="nombre-completo"><em>"\${d.apodos.join('", "')}"</em></div>\` : ''}
              <div class="badges">
                <span class="badge badge-heraldo">Deshecho</span>
                <span class="badge \${badgeEstado}">\${d.estado_actual}</span>
                <span class="badge badge-orden">\${d.nivel_consciencia?.split('—')[0]?.trim() || 'Consciencia desconocida'}</span>
              </div>
            </div>
          </div>

          \${d.descripcion_breve ? \`<div class="descripcion">\${d.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">
            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[
                ['Especie', d.especie],
                ['Afiliación', d.afiliacion],
                ['Consciencia', d.nivel_consciencia],
                ['Estado', d.estado_actual],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>\` : '').join('')}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Descripción física</div>
              <p style="font-size:0.9rem;color:var(--blanco-perla)">\${d.descripcion_fisica || 'Apariencia desconocida'}</p>
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Poderes</div>
              \${poderesHtml}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Apariciones</div>
              \${librosHtml}
            </div>
          </div>

          <div class="seccion" style="margin-bottom:2rem">
            <div class="seccion-titulo">Historia</div>
            \${histHtml}
          </div>

          \${d.notas ? \`<div class="seccion"><div class="seccion-titulo">Notas</div><p style="font-size:0.85rem;color:var(--gris-plata);font-style:italic">\${d.notas}</p></div>\` : ''}
        </div>
      \`;
    }

    // ── Esquirlas ──────────────────────────────────────────

    async function cargarEsquirlas() {
      try {
        const res = await fetch(\`\${API}/esquirlas\`);
        todosEsquirlas = await res.json();
        if (tabActual === 'esquirlas') renderListaEsquirlas(todosEsquirlas);
      } catch (e) {
        document.getElementById('lista-esquirlas').innerHTML =
          '<p class=\"sin-datos\">Error cargando esquirlas</p>';
      }
    }

    function renderListaEsquirlas(lista) {
      const texto = document.getElementById('buscador').value.toLowerCase();
      const filtrada = lista.filter(e => !texto || e.nombre.toLowerCase().includes(texto));
      if (tabActual === 'esquirlas') document.getElementById('contador').textContent = filtrada.length;
      const wrap = document.getElementById('lista-esquirlas');
      if (!filtrada.length) { wrap.innerHTML = '<p class=\"sin-datos\">Sin resultados</p>'; return; }

      const iconos = { honor: '✨', cultivacion: '🌿', odium: '🔥', represalia: '⚡' };
      const colores = {
        honor:      'rgba(240,192,64,0.2)',
        cultivacion:'rgba(39,174,96,0.2)',
        odium:      'rgba(192,57,43,0.2)',
        represalia: 'rgba(79,195,247,0.2)'
      };

      wrap.innerHTML = filtrada.map(e => {
        const activo = seleccionado === 'esquirla_' + e.id ? 'activo' : '';
        const icono = iconos[e.id] || '💠';
        const color = colores[e.id] || 'rgba(79,195,247,0.1)';
        return \`
          <div class="item-personaje \${activo}"
               onclick="verEsquirla('\${e.id}')" data-id="esquirla_\${e.id}">
            <div class="item-avatar" style="font-size:1.1rem;background:\${color}">\${icono}</div>
            <div class="item-info">
              <div class="item-nombre">\${e.nombre}</div>
              <div class="item-orden">\${e.estado_actual}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function verEsquirla(id) {
      seleccionado = 'esquirla_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'esquirla_' + id);
      });
      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class=\"cargando\"><div class=\"spinner\"></div>Invocando la ficha...</div>';
      try {
        const res = await fetch(\`\${API}/esquirlas/\${id}\`);
        const e = await res.json();
        panel.innerHTML = renderFichaEsquirla(e);
      } catch (err) {
        panel.innerHTML = '<p class=\"sin-datos\">Error cargando la esquirla</p>';
      }
    }

    function renderFichaEsquirla(e) {
      const iconos = { honor: '✨', cultivacion: '🌿', odium: '🔥', represalia: '⚡' };
      const icono = iconos[e.id] || '💠';
      const coloresBg = {
        honor:       'rgba(240,192,64,0.15)',
        cultivacion: 'rgba(39,174,96,0.15)',
        odium:       'rgba(192,57,43,0.15)',
        represalia:  'rgba(79,195,247,0.15)'
      };
      const coloresBorder = {
        honor:       'rgba(240,192,64,0.4)',
        cultivacion: 'rgba(39,174,96,0.4)',
        odium:       'rgba(192,57,43,0.4)',
        represalia:  'rgba(79,195,247,0.4)'
      };
      const bg     = coloresBg[e.id]     || 'rgba(79,195,247,0.1)';
      const border = coloresBorder[e.id] || 'rgba(79,195,247,0.3)';

      const badgeEstado = e.estado_actual?.includes('activa') ? 'badge-vivo' :
                          e.estado_actual?.includes('fragmentada') || e.estado_actual?.includes('absorbida') ? 'badge-muerto' : 'badge-orden';

      const manifestacionesHtml = (e.manifestaciones_en_roshar ?? []).length
        ? \`<div class="tags">\${e.manifestaciones_en_roshar.map(m => \`<span class="tag">🌀 \${m}</span>\`).join('')}</div>\`
        : '<p class=\"sin-datos\">Sin manifestaciones registradas</p>';

      const recipientesHtml = (e.recipientes ?? []).map(r => \`
        <div class="campo" style="flex-direction:column;align-items:flex-start;gap:0.3rem">
          <span class="campo-label">\${r.nombre} <span class="badge \${r.estado === 'fallecido' || r.estado === 'fallecida' ? 'badge-muerto' : 'badge-vivo'}" style="font-size:0.65rem">\${r.estado}</span></span>
          <span class="campo-valor" style="font-size:0.82rem">\${r.periodo}</span>
          \${r.notas ? \`<span style="font-size:0.8rem;color:var(--gris-plata);font-style:italic">\${r.notas}</span>\` : ''}
        </div>
      \`).join('');

      const relacionesHtml = e.relacion_con_otras_esquirlas
        ? Object.entries(e.relacion_con_otras_esquirlas).map(([k, v]) => \`
          <div class="campo">
            <span class="campo-label">\${k.charAt(0).toUpperCase() + k.slice(1)}</span>
            <span class="campo-valor">\${v}</span>
          </div>\`).join('')
        : '';

      const histHtml = e.historia
        ? \`
          \${e.historia.resumen ? \`<p class="arco-resumen">\${e.historia.resumen}</p>\` : ''}
          \${(e.historia.puntos_clave ?? []).map(pk => \`<div class="punto-clave">\${pk}</div>\`).join('')}
        \` : '';

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar" style="font-size:2.5rem;background:\${bg};border-color:\${border}">\${icono}</div>
            <div class="ficha-titulo">
              <h2>\${e.nombre}</h2>
              \${(e.apodos ?? []).length ? \`<div class="nombre-completo"><em>"\${e.apodos.join('", "')}"</em></div>\` : ''}
              <div class="badges">
                <span class="badge badge-heraldo">Esquirla</span>
                <span class="badge \${badgeEstado}">\${e.estado_actual}</span>
              </div>
            </div>
          </div>

          \${e.descripcion_breve ? \`<div class="descripcion">\${e.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">
            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[
                ['Intención', e.intencion],
                ['Estado', e.estado_actual],
                ['Planeta', e.planeta],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>\` : '').join('')}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Recipientes</div>
              \${recipientesHtml || '<p class=\"sin-datos\">Sin recipientes registrados</p>'}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Manifestaciones en Roshar</div>
              \${manifestacionesHtml}
            </div>

            \${relacionesHtml ? \`
            <div class="seccion">
              <div class="seccion-titulo">Relación con otras Esquirlas</div>
              \${relacionesHtml}
            </div>\` : ''}
          </div>

          <div class="seccion" style="margin-bottom:2rem">
            <div class="seccion-titulo">Historia en Roshar</div>
            \${histHtml}
          </div>

          \${e.notas ? \`<div class="seccion"><div class="seccion-titulo">Notas</div><p style="font-size:0.85rem;color:var(--gris-plata);font-style:italic">\${e.notas}</p></div>\` : ''}
        </div>
      \`;
    }

    // ── Heraldos ───────────────────────────────────────────

    async function cargarHeraldos() {
      try {
        const res = await fetch(\`\${API}/heraldos\`);
        todosHeraldos = await res.json();
      } catch (e) {
        document.getElementById('lista-heraldos').innerHTML =
          '<p class="sin-datos">Error cargando heraldos</p>';
      }
    }

    function renderListaHeraldos(lista) {
      const texto = document.getElementById('buscador').value.toLowerCase();
      const filtrada = lista.filter(h =>
        !texto || h.nombre.toLowerCase().includes(texto) ||
        (h.titulo && h.titulo.toLowerCase().includes(texto))
      );
      if (tabActual === 'heraldos') document.getElementById('contador').textContent = filtrada.length;
      const wrap = document.getElementById('lista-heraldos');
      if (!filtrada.length) {
        wrap.innerHTML = '<p class="sin-datos">Sin resultados</p>';
        return;
      }
      wrap.innerHTML = filtrada.map(h => {
        const activo = seleccionado === 'heraldo_' + h.id ? 'activo' : '';
        const avatarHtml = '<div class="item-avatar-heraldo"><img src="/images/heraldos/' + h.id + '.webp" onerror="heraldoImgError(this, &quot;' + h.id + '&quot;)" /></div>';
        return \`
          <div class="item-personaje \${activo}"
               onclick="verHeraldo('\${h.id}')" data-id="heraldo_\${h.id}">
            \${avatarHtml}
            <div class="item-info">
              <div class="item-nombre">\${h.nombre}</div>
              <div class="item-orden">\${h.titulo || 'Heraldo'}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function verHeraldo(id) {
      seleccionado = 'heraldo_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'heraldo_' + id);
      });
      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';
      try {
        const res = await fetch(\`\${API}/heraldos/\${id}\`);
        const h = await res.json();
        panel.innerHTML = renderFichaHeraldo(h);
      } catch (e) {
        panel.innerHTML = '<p class="sin-datos">Error cargando el heraldo</p>';
      }
    }

    function renderFichaHeraldo(h) {
      const herald = h.herald ?? {};
      const estado = h.estado_actual?.toLowerCase();
      const libros = h.apariciones?.libros ?? [];

      const badges = [
        herald.titulo ? \`<span class="badge badge-orden">\${herald.titulo}</span>\` : '',
        herald.orden_patron ? \`<span class="badge badge-nivel">Patrón \${herald.orden_patron}</span>\` : '',
        estado === 'muerto' ? '<span class="badge badge-muerto">Muerto</span>' : '<span class="badge badge-vivo">Vivo</span>',
        herald.abandono_juramento ? '<span class="badge badge-muerto">Abandonó el Juramento</span>' : '',
      ].filter(Boolean).join('');

      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">📕 \${l.titulo}</span>
            \${l.rol ? \`<span class="libro-rol">\${l.rol}</span>\` : ''}
            \${l.pov ? '<span class="libro-pov">POV</span>' : ''}
          </div>
        \`).join('')
        : '<p class="sin-datos">Sin apariciones registradas</p>';

      const histHtml = h.historia ? \`
        \${h.historia.resumen ? \`<p class="arco-resumen">\${h.historia.resumen}</p>\` : ''}
        \${(h.historia.puntos_clave ?? []).map(pk => \`<div class="punto-clave">\${pk}</div>\`).join('')}
      \` : '<p class="sin-datos">Sin historia registrada</p>';

      const rasgosHtml = (h.personalidad?.rasgos ?? []).length
        ? \`<div class="tags">\${h.personalidad.rasgos.map(r => \`<span class="tag">\${r}</span>\`).join('')}</div>\`
        : '<p class="sin-datos">Sin rasgos registrados</p>';

      const potenciasHtml = (h.habilidades?.potenciacion_honor?.potencias ?? []).length
        ? \`<div class="tags">\${h.habilidades.potenciacion_honor.potencias.map(p => \`<span class="tag">⚡ \${p}</span>\`).join('')}</div>\`
        : '';

      const habilidadesHtml = (h.habilidades?.como_herald ?? []).length
        ? \`<div class="tags">\${h.habilidades.como_herald.map(hab => \`<span class="tag">✦ \${hab}</span>\`).join('')}</div>\`
        : '<p class="sin-datos">Sin habilidades registradas</p>';

      const relacionesHtml = [
        ...(h.relaciones?.familia ?? []).map(r => \`
          <div class="relacion-grupo">
            <div class="relacion-grupo-titulo">👪 familia</div>
            <div class="relacion-item">
              <span class="relacion-nombre">\${enlazarEntidad(r.personaje)}</span>
              <span class="relacion-tipo">\${r.relacion}</span>
            </div>
          </div>\`),
        ...(h.relaciones?.heraldos ?? []).map(r => \`
          <div class="relacion-item">
            <span class="relacion-nombre">\${enlazarEntidad(r.personaje)}</span>
            <span class="relacion-tipo">\${r.relacion}</span>
          </div>\`),
        ...(h.relaciones?.otros ?? []).map(r => \`
          <div class="relacion-item">
            <span class="relacion-nombre">\${enlazarEntidad(r.personaje)}</span>
            <span class="relacion-tipo">\${r.relacion}</span>
          </div>\`),
      ].join('') || '<p class="sin-datos">Sin relaciones registradas</p>';

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar-heraldo">
              <div class="ring-l"></div><div class="ring-l-inner"></div>
              <img src="/images/heraldos/\${h.id}.webp"
                   onerror="heraldoImgError(this, '\${h.id}')" />
            </div>
            <div class="ficha-titulo">
              <h2>\${h.nombre}</h2>
              \${h.nombre_completo && h.nombre_completo !== h.nombre
                ? \`<div class="nombre-completo">\${h.nombre_completo}</div>\` : ''}
              \${(h.apodos ?? []).length
                ? \`<div class="nombre-completo">"<em>\${h.apodos.join('", "')}</em>"</div>\` : ''}
              <div class="badges">\${badges}</div>
            </div>
          </div>

          \${h.descripcion_breve ? \`<div class="descripcion">\${h.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">

            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[
                ['Mundo natal', h.mundo_natal],
                ['Estado',      h.estado_actual],
                ['Muerte',      h.fecha_muerte],
                ['Orden patrón',herald.orden_patron],
                ['Condenación', herald.condenacion],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>\` : '').join('')}
              \${(herald.otros_titulos ?? []).length ? \`
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">Otros títulos</div>
                <div class="tags">\${herald.otros_titulos.map(t => \`<span class="tag">\${t}</span>\`).join('')}</div>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Apariencia</div>
              \${h.apariencia?.fisica ? \`<p style="font-size:0.9rem;color:var(--blanco-perla);margin-bottom:0.5rem">\${h.apariencia.fisica}</p>\` : ''}
              \${h.apariencia?.voz ? \`<div class="campo"><span class="campo-label">Voz</span><span class="campo-valor">\${h.apariencia.voz}</span></div>\` : ''}
              \${h.apariencia?.apariencia_como_mendigo ? \`
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.25rem">Como mendigo</div>
                <p style="font-size:0.85rem;color:var(--gris-plata);font-style:italic">\${h.apariencia.apariencia_como_mendigo}</p>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Personalidad</div>
              \${rasgosHtml}
              \${h.personalidad?.evolucion ? \`<p style="font-size:0.85rem;color:var(--gris-plata);margin-top:0.5rem;font-style:italic">\${h.personalidad.evolucion}</p>\` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Habilidades</div>
              \${habilidadesHtml}
              \${potenciasHtml ? \`
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">Potencias</div>
                \${potenciasHtml}
              \` : ''}
              \${h.habilidades?.liderazgo ? \`
                <div class="campo" style="margin-top:0.5rem">
                  <span class="campo-label">Liderazgo</span>
                  <span class="campo-valor">\${h.habilidades.liderazgo}</span>
                </div>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Relaciones</div>
              \${relacionesHtml}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Apariciones</div>
              \${librosHtml}
            </div>

          </div>

          <div class="seccion" style="margin-bottom:2rem">
            <div class="seccion-titulo">Historia</div>
            \${histHtml}
          </div>

        </div>
      \`;
    }

    // ── Spren ──────────────────────────────────────────────
    let ordenPorSpren = {}; // id → orden_radiante

    async function cargarSpren() {
      try {
        const res = await fetch(\`\${API}/spren\`);
        todosSpren = await res.json();
        // Cargar orden vinculada de cada spren
        await Promise.all(todosSpren.map(async s => {
          try {
            const r = await fetch(\`\${API}/spren/\${s.id}\`);
            const detalle = await r.json();
            ordenPorSpren[s.id] = detalle.vinculo_nahel?.orden_radiante ?? null;
          } catch(e) {}
        }));
        poblarFiltroTipo();
      } catch (e) {
        document.getElementById('lista-spren').innerHTML =
          '<p class="sin-datos">Error cargando spren</p>';
      }
    }

    function poblarFiltroTipo() {
      const tipos = [...new Set(todosSpren.map(s => s.tipo_spren).filter(Boolean))].sort();
      const sel = document.getElementById('filtro-tipo');
      tipos.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        sel.appendChild(opt);
      });
    }

    function emojiSpren(tipo) {
      const m = {
        'honorspren': '🔵',
        'cryptico': '🔷',
        'cultivationspren': '🌿',
        'inkspren': '🖤',
        'peakspren': '⛰',
        'highspren': '⚪',
        'ashspren': '🔴',
        'mistspren': '🌫',
      };
      return m[tipo] || '✨';
    }

    function renderListaSpren(lista) {
      const texto = document.getElementById('buscador').value.toLowerCase();
      const tipo = document.getElementById('filtro-tipo').value;
      const filtrada = lista.filter(s => {
        const matchTexto = !texto || s.nombre.toLowerCase().includes(texto) ||
          (s.apodo && s.apodo.toLowerCase().includes(texto));
        const matchTipo = !tipo || s.tipo_spren === tipo;
        return matchTexto && matchTipo;
      });

      if (tabActual === 'spren') document.getElementById('contador').textContent = filtrada.length;
      const wrap = document.getElementById('lista-spren');
      if (!filtrada.length) {
        wrap.innerHTML = '<p class="sin-datos">Sin resultados</p>';
        return;
      }
      wrap.innerHTML = filtrada.map(s => {
        const activo = seleccionado === 'spren_' + s.id ? 'activo' : '';
        const ordenS = ordenPorSpren[s.id];
        const avatarHtml = ordenS ? logoOrden(ordenS) : logoSpren(s.tipo_spren);
        return \`
          <div class="item-personaje \${activo}"
               onclick="verSpren('\${s.id}')" data-id="spren_\${s.id}">
            <div class="item-avatar">\${avatarHtml}</div>
            <div class="item-info">
              <div class="item-nombre">\${s.nombre}</div>
              <div class="item-orden">\${s.tipo_spren || 'Spren'}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function verSpren(id) {
      seleccionado = 'spren_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'spren_' + id);
      });

      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';

      try {
        const res = await fetch(\`\${API}/spren/\${id}\`);
        const s = await res.json();
        panel.innerHTML = renderFichaSpren(s);
      } catch (e) {
        panel.innerHTML = '<p class="sin-datos">Error cargando el spren</p>';
      }
    }

    function renderFichaSpren(s) {
      const aparienciaFisica = s.apariencia?.reino_fisico;
      const aparienciaCog = s.apariencia?.reino_cognitivo;
      const hoja = s.apariencia?.como_hoja_esquirlada;
      const vinculo = s.vinculo_nahel;
      const personalidad = s.personalidad;
      const habilidades = s.habilidades;
      const historia = s.historia;
      const libros = s.apariciones?.libros ?? [];
      const ordenVinculada = vinculo?.orden_radiante ?? null;

      const badges = [
        s.tipo_spren ? \`<span class="badge badge-orden">\${s.tipo_spren}</span>\` : '',
        s.es_splinter_de ? \`<span class="badge badge-especie">Astilla de \${s.es_splinter_de}</span>\` : '',
        ['activo','activa'].includes(s.estado_actual) ? '<span class="badge badge-vivo">Activo</span>' : '<span class="badge badge-muerto">Inactivo</span>',
      ].filter(Boolean).join('');

      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">📕 \${l.titulo}</span>
            \${l.rol ? \`<span class="libro-rol">\${l.rol}</span>\` : ''}
            \${l.pov ? '<span class="libro-pov">POV</span>' : ''}
          </div>
        \`).join('')
        : '<p class="sin-datos">Sin apariciones registradas</p>';

      const histHtml = historia ? \`
        \${historia.resumen ? \`<p class="arco-resumen">\${historia.resumen}</p>\` : ''}
        \${(historia.puntos_clave ?? []).map(pk => \`<div class="punto-clave">\${pk}</div>\`).join('')}
      \` : '<p class="sin-datos">Sin historia registrada</p>';

      const rasgosHtml = (personalidad?.rasgos ?? []).length
        ? \`<div class="tags">\${personalidad.rasgos.map(r => \`<span class="tag">\${r}</span>\`).join('')}</div>\`
        : '<p class="sin-datos">Sin rasgos registrados</p>';

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar">\${ordenVinculada ? logoOrden(ordenVinculada, 60) : logoSpren(s.tipo_spren)}</div>
            <div class="ficha-titulo">
              <h2>\${s.nombre}</h2>
              \${(s.apodos ?? []).length ? \`<div class="nombre-completo">"<em>\${s.apodos.join('", "')}</em>"</div>\` : ''}
              <div class="badges">\${badges}</div>
            </div>
          </div>

          \${s.descripcion_breve ? \`<div class="descripcion">\${s.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">

            <!-- Datos generales -->
            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[
                ['Tipo', s.tipo_spren],
                ['Creador', s.origen?.creador],
                ['Lugar creación', s.origen?.lugar_creacion],
                ['Generación', s.origen?.generacion],
                ['Splinter de', s.es_splinter_de],
                ['Mundo natal', s.mundo_natal],
                ['Estado', s.estado_actual],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>
              \` : '').join('')}
            </div>

            <!-- Vínculo Nahel -->
            \${vinculo ? \`
            <div class="seccion">
              <div class="seccion-titulo">Vínculo Nahel</div>
              \${[
                ['Radiante', enlazarEntidad(vinculo.radiante_actual)],
                ['Orden', vinculo.orden_radiante],
                ['Forma esquirlada', vinculo.forma_shardblade],
                ['Estado vínculo', vinculo.estado_vinculo],
                ['Radiante anterior', enlazarEntidad(vinculo.radiante_anterior)],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>
              \` : '').join('')}
              \${(vinculo.potencias_otorgadas ?? []).length ? \`
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">Potencias</div>
                <div class="tags">\${vinculo.potencias_otorgadas.map(p => \`<span class="tag">⚡ \${p}</span>\`).join('')}</div>
              \` : ''}
              \${vinculo.notas ? \`<p style="font-size:0.85rem;color:var(--gris-plata);margin-top:0.5rem;font-style:italic">\${vinculo.notas}</p>\` : ''}
            </div>
            \` : ''}

            <!-- Apariencia -->
            \${aparienciaFisica ? \`
            <div class="seccion">
              <div class="seccion-titulo">Apariencia</div>
              \${aparienciaFisica.forma_preferida ? \`
                <div class="campo-label" style="margin-bottom:0.25rem">Forma principal</div>
                <p style="font-size:0.9rem;color:var(--blanco-perla);margin-bottom:0.5rem">\${aparienciaFisica.forma_preferida}</p>
              \` : ''}
              \${(aparienciaFisica.formas_alternativas ?? []).length ? \`
                <div class="campo-label" style="margin-bottom:0.3rem">Formas alternativas</div>
                <div class="tags">\${aparienciaFisica.formas_alternativas.map(f => \`<span class="tag">\${f}</span>\`).join('')}</div>
              \` : ''}
              \${aparienciaFisica.color ? \`
                <div class="campo" style="margin-top:0.5rem">
                  <span class="campo-label">Color</span>
                  <span class="campo-valor">\${aparienciaFisica.color}</span>
                </div>
              \` : ''}
              \${hoja ? \`
                <div class="campo-label" style="margin-top:0.75rem;margin-bottom:0.25rem">Como Hoja Esquirlada</div>
                <div class="campo"><span class="campo-label">Forma</span><span class="campo-valor">\${hoja.forma_habitual}</span></div>
                \${hoja.material ? \`<div class="campo"><span class="campo-label">Material</span><span class="campo-valor">\${hoja.material}</span></div>\` : ''}
              \` : ''}
            </div>
            \` : ''}

            <!-- Personalidad -->
            <div class="seccion">
              <div class="seccion-titulo">Personalidad</div>
              \${rasgosHtml}
              \${personalidad?.notas ? \`<p style="font-size:0.85rem;color:var(--gris-plata);margin-top:0.5rem;font-style:italic">\${personalidad.notas}</p>\` : ''}
            </div>

            <!-- Habilidades -->
            \${habilidades ? \`
            <div class="seccion">
              <div class="seccion-titulo">Habilidades</div>
              \${(habilidades.generales ?? []).length ? \`
                <div class="tags">\${habilidades.generales.map(h => \`<span class="tag">✦ \${h}</span>\`).join('')}</div>
              \` : ''}
              \${(habilidades.magicas ?? []).length ? \`
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">Mágicas</div>
                <div class="tags">\${habilidades.magicas.map(h => \`<span class="tag" style="color:var(--dorado)">⚡ \${h}</span>\`).join('')}</div>
              \` : ''}
            </div>
            \` : ''}

            <!-- Apariciones -->
            <div class="seccion">
              <div class="seccion-titulo">Apariciones</div>
              \${librosHtml}
            </div>

          </div>

          <!-- Historia (ancho completo) -->
          <div class="seccion" style="margin-bottom:2rem">
            <div class="seccion-titulo">Historia</div>
            \${histHtml}
          </div>

        </div>
      \`;
    }

    // Filtro tipo spren
    document.getElementById('filtro-tipo').addEventListener('change', () => renderListaSpren(todosSpren));
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
