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
      --azul-tormenta: #080c14;
      --azul-profundo: #0c1422;
      --azul-medio: #111c30;
      --celeste-luz: #4fc3f7;
      --celeste-vivo: #29b6f6;
      --dorado: #c9a84c;
      --dorado-suave: #a8833a;
      --blanco-perla: #f0ece8;
      --gris-plata: #7a8694;
      --rojo-sangre: #b03828;
      --verde-esmeralda: #2d9e5f;
      --sombra: rgba(0,0,0,0.7);
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
      background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.03) 0%, transparent 55%);
      pointer-events: none;
      z-index: 0;
    }

    /* Header compacto */
    header {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 56px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      background: rgba(8,18,35,0.95);
      backdrop-filter: blur(8px);
      flex-shrink: 0;
    }
    .header-izq {
      display: flex;
      align-items: baseline;
      gap: 1rem;
    }
    h1 {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--blanco-perla);
      letter-spacing: 0.08em;
      white-space: nowrap;
    }
    .subtitulo {
      font-size: 0.78rem;
      color: var(--gris-plata);
      font-style: italic;
      letter-spacing: 0.06em;
      opacity: 0.7;
    }
    .header-der a {
      font-size: 0.78rem;
      color: var(--gris-plata);
      text-decoration: none;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.6;
      transition: opacity 0.15s;
    }
    .header-der a:hover { opacity: 1; color: var(--blanco-perla); }

    /* Layout principal */
    .contenedor {
      position: relative;
      z-index: 10;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 0;
      height: calc(100vh - 56px);
      overflow: hidden;
    }

    /* Tabs */
    .tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.3rem;
      margin-bottom: 1.25rem;
    }
    .tab {
      padding: 0.45rem 0.3rem;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 5px;
      color: var(--gris-plata);
      font-family: 'Crimson Pro', serif;
      font-size: 0.82rem;
      letter-spacing: 0.03em;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
    }
    .tab:hover {
      background: rgba(255,255,255,0.05);
      color: var(--blanco-perla);
      border-color: rgba(255,255,255,0.14);
    }
    .tab.activo {
      background: rgba(201,168,76,0.1);
      border-color: rgba(201,168,76,0.35);
      color: var(--dorado);
    }

    /* Panel izquierdo */
    .panel-izq {
      border-right: 1px solid rgba(255,255,255,0.06);
      padding: 1.25rem 1rem;
      background: rgba(8,18,35,0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
    }

    /* Buscador */
    .buscador-wrap {
      position: relative;
      margin-bottom: 1.5rem;
      flex-shrink: 0;
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
      padding: 0.55rem 0.75rem 0.55rem 2.1rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 5px;
      color: var(--blanco-perla);
      font-family: 'Crimson Pro', serif;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    #buscador:focus {
      border-color: rgba(255,255,255,0.22);
      background: rgba(255,255,255,0.06);
    }
    #buscador::placeholder { color: var(--gris-plata); opacity: 0.45; }
    #buscador-limpiar {
      position: absolute;
      right: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--gris-plata);
      font-size: 1rem;
      cursor: pointer;
      padding: 0.15rem 0.3rem;
      border-radius: 4px;
      line-height: 1;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s, color 0.15s;
      z-index: 2;
    }
    #buscador-limpiar.visible {
      opacity: 0.6;
      pointer-events: auto;
    }
    #buscador-limpiar:hover { opacity: 1; color: var(--blanco-perla); }
    /* Padding derecho del input cuando el botón es visible */
    #buscador.con-texto { padding-right: 2rem; }

    /* Autocomplete */
    .autocomplete-lista {
      position: absolute;
      top: 100%;
      left: 0; right: 0;
      background: var(--azul-profundo);
      border: 1px solid rgba(255,255,255,0.1);
      border-top: none;
      border-radius: 0 0 6px 6px;
      max-height: 220px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    }
    .autocomplete-lista::-webkit-scrollbar { width: 3px; }
    .autocomplete-lista::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
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
      background: rgba(255,255,255,0.06);
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
      background: rgba(255,255,255,0.06);
      color: var(--gris-plata);
      border: 1px solid rgba(255,255,255,0.1);
      white-space: nowrap;
    }

    /* Filtro de orden / tipo — unificados */
    .filtro-seccion {
      margin-bottom: 1rem;
      flex-shrink: 0;
    }
    .filtro-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--gris-plata);
      margin-bottom: 0.5rem;
      display: block;
    }
    .filtro-select {
      width: 100%;
      padding: 0.45rem 0.65rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 5px;
      color: var(--blanco-perla);
      font-family: 'Crimson Pro', serif;
      font-size: 0.88rem;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .filtro-select:focus { border-color: rgba(255,255,255,0.22); }
    .filtro-select option { background: #0c1422; }

    /* Cabecera lista */
    .lista-titulo {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gris-plata);
      opacity: 0.5;
      margin-bottom: 0.6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .lista-titulo span {
      background: rgba(255,255,255,0.07);
      color: var(--gris-plata);
      border-radius: 3px;
      padding: 0.1rem 0.4rem;
      font-size: 0.65rem;
    }

    /* Listas de entidades — clase compartida */
    .lista-scroll {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      padding-right: 0.25rem;
    }
    .lista-scroll::-webkit-scrollbar { width: 3px; }
    .lista-scroll::-webkit-scrollbar-track { background: transparent; }
    .lista-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
    .lista-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }

    /* Skeleton de carga en lista */
    .skeleton-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      border: 1px solid transparent;
    }
    .skeleton-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
      animation: esqueleto 1.4s ease-in-out infinite;
      flex-shrink: 0;
    }
    .skeleton-texto {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .skeleton-linea {
      height: 10px;
      border-radius: 4px;
      background: rgba(255,255,255,0.05);
      animation: esqueleto 1.4s ease-in-out infinite;
    }
    .skeleton-linea.corta { width: 55%; animation-delay: 0.15s; }
    @keyframes esqueleto {
      0%, 100% { opacity: 0.4; }
      50%       { opacity: 0.8; }
    }

    .item-personaje {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.5rem 0.6rem;
      border-radius: 5px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: background 0.12s ease;
    }
    .item-personaje:hover {
      background: rgba(255,255,255,0.05);
    }
    .item-personaje.activo {
      background: rgba(201,168,76,0.07);
      border-color: rgba(201,168,76,0.2);
      box-shadow: inset 3px 0 0 rgba(201,168,76,0.6);
    }
    .item-avatar {
      width: 32px; height: 32px;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0;
      overflow: hidden;
      padding: 0;
    }
    .item-avatar img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
      flex-shrink: 0;
    }
    /* Avatar deshecho — gradiente rojo oscuro */
    .item-avatar-deshecho {
      width: 32px; height: 32px;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem;
      background: rgba(176,56,40,0.15);
      border: 1px solid rgba(176,56,40,0.25);
      flex-shrink: 0;
    }
    /* Heraldo lista — foto cuadrada con borde dorado */
    .item-avatar-heraldo {
      width: 32px; height: 32px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid rgba(201,168,76,0.35);
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
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--blanco-perla);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-orden {
      font-size: 0.72rem;
      color: var(--gris-plata);
      opacity: 0.7;
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
      padding: 1.5rem 2rem 2rem;
      overflow-y: auto;
      height: 100%;
      position: relative;
    }

    /* Estado vacío */
    .estado-vacio {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0.4;
      text-align: center;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 5;
    }
    .estado-vacio p { font-size: 1.1rem; font-style: italic; color: var(--gris-plata); }
    .estado-vacio .cita {
      font-family: 'Cinzel Decorative', serif;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: var(--gris-plata);
      opacity: 0.4;
      margin-top: 0.75rem;
      text-transform: uppercase;
    }

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
      border: 1.5px solid rgba(255,255,255,0.08);
      border-top-color: rgba(255,255,255,0.5);
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
      margin-bottom: 1.75rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .ficha-avatar {
      width: 72px; height: 72px;
      border-radius: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.2rem;
      flex-shrink: 0;
      overflow: hidden;
      padding: 0;
    }
    .ficha-avatar img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
    /* Avatar ficha deshecho */
    .ficha-avatar-deshecho {
      width: 72px; height: 72px;
      border-radius: 12px;
      background: rgba(176,56,40,0.12);
      border: 1px solid rgba(176,56,40,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem;
      flex-shrink: 0;
    }
    /* Heraldo ficha grande — cuadrado con borde dorado */
    .ficha-avatar-heraldo {
      width: 72px; height: 72px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid rgba(201,168,76,0.35);
      position: relative;
    }
    .ficha-avatar-heraldo img {
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: center 10%;
      filter: sepia(0.2) contrast(1.05) brightness(1.05);
      display: block;
    }

    .ficha-titulo h2 {
      font-family: 'Cinzel Decorative', serif;
      font-size: clamp(1.5rem, 3vw, 2.2rem);
      color: var(--blanco-perla);
      margin-bottom: 0.3rem;
      line-height: 1.15;
      letter-spacing: -0.01em;
    }
    .ficha-titulo .nombre-completo {
      font-size: 0.88rem;
      color: var(--gris-plata);
      font-style: italic;
      margin-bottom: 0.3rem;
      opacity: 0.8;
    }
    .badges { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
    .badge {
      font-size: 0.68rem;
      padding: 0.18rem 0.55rem;
      border-radius: 3px;
      font-family: 'Crimson Pro', serif;
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }
    .badge-orden    { background: rgba(240,192,64,0.1);   color: #d4a82a;  border: 1px solid rgba(240,192,64,0.2); }
    .badge-vivo     { background: rgba(39,174,96,0.1);    color: #4db87a;  border: 1px solid rgba(39,174,96,0.2); }
    .badge-muerto   { background: rgba(192,57,43,0.1);    color: #c0614f;  border: 1px solid rgba(192,57,43,0.2); }
    .badge-especie  { background: rgba(255,255,255,0.05); color: var(--gris-plata); border: 1px solid rgba(255,255,255,0.1); }
    .badge-nivel    { background: rgba(200,146,42,0.1);   color: #b8832a;  border: 1px solid rgba(200,146,42,0.2); }
    .badge-deshecho  { background: rgba(192,57,43,0.1);    color: #c0614f;  border: 1px solid rgba(192,57,43,0.2); }
    .badge-esquirla  { background: rgba(240,192,64,0.1);   color: #d4a82a;  border: 1px solid rgba(240,192,64,0.2); }

    /* Descripción */
    .descripcion {
      background: transparent;
      border-left: 2px solid rgba(201,168,76,0.3);
      padding: 0.75rem 1.25rem;
      font-style: italic;
      font-size: 1.05rem;
      color: var(--gris-plata);
      margin-bottom: 1.75rem;
      line-height: 1.7;
    }

    /* Grid de secciones */
    .grid-secciones {
      columns: 2 280px;
      column-gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .seccion {
      break-inside: avoid;
      margin-bottom: 1.25rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      padding: 1.25rem;
      transition: border-color 0.2s, background 0.2s;
    }
    .seccion:hover {
      border-color: rgba(255,255,255,0.11);
      background: rgba(255,255,255,0.03);
    }
    .seccion-titulo {
      font-family: 'Crimson Pro', serif;
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gris-plata);
      opacity: 0.7;
      margin-bottom: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .seccion-titulo::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.07);
    }

    /* Campos básicos */
    .campo {
      display: grid;
      grid-template-columns: 38% 1fr;
      gap: 0.5rem;
      align-items: baseline;
      padding: 0.45rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .campo:last-child { border-bottom: none; }
    .campo-label {
      font-size: 0.7rem;
      color: var(--gris-plata);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      opacity: 0.65;
    }
    .campo-valor {
      font-size: 0.95rem;
      color: var(--blanco-perla);
      line-height: 1.5;
    }

    /* Tags */
    .tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.4rem; margin-bottom: 0.1rem; }
    .tag {
      font-size: 0.78rem;
      padding: 0.15rem 0.5rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 3px;
      color: var(--blanco-perla);
      opacity: 0.85;
    }
    .tag-dorado {
      border-color: rgba(200,146,42,0.2);
      color: #b8832a;
      background: rgba(200,146,42,0.07);
      opacity: 1;
    }

    /* Relaciones — sección ancho completo con columnas internas */
    .seccion-relaciones {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 7px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      transition: border-color 0.2s;
    }
    .seccion-relaciones:hover { border-color: rgba(255,255,255,0.13); }
    .relaciones-columnas {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
      align-items: start;
    }
    .relacion-grupo { margin-bottom: 0; }
    .relacion-grupo-titulo {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--gris-plata);
      opacity: 0.6;
      margin-bottom: 0.4rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .relacion-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.4rem 0.75rem;
      align-items: baseline;
      padding: 0.45rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.93rem;
    }
    .relacion-item:last-child { border-bottom: none; }
    .relacion-nombre { color: var(--blanco-perla); }
    .relacion-nombre.clickable {
      color: var(--blanco-perla);
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: rgba(255,255,255,0.2);
      text-underline-offset: 3px;
      transition: text-decoration-color 0.15s;
    }
    .relacion-nombre.clickable:hover {
      text-decoration-color: rgba(255,255,255,0.6);
    }
    .relacion-tipo { font-size: 0.75rem; color: var(--gris-plata); font-style: italic; opacity: 0.7; }

    /* Libros */
    .libro-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.93rem;
    }
    .libro-item:last-child { border-bottom: none; }
    .libro-titulo { color: var(--blanco-perla); flex: 1; line-height: 1.4; }
    .libro-rol { font-size: 0.72rem; color: var(--gris-plata); font-style: italic; opacity: 0.7; flex-shrink: 0; }
    .libro-pov {
      font-size: 0.65rem;
      padding: 0.1rem 0.35rem;
      background: rgba(201,168,76,0.12);
      color: var(--dorado);
      border-radius: 3px;
      border: 1px solid rgba(201,168,76,0.25);
    }

    /* Arco narrativo */
    .arco-resumen {
      font-size: 0.92rem;
      line-height: 1.7;
      color: var(--gris-plata);
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-style: italic;
    }
    .punto-clave {
      display: flex;
      gap: 0.6rem;
      align-items: flex-start;
      padding: 0.55rem 0;
      font-size: 0.92rem;
      color: var(--gris-plata);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      line-height: 1.65;
    }
    .punto-clave:last-child { border-bottom: none; }
    .punto-clave::before { content: '–'; color: var(--gris-plata); flex-shrink: 0; opacity: 0.35; margin-top: 0.2rem; }

    /* Estado mental */
    .mental-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .mental-item:last-child { border-bottom: none; }
    .mental-label {
      font-size: 0.65rem;
      color: var(--gris-plata);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.6;
      margin-bottom: 0.25rem;
    }
    .mental-valor { font-size: 0.93rem; color: var(--blanco-perla); line-height: 1.65; }

    /* Nivel ideal — círculos */
    .nivel-ideales-wrap { margin-top: 0.75rem; padding-top: 0.45rem; border-top: 1px solid rgba(255,255,255,0.05); }
    .nivel-ideales-label {
      font-size: 0.7rem;
      color: var(--gris-plata);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      opacity: 0.65;
      margin-bottom: 0.5rem;
    }
    .nivel-ideales-circulos {
      display: flex;
      gap: 0.4rem;
      align-items: center;
    }
    .ideal-circulo {
      width: 18px; height: 18px;
      border-radius: 50%;
      border: 2px solid rgba(200,146,42,0.4);
      background: transparent;
      transition: all 0.3s ease;
      position: relative;
    }
    .ideal-circulo.activo {
      background: var(--dorado-suave);
      border-color: var(--dorado);
      box-shadow: 0 0 8px rgba(240,192,64,0.5);
    }
    .nivel-ideales-texto {
      font-size: 0.8rem;
      color: var(--gris-plata);
      margin-left: 0.3rem;
    }

    /* Stats bar */
    .stats-bar {
      display: flex;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 7px;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .stat-item { text-align: center; }
    .stat-num {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.4rem;
      color: var(--blanco-perla);
      display: block;
    }
    .stat-label { font-size: 0.65rem; color: var(--gris-plata); text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.6; }

    /* Afiliaciones */
    .afiliacion-item {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.45rem 0;
      font-size: 0.93rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .afiliacion-item:last-child { border-bottom: none; }
    .afiliacion-item::before { content: '–'; font-size: 0.8rem; color: var(--gris-plata); opacity: 0.4; }

    /* Sin datos */
    .sin-datos {
      font-size: 0.82rem;
      color: var(--gris-plata);
      font-style: italic;
      opacity: 0.45;
      padding: 0.25rem 0;
    }
    .error-ficha {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 0.75rem;
      text-align: center;
    }
    .error-ficha .error-icono { font-size: 2rem; opacity: 0.4; }
    .error-ficha .error-titulo {
      font-family: 'Crimson Pro', serif;
      font-size: 1rem;
      color: var(--blanco-perla);
      opacity: 0.7;
    }
    .error-ficha .error-desc {
      font-size: 0.85rem;
      color: var(--gris-plata);
      font-style: italic;
      opacity: 0.6;
    }

    /* Historial de navegación */
    .historial-barra {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }
    .historial-btn {
      padding: 0.25rem 0.6rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      color: var(--gris-plata);
      font-family: 'Crimson Pro', serif;
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.7;
    }
    .historial-btn:hover {
      background: rgba(255,255,255,0.07);
      color: var(--blanco-perla);
      border-color: rgba(255,255,255,0.15);
      opacity: 1;
    }
    .historial-btn.actual {
      color: var(--blanco-perla);
      border-color: rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.07);
      opacity: 1;
    }
    .historial-separador {
      color: var(--gris-plata);
      font-size: 0.7rem;
      opacity: 0.5;
    }

    /* Utilidades de texto reutilizables */
    .texto-normal { font-size: 0.9rem; color: var(--blanco-perla); line-height: 1.5; }
    .texto-secundario { font-size: 0.85rem; color: var(--gris-plata); font-style: italic; line-height: 1.5; }
    .texto-nota { font-size: 0.82rem; color: var(--gris-plata); font-style: italic; line-height: 1.55; opacity: 0.85; margin-top: 0.4rem; }
    .subseccion-label {
      font-size: 0.65rem;
      color: var(--gris-plata);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.6;
      margin-top: 0.75rem;
      margin-bottom: 0.35rem;
    }
    .seccion-fullwidth {
      margin-bottom: 1.25rem;
    }

    /* Recipientes de Esquirla */
    .recipiente-item {
      padding: 0.6rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .recipiente-item:last-child { border-bottom: none; }
    .recipiente-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .recipiente-nombre {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--blanco-perla);
    }
    .recipiente-periodo {
      font-size: 0.78rem;
      color: var(--gris-plata);
      opacity: 0.7;
      margin-bottom: 0.3rem;
      line-height: 1.4;
    }
    .recipiente-notas {
      font-size: 0.82rem;
      color: var(--gris-plata);
      font-style: italic;
      line-height: 1.5;
      opacity: 0.8;
    }

    /* Relaciones entre Esquirlas */
    .relacion-esquirla-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .relacion-esquirla-item:last-child { border-bottom: none; }
    .relacion-esquirla-nombre {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--gris-plata);
      opacity: 0.65;
      margin-bottom: 0.2rem;
    }
    .relacion-esquirla-desc {
      font-size: 0.88rem;
      color: var(--blanco-perla);
      line-height: 1.5;
    }

    /* Responsive */
    /* ── MÓVIL: vista de una sola pantalla a la vez ── */
    @media (max-width: 768px) {

      /* Header más compacto */
      header { padding: 0 1rem; height: 48px; }
      h1 { font-size: 0.85rem; }
      .subtitulo { display: none; }
      .header-der { display: none; }

      /* Contenedor: columna única, ocupa toda la pantalla bajo el header */
      .contenedor {
        grid-template-columns: 1fr;
        height: calc(100vh - 48px);
        position: relative;
      }

      /* Panel izquierdo: ocupa toda la pantalla por defecto */
      .panel-izq {
        position: absolute;
        inset: 0;
        height: 100%;
        border-right: none;
        border-bottom: none;
        z-index: 10;
        transition: transform 0.3s ease;
        transform: translateX(0);
        padding: 1rem;
      }
      .panel-izq.oculto {
        transform: translateX(-100%);
        pointer-events: none;
      }

      /* Panel derecho: ocupa toda la pantalla, oculto hasta que se selecciona algo */
      .panel-der {
        position: absolute;
        inset: 0;
        height: 100%;
        z-index: 20;
        transition: transform 0.3s ease;
        transform: translateX(100%);
        padding: 1rem;
        padding-top: 0.5rem;
      }
      .panel-der.visible {
        transform: translateX(0);
      }

      /* Botón volver en móvil */
      .btn-volver {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        background: none;
        border: none;
        color: var(--gris-plata);
        font-family: 'Crimson Pro', serif;
        font-size: 0.85rem;
        cursor: pointer;
        padding: 0.75rem 0 0.75rem 0;
        margin-bottom: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        opacity: 0.7;
        width: 100%;
        text-align: left;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .btn-volver:active { opacity: 1; }

      /* Ficha: ajustes para pantalla pequeña */
      .ficha-header { flex-direction: column; gap: 1rem; }
      .ficha-avatar, .ficha-avatar-deshecho,
      .ficha-avatar-heraldo { width: 52px; height: 52px; font-size: 1.5rem; }
      .ficha-titulo h2 { font-size: 1.3rem; }
      .grid-secciones { columns: 1; }
      .historial-barra { display: none; }
      .relaciones-columnas { grid-template-columns: 1fr; }

      /* Estado vacío centrado */
      .estado-vacio { display: none; }

      /* Tabs más compactos */
      .tabs { gap: 0.25rem; margin-bottom: 1rem; }
      .tab { font-size: 0.75rem; padding: 0.4rem 0.2rem; }
    }
  </style>
</head>
<body>

  <header>
    <div class="header-izq">
      <h1 onclick="volverInicio()" style="cursor:pointer;transition:opacity 0.15s" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">La API de las Tormentas</h1>
      <span class="subtitulo">Un proyecto fan del Cosmere</span>
    </div>
    <div class="header-der">
      <a href="https://laapidelastormentas.onrender.com/api-docs" title="Documentación de la API">API Docs</a>
    </div>
  </header>

  <div class="contenedor">
    <!-- Panel izquierdo -->
    <aside class="panel-izq">

      <!-- Buscador global -->
      <div class="buscador-wrap">
        <input type="text" id="buscador" placeholder="Buscar en todo..." autocomplete="off" />
        <button id="buscador-limpiar" title="Limpiar búsqueda" tabindex="-1">✕</button>
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
        <select id="filtro-orden" class="filtro-select">
          <option value="">Todas las órdenes</option>
        </select>
      </div>

      <!-- Filtro spren -->
      <div class="filtro-seccion" id="filtro-spren-wrap" style="display:none">
        <label class="filtro-label" for="filtro-tipo">Filtrar por tipo</label>
        <select id="filtro-tipo" class="filtro-select">
          <option value="">Todos los tipos</option>
        </select>
      </div>

      <div class="lista-titulo">
        <span id="label-lista">Personajes</span> <span id="contador">0</span>
      </div>

      <div id="lista-personajes" class="lista-scroll"></div>
      <div id="lista-spren"      class="lista-scroll" style="display:none"></div>
      <div id="lista-deshechos"  class="lista-scroll" style="display:none"></div>
      <div id="lista-heraldos"   class="lista-scroll" style="display:none"></div>
      <div id="lista-esquirlas"  class="lista-scroll" style="display:none"></div>
    </aside>

    <!-- Panel derecho -->
    <main class="panel-der" id="panel-detalle"></main>

    <!-- Estado vacío: fuera del panel, centrado en toda la ventana -->
    <div class="estado-vacio" id="estado-vacio">
      <p>Selecciona un elemento para explorar su ficha</p>
      <div class="cita">Vida antes que muerte · Fuerza antes que debilidad · Viaje antes que destino</div>
    </div>
  </div>

  <script>
    const API = '';
    let todos         = [];
    let todosHeraldos = [];
    let todosSpren    = [];
    let todosDeshechos= [];
    let todosEsquirlas = [];
    let filtrados     = [];
    let seleccionado  = null;

    // ── Helper de error en ficha ─────────────────────────
    function mostrarErrorFicha(msg) {
      const panel = document.getElementById('panel-detalle');
      panel.innerHTML =
        '<div class="error-ficha">' +
          '<div class="error-icono">\u26A0</div>' +
          '<div class="error-titulo">No encontrado</div>' +
          '<div class="error-desc">' + msg + '</div>' +
        '</div>';
      seleccionado = null;
      document.querySelectorAll('.item-personaje').forEach(el => el.classList.remove('activo'));
    }

    // ── Detección móvil y navegación de paneles ──────────────
    const esMobil = () => window.innerWidth <= 768;

    function mostrarFichaMovil() {
      if (!esMobil()) return;
      document.querySelector('.panel-izq').classList.add('oculto');
      document.querySelector('.panel-der').classList.add('visible');
    }

    function volverInicio() {
      seleccionado = null;
      document.querySelectorAll('.item-personaje').forEach(el => el.classList.remove('activo'));
      document.getElementById('panel-detalle').innerHTML = '';
      document.getElementById('estado-vacio').style.display = '';
      history.pushState(null, '', location.pathname);
      if (esMobil()) volverListaMovil();
    }

    function volverListaMovil() {
      document.querySelector('.panel-izq').classList.remove('oculto');
      document.querySelector('.panel-der').classList.remove('visible');
      seleccionado = null;
    }

    function botonVolver() {
      return esMobil()
        ? '<button class="btn-volver" onclick="volverListaMovil()">← Volver</button>'
        : '';
    }

    // ── Historial de navegación ────────────────────────────
    let historialNavegacion = []; // { tipo, id, nombre }
    const MAX_HISTORIAL = 5;

    function agregarHistorial(tipo, id, nombre) {
      // Evitar duplicado consecutivo
      const ultimo = historialNavegacion[historialNavegacion.length - 1];
      if (ultimo && ultimo.tipo === tipo && ultimo.id === id) return;
      historialNavegacion.push({ tipo, id, nombre });
      if (historialNavegacion.length > MAX_HISTORIAL) historialNavegacion.shift();
    }

    function renderHistorial() {
      const panel = document.getElementById('panel-detalle');
      const barraExistente = panel.querySelector('.historial-barra');
      if (barraExistente) barraExistente.remove();
      if (historialNavegacion.length < 2) return;

      const barra = document.createElement('div');
      barra.className = 'historial-barra';
      historialNavegacion.forEach((h, i) => {
        if (i > 0) {
          const sep = document.createElement('span');
          sep.className = 'historial-separador';
          sep.textContent = '›';
          barra.appendChild(sep);
        }
        const btn = document.createElement('button');
        btn.className = 'historial-btn' + (i === historialNavegacion.length - 1 ? ' actual' : '');
        btn.title = h.nombre;
        btn.textContent = h.nombre;
        if (i < historialNavegacion.length - 1) {
          btn.onclick = () => {
            historialNavegacion = historialNavegacion.slice(0, i + 1);
            const accion = { personaje: verPersonaje, spren: verSpren, heraldo: verHeraldo, deshecho: verDeshecho, esquirla: verEsquirla };
            accion[h.tipo]?.(h.id, true);
          };
        }
        barra.appendChild(btn);
      });

      // Insertar al principio del panel antes del .ficha
      const ficha = panel.querySelector('.ficha');
      if (ficha) panel.insertBefore(barra, ficha);
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

    function logoOrden(orden, size, especie) {
      const s = size || 28;
      const slug = ORDEN_SLUG[orden];
      if (slug) {
        const inner = Math.round(s * 0.92);
        return \`<img src="/images/ordenes/\${slug}.svg" width="\${inner}" height="\${inner}" style="filter:brightness(2.5) saturate(1.2);object-fit:contain;display:block" alt="\${orden}" />\`;
      }
      // Solo humanos sin orden llevan el badge humano
      if (!especie || especie.toLowerCase() === 'humano') {
        return '<img src="/images/humano.png" style="width:100%;height:100%;object-fit:cover;display:block" alt="Humano"/>';
      }
      // Cantores/Parshmenios
      if (especie.toLowerCase().includes('cantor') || especie.toLowerCase().includes('pars')) {
        return '<img src="/images/parshmenios.png" style="width:100%;height:100%;object-fit:cover;display:block" alt="Cantor"/>';
      }
      // Otros (larkin, insomne, retornado...) — cuadrado vacío
      return '';
    }

    function logoSpren(tipo, size) {
      const s = size || 28;
      return \`<span style="font-size:\${s * 0.8}px;line-height:1;filter:brightness(1.5)">\${emojiSpren(tipo)}</span>\`;
    }

    // ── Skeleton de carga ──────────────────────────────────
    function skeletonLista(n) {
      return Array.from({ length: n }, () => \`
        <div class="skeleton-item">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-texto">
            <div class="skeleton-linea"></div>
            <div class="skeleton-linea corta"></div>
          </div>
        </div>
      \`).join('');
    }

    // ── Cargar lista de personajes ─────────────────────────
    async function cargarLista() {
      document.getElementById('lista-personajes').innerHTML = skeletonLista(8);
      try {
        const res = await fetch(\`\${API}/personajes\`);
        todos = await res.json();
        poblarFiltroOrden();
        aplicarFiltros();
      } catch (e) {
        document.getElementById('lista-personajes').innerHTML =
          '<p class="sin-datos">Error cargando personajes</p>';
      }
    }

    function poblarFiltroOrden() {
      const ordenes = [...new Set(todos.map(p => p.orden).filter(o => o && o.trim()))].sort();
      const sel = document.getElementById('filtro-orden');
      // Limpiar opciones anteriores excepto la primera
      while (sel.options.length > 1) sel.remove(1);
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
      const listaOrdenada = [...lista].sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'));
      wrap.innerHTML = listaOrdenada.map(p => \`
        <div class="item-personaje \${seleccionado === p.id ? 'activo' : ''}"
             onclick="verPersonaje('\${p.id}')" data-id="\${p.id}">
          <div class="item-avatar">\${logoOrden(p.orden, 28, p.especie)}</div>
          <div class="item-info">
            <div class="item-nombre">\${p.nombre}</div>
            <div class="item-orden">\${p.orden || 'Sin orden'}</div>
          </div>
        </div>
      \`).join('');
    }

    // ── Filtros ────────────────────────────────────────────
    // BUG CORREGIDO: el input del buscador ahora llama a aplicarFiltros()
    // para respetar el filtro de orden activo al mismo tiempo.
    function actualizarBotonLimpiar() {
      const input = document.getElementById('buscador');
      const btn   = document.getElementById('buscador-limpiar');
      const tieneTexto = input.value.length > 0;
      btn.classList.toggle('visible', tieneTexto);
      input.classList.toggle('con-texto', tieneTexto);
    }

    document.getElementById('buscador').addEventListener('input', () => {
      const v = document.getElementById('buscador').value;
      actualizarBotonLimpiar();
      mostrarAutocomplete(v);
      aplicarFiltros();
      renderListaSpren(todosSpren);
      renderListaHeraldos(todosHeraldos);
      renderListaDeshechos(todosDeshechos);
    });

    document.getElementById('buscador-limpiar').addEventListener('click', () => {
      const input = document.getElementById('buscador');
      input.value = '';
      actualizarBotonLimpiar();
      document.getElementById('autocomplete-lista').style.display = 'none';
      aplicarFiltros();
      renderListaSpren(todosSpren);
      renderListaHeraldos(todosHeraldos);
      renderListaDeshechos(todosDeshechos);
      input.focus();
    });
    document.getElementById('filtro-orden').addEventListener('change', aplicarFiltros);

    function aplicarFiltros() {
      const texto = document.getElementById('buscador').value.toLowerCase().trim();
      const orden = document.getElementById('filtro-orden').value;
      const res = todos.filter(p => {
        const matchTexto = !texto || p.nombre.toLowerCase().includes(texto);
        const matchOrden = !orden || p.orden === orden;
        return matchTexto && matchOrden;
      });
      renderLista(res);
    }

    // ── Ver personaje ──────────────────────────────────────
    async function verPersonaje(id, desdeHistorial) {
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
        if (detRes.status === 'rejected' || !detRes.value.ok) {
          mostrarErrorFicha('El personaje "' + id + '" no existe o no está disponible.');
          return;
        }
        const p = await detRes.value.json();
        const rel = relRes.status === 'fulfilled' && relRes.value.ok
          ? (await relRes.value.json())
          : null;

        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = botonVolver() + renderFicha(p, rel);
        mostrarFichaMovil();
        if (!desdeHistorial) {
          agregarHistorial('personaje', id, p.nombre);
          history.pushState({ tipo: 'personaje', id: id }, '', '?tipo=personaje&id=' + id);
        }
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        mostrarErrorFicha('Error de conexión al cargar el personaje.');
      }
    }

    // ── Helper: capitalizar clave snake_case ───────────────
    function capitalizarClave(clave) {
      return clave
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    // ── Helper compartido: sección de relaciones estandarizada ──────────────
    function renderSeccionRelaciones(grupos) {
      const conDatos = grupos.filter(g => g.items?.length);
      if (!conDatos.length) return '';
      const columnas = conDatos.map(g => \`
        <div class="relacion-grupo">
          <div class="relacion-grupo-titulo">\${g.icono} \${g.titulo}</div>
          \${g.items.map(r => {
            const ref        = todos.find(px => px.id === r.id) || todos.find(px => px.nombre?.toLowerCase() === r.nombre?.toLowerCase());
            const sprenRef   = todosSpren.find(s => s.id === r.id || s.nombre?.toLowerCase() === r.nombre?.toLowerCase());
            const heraldoRef = todosHeraldos.find(h => h.id === r.id || h.nombre?.toLowerCase() === r.nombre?.toLowerCase());
            let attr = 'class="relacion-nombre"';
            if (ref)             attr = \`class="relacion-nombre clickable" onclick="verPersonaje('\${ref.id}')"\`;
            else if (sprenRef)   attr = \`class="relacion-nombre clickable" onclick="verSpren('\${sprenRef.id}')"\`;
            else if (heraldoRef) attr = \`class="relacion-nombre clickable" onclick="verHeraldo('\${heraldoRef.id}')"\`;
            return \`
            <div class="relacion-item">
              <span \${attr}>\${r.nombre}</span>
              <span class="relacion-tipo">\${r.relacion}</span>
            </div>\`;
          }).join('')}
        </div>
      \`).join('');
      return \`
        <div class="seccion-relaciones">
          <div class="seccion-titulo">Relaciones</div>
          <div class="relaciones-columnas">\${columnas}</div>
        </div>
      \`;
    }

    // ── Render ficha personaje ─────────────────────────────
    function enlazarEntidad(nombre) {
      if (!nombre || typeof nombre !== 'string') return nombre;
      const nombreLower = nombre.toLowerCase().trim();

      const persona = todos.find(p =>
        p.nombre.toLowerCase() === nombreLower ||
        p.id.toLowerCase() === nombreLower
      );
      if (persona) return \`<span class='relacion-nombre clickable' onclick='verPersonaje(\${JSON.stringify(persona.id)})'>\${nombre}</span>\`;

      const spren = todosSpren.find(s =>
        s.nombre.toLowerCase() === nombreLower ||
        s.id.toLowerCase() === nombreLower
      );
      if (spren) return \`<span class='relacion-nombre clickable' onclick='verSpren(\${JSON.stringify(spren.id)})'>\${nombre}</span>\`;

      const heraldo = todosHeraldos.find(h =>
        h.nombre.toLowerCase() === nombreLower ||
        h.id.toLowerCase() === nombreLower
      );
      if (heraldo) return \`<span class='relacion-nombre clickable' onclick='verHeraldo(\${JSON.stringify(heraldo.id)})'>\${nombre}</span>\`;

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
        (estado === 'vivo' || estado === 'viva')
          ? \`<span class="badge badge-vivo">\${estado === 'viva' ? 'Viva' : 'Vivo'}</span>\`
          : '',
        (estado === 'fallecido' || estado === 'fallecida' || estado === 'muerto')
          ? \`<span class="badge badge-muerto">\${estado === 'fallecida' ? 'Fallecida' : 'Fallecido'}</span>\`
          : '',
        p.especie ? \`<span class="badge badge-especie">\${p.especie}</span>\` : '',
        nivel !== null && nivel !== undefined
          ? \`<span class="badge badge-nivel">Ideal \${nivel}</span>\`
          : '',
      ].filter(Boolean).join('');

      // Relaciones
      // Relaciones — normalizar al formato del helper
      const iconos = { familia: '👪', amigos: '🤝', enemigos: '⚔' };
      const gruposRel = rel?.relaciones
        ? Object.entries(rel.relaciones).map(([tipo, items]) => ({
            titulo: tipo,
            icono: iconos[tipo] || '•',
            items: (items || []).map(r => {
              const ref = todos.find(px => px.id === r.personaje);
              return { id: r.personaje, nombre: ref ? ref.nombre : r.personaje, relacion: r.relacion };
            })
          }))
        : [];
      const relacionesPersonajeHtml = renderSeccionRelaciones(gruposRel);

      // Libros
      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">\${l.titulo}</span>
            \${l.rol  ? \`<span class="libro-rol">\${l.rol}</span>\` : ''}
            \${l.pov  ? '<span class="libro-pov">POV</span>' : ''}
          </div>
        \`).join('')
        : '<p class="sin-datos">Sin apariciones registradas</p>';

      // Habilidades
      const potencias  = habilidades?.magia?.potencias  ?? [];
      const noMagicas  = habilidades?.no_magicas         ?? [];
      const habilidadesHtml = \`
        \${potencias.length ? \`
          <div class="campo-label">Potencias mágicas</div>
          <div class="tags">\${potencias.map(t => \`<span class="tag">⚡ \${t}</span>\`).join('')}</div>
        \` : ''}
        \${habilidades?.magia?.fuente_de_luz ? \`
          <div class="campo">
            <span class="campo-label">Fuente</span>
            <span class="campo-valor">\${habilidades.magia.fuente_de_luz}</span>
          </div>
        \` : ''}
        \${noMagicas.length ? \`
          <div class="campo-label">No mágicas</div>
          <div class="tags">\${noMagicas.map(t => \`<span class="tag tag-dorado">\${t}</span>\`).join('')}</div>
        \` : ''}
        \${!potencias.length && !noMagicas.length ? '<p class="sin-datos">Sin habilidades registradas</p>' : ''}
      \`;

      // Nivel ideal — círculos en lugar de barra
      const nivelHtml = orden && nivel !== null && nivel !== undefined ? \`
        <div class="nivel-ideales-wrap">
          <div class="nivel-ideales-label">Nivel del Ideal</div>
          <div class="nivel-ideales-circulos">
            \${[1,2,3,4,5].map(n => \`<div class="ideal-circulo \${n <= nivel ? 'activo' : ''}"></div>\`).join('')}
            <span class="nivel-ideales-texto">Nivel \${nivel} de 5</span>
          </div>
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

      // Estado mental — usar capitalizarClave()
      const mentalHtml = mental
        ? Object.entries(mental)
            .filter(([, v]) => v)
            .map(([k, v]) => \`
              <div class="mental-item">
                <div class="mental-label">\${capitalizarClave(k)}</div>
                <div class="mental-valor">\${v}</div>
              </div>
            \`).join('')
        : '<p class="sin-datos">Sin datos</p>';

      // Situación actual — usar capitalizarClave()
      const situacionHtml = situacion
        ? Object.entries(situacion)
            .filter(([, v]) => v)
            .map(([k, v]) => \`
              <div class="campo">
                <span class="campo-label">\${capitalizarClave(k)}</span>
                <span class="campo-valor">\${v}</span>
              </div>
            \`).join('')
        : null;

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar">\${logoOrden(orden, 72, p.especie)}</div>
            <div class="ficha-titulo">
              <h2>\${p.nombre}</h2>
              \${p.nombre_completo && p.nombre_completo !== p.nombre
                ? \`<div class="nombre-completo">\${p.nombre_completo}</div>\` : ''}
              \${apodos.length
                ? \`<div class="nombre-completo">"<em>\${apodos.join('", "')}</em>"</div>\`
                : ''}
              <div class="badges">\${badges}</div>
            </div>
          </div>

          \${p.descripcion_breve ? \`<div class="descripcion">\${p.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">

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

            <div class="seccion">
              <div class="seccion-titulo">Orden Radiante</div>
              \${orden ? \`
                <div class="campo"><span class="campo-label">Orden</span><span class="campo-valor">\${orden}</span></div>
                <div class="campo">
                  <span class="campo-label">Spren</span>
                  <span class="campo-valor">\${(() => {
                    const raw = p.orden_radiantes?.spren_asociado?.principal;
                    if (!raw || raw.trim() === '') return '<em class="sin-datos">Desconocido</em>';
                    return enlazarEntidad(raw);
                  })()}</span>
                </div>
                \${p.orden_radiantes?.estado_del_vinculo
                  ? \`<div class="campo"><span class="campo-label">Vínculo</span><span class="campo-valor">\${p.orden_radiantes.estado_del_vinculo}</span></div>\`
                  : ''}
                \${nivelHtml}
              \` : '<p class="sin-datos">No es Caballero Radiante</p>'}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Habilidades</div>
              \${habilidadesHtml}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Apariciones</div>
              \${librosHtml}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Afiliaciones</div>
              \${afilHtml}
            </div>

            \${situacionHtml ? \`
            <div class="seccion">
              <div class="seccion-titulo">Situación actual</div>
              \${situacionHtml}
            </div>
            \` : ''}

            <div class="seccion">
              <div class="seccion-titulo">Estado mental</div>
              \${mentalHtml}
            </div>

          </div>

          \${relacionesPersonajeHtml}

          <div class="seccion seccion-fullwidth">
            <div class="seccion-titulo">Arco narrativo</div>
            \${arcoHtml}
          </div>

        </div>
      \`;
    }

    // ── Autocompletado ─────────────────────────────────────
    let acIndice = -1;

    // BUG CORREGIDO: las llaves estaban mal anidadas; deshechos quedaban
    // dentro del bloque for de heraldos y nunca aparecían en el autocomplete.
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
      }
      for (const d of todosDeshechos) {
        resultados.push({ id: d.id, nombre: d.nombre, tipo: 'deshecho', subtipo: d.apodos?.[0] || 'Deshecho', accion: () => { cambiarTab('deshechos'); verDeshecho(d.id); } });
      }
      for (const e of todosEsquirlas) {
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

      const badgeColor = {
        personaje: 'rgba(79,195,247,0.15)',
        spren:     'rgba(200,146,42,0.15)',
        heraldo:   'rgba(192,57,43,0.15)',
        deshecho:  'rgba(192,57,43,0.2)',
        esquirla:  'rgba(240,192,64,0.15)',
      };
      const badgeText = { personaje: 'Personaje', spren: 'Spren', heraldo: 'Heraldo', deshecho: 'Deshecho', esquirla: 'Esquirla' };

      lista.innerHTML = matches.map((r, i) => \`
        <div class="autocomplete-item" data-idx="\${i}" onmousedown="seleccionarAC(\${i})">
          <span>\${r.nombre}</span>
          <span class="autocomplete-tipo">\${r.subtipo}</span>
          <span class="autocomplete-badge" style="background:\${badgeColor[r.tipo]}">\${badgeText[r.tipo] || r.tipo}</span>
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
      const fb = img.dataset.fallback || '0';
      if (fb === '0') {
        img.dataset.fallback = '1';
        img.src = '/images/heraldos/' + id + '.jpg';
      } else if (fb === '1') {
        img.dataset.fallback = '2';
        img.src = '/images/heraldos/' + id + '.png';
      } else if (fb === '2') {
        img.dataset.fallback = '3';
        // Intentar con la B mayúscula por si el archivo tiene ese nombre
        img.src = '/images/heraldos/' + id.charAt(0).toUpperCase() + id.slice(1) + '.png';
      } else {
        img.parentElement.innerHTML = '&#128081;';
      }
    }

    // ── Botón atrás del navegador ─────────────────────────
    window.addEventListener('popstate', (e) => {
      const state = e.state;
      if (!state || !state.tipo || !state.id) {
        // Sin estado = inicio
        seleccionado = null;
        document.querySelectorAll('.item-personaje').forEach(el => el.classList.remove('activo'));
        document.getElementById('panel-detalle').innerHTML = '';
        document.getElementById('estado-vacio').style.display = '';
        if (esMobil()) volverListaMovil();
        return;
      }
      const acciones = {
        personaje: (id) => { cambiarTab('personajes'); verPersonaje(id, true); },
        spren:     (id) => { cambiarTab('spren');      verSpren(id,     true); },
        heraldo:   (id) => { cambiarTab('heraldos');   verHeraldo(id,   true); },
        deshecho:  (id) => { cambiarTab('deshechos');  verDeshecho(id,  true); },
        esquirla:  (id) => { cambiarTab('esquirlas');  verEsquirla(id,  true); },
      };
      acciones[state.tipo]?.(state.id);
    });

    // ── Tabs ───────────────────────────────────────────────
    let tabActual = 'personajes';

    cargarLista();
    cargarSpren();
    cargarHeraldos();
    cargarDeshechos();
    cargarEsquirlas();

    // ── Carga inicial desde URL (recarga / link compartido) ─
    (function() {
      const params = new URLSearchParams(location.search);
      const tipo = params.get('tipo');
      const id   = params.get('id');
      if (tipo && id) {
        const tabMap = { personaje: 'personajes', spren: 'spren', heraldo: 'heraldos', deshecho: 'deshechos', esquirla: 'esquirlas' };
        if (tabMap[tipo]) cambiarTab(tabMap[tipo]);
        const acciones = {
          personaje: () => verPersonaje(id, false),
          spren:     () => verSpren(id,     false),
          heraldo:   () => verHeraldo(id,   false),
          deshecho:  () => verDeshecho(id,  false),
          esquirla:  () => verEsquirla(id,  false),
        };
        // Esperar a que los datos carguen antes de abrir la ficha
        setTimeout(() => acciones[tipo]?.(), 800);
      }
    })();

    function cambiarTab(tab) {
      tabActual = tab;
      ['personajes','spren','deshechos','heraldos','esquirlas'].forEach(t => {
        document.getElementById('tab-' + t).classList.toggle('activo', t === tab);
        const lista = document.getElementById('lista-' + t);
        lista.style.display = t === tab ? 'flex' : 'none';
        if (t === tab) lista.style.flexDirection = 'column';
      });
      document.getElementById('filtro-personajes-wrap').style.display = tab === 'personajes' ? '' : 'none';
      document.getElementById('filtro-spren-wrap').style.display      = tab === 'spren'      ? '' : 'none';
      document.getElementById('label-lista').textContent =
        tab === 'personajes' ? 'Personajes' :
        tab === 'spren'      ? 'Spren'      :
        tab === 'deshechos'  ? 'Deshechos'  :
        tab === 'heraldos'   ? 'Heraldos'   : 'Esquirlas';

      // BUG CORREGIDO: cada tab re-aplica sus propios filtros respetando
      // el texto del buscador en lugar de pasar la lista completa.
      if      (tab === 'personajes') aplicarFiltros();
      else if (tab === 'spren')      renderListaSpren(todosSpren);
      else if (tab === 'deshechos')  renderListaDeshechos(todosDeshechos);
      else if (tab === 'heraldos')   renderListaHeraldos(todosHeraldos);
      else                           renderListaEsquirlas(todosEsquirlas);
    }

    // ── Deshechos ──────────────────────────────────────────

    async function cargarDeshechos() {
      document.getElementById('lista-deshechos').innerHTML = skeletonLista(5);
      try {
        const res = await fetch(\`\${API}/deshechos\`);
        todosDeshechos = await res.json();
        if (tabActual === 'deshechos') renderListaDeshechos(todosDeshechos);
        else document.getElementById('lista-deshechos').innerHTML = '';
      } catch (e) {
        document.getElementById('lista-deshechos').innerHTML =
          '<p class="sin-datos">Error cargando deshechos</p>';
      }
    }

    function renderListaDeshechos(lista) {
      const texto = document.getElementById('buscador').value.toLowerCase().trim();
      const filtrada = lista.filter(d =>
        !texto ||
        d.nombre.toLowerCase().includes(texto) ||
        (d.apodos ?? []).some(a => a.toLowerCase().includes(texto))
      );
      if (tabActual === 'deshechos') document.getElementById('contador').textContent = filtrada.length;
      const wrap = document.getElementById('lista-deshechos');
      if (!filtrada.length) { wrap.innerHTML = '<p class="sin-datos">Sin resultados</p>'; return; }
      const filtradaOrdenada = [...filtrada].sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'));
      wrap.innerHTML = filtradaOrdenada.map(d => {
        const activo = seleccionado === 'deshecho_' + d.id ? 'activo' : '';
        return \`
          <div class="item-personaje \${activo}"
               onclick="verDeshecho('\${d.id}')" data-id="deshecho_\${d.id}">
            <div class="item-avatar-deshecho"><img src="/images/desechos.svg" width="29" height="29" style="filter:brightness(2) saturate(0.8);display:block" alt="Deshecho"/></div>
            <div class="item-info">
              <div class="item-nombre">\${d.nombre}</div>
              <div class="item-orden">\${d.apodos?.[0] || 'Deshecho'}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function verDeshecho(id, desdeHistorial) {
      seleccionado = 'deshecho_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'deshecho_' + id);
      });
      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';
      try {
        const res = await fetch(\`\${API}/deshechos/\${id}\`);
        if (!res.ok) { mostrarErrorFicha('El deshecho "' + id + '" no existe o no está disponible.'); return; }
        const d = await res.json();
        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = botonVolver() + renderFichaDeshecho(d);
        mostrarFichaMovil();
        if (!desdeHistorial) {
          agregarHistorial('deshecho', id, d.nombre);
          history.pushState({ tipo: 'deshecho', id: id }, '', '?tipo=deshecho&id=' + id);
        }
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        mostrarErrorFicha('Error de conexión al cargar el deshecho.');
      }
    }

    function renderFichaDeshecho(d) {
      const libros = d.apariciones?.libros ?? [];
      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">\${l.titulo}</span>
            \${l.rol ? \`<span class="libro-rol">\${l.rol}</span>\` : ''}
            \${l.pov ? '<span class="libro-pov">POV</span>' : ''}
          </div>\`).join('')
        : '<p class="sin-datos">Sin apariciones registradas</p>';

      const poderesHtml = (d.poderes ?? []).length
        ? \`<div class="tags">\${d.poderes.map(p => \`<span class="tag">⚡ \${p}</span>\`).join('')}</div>\`
        : '<p class="sin-datos">Sin poderes registrados</p>';

      const histHtml = d.historia
        ? \`
          \${d.historia.resumen ? \`<p class="arco-resumen">\${d.historia.resumen}</p>\` : ''}
          \${(d.historia.puntos_clave ?? []).map(pk => \`<div class="punto-clave">\${pk}</div>\`).join('')}
        \`
        : '<p class="sin-datos">Sin historia registrada</p>';

      // BUG CORREGIDO: se usaba badge-heraldo que no existe como clase CSS.
      // Ahora se usa badge-deshecho definida correctamente.
      const badgeEstado = d.estado_actual?.includes('aprisiona') ? 'badge-muerto' :
                          d.estado_actual?.includes('activo')    ? 'badge-vivo'   : 'badge-orden';

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar-deshecho"><img src="/images/desechos.svg" width="61" height="61" style="filter:brightness(2) saturate(0.8);display:block" alt="Deshecho"/></div>
            <div class="ficha-titulo">
              <h2>\${d.nombre}</h2>
              \${(d.apodos ?? []).length ? \`<div class="nombre-completo"><em>"\${d.apodos.join('", "')}"</em></div>\` : ''}
              <div class="badges">
                <span class="badge badge-deshecho">Deshecho</span>
                \${d.estado_actual ? \`<span class="badge \${badgeEstado}">\${d.estado_actual}</span>\` : ''}
                \${d.nivel_consciencia ? \`<span class="badge badge-orden">\${d.nivel_consciencia.split('—')[0].trim()}</span>\` : ''}
              </div>
            </div>
          </div>

          \${d.descripcion_breve ? \`<div class="descripcion">\${d.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">
            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[
                ['Especie',     d.especie],
                ['Afiliación',  d.afiliacion],
                ['Consciencia', d.nivel_consciencia],
                ['Estado',      d.estado_actual],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>\` : '').join('')}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Descripción física</div>
              <p class="texto-normal">\${d.descripcion_fisica || 'Apariencia desconocida'}</p>
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

          <div class="seccion" class="seccion-fullwidth">
            <div class="seccion-titulo">Historia</div>
            \${histHtml}
          </div>

          \${d.notas ? \`
            <div class="seccion" class="seccion-fullwidth">
              <div class="seccion-titulo">Notas</div>
              <p class="texto-secundario">\${d.notas}</p>
            </div>
          \` : ''}
        </div>
      \`;
    }

    // ── Esquirlas ──────────────────────────────────────────

    async function cargarEsquirlas() {
      document.getElementById('lista-esquirlas').innerHTML = skeletonLista(4);
      try {
        const res = await fetch(\`\${API}/esquirlas\`);
        todosEsquirlas = await res.json();
        if (tabActual === 'esquirlas') renderListaEsquirlas(todosEsquirlas);
        else document.getElementById('lista-esquirlas').innerHTML = '';
      } catch(e) {
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

      const bgMap = { honor:'rgba(240,192,64,0.1)', cultivacion:'rgba(39,174,96,0.1)', odium:'rgba(192,57,43,0.1)', represalia:'rgba(79,195,247,0.1)' };

      wrap.innerHTML = filtrada.map(e => {
        const activo = seleccionado === 'esquirla_' + e.id ? 'activo' : '';
        const bg     = bgMap[e.id] || 'rgba(255,255,255,0.04)';
        const imgAvatar = '<img src="/images/' + e.id + '.png" style="width:100%;height:100%;object-fit:cover;display:block" alt="' + e.nombre + '"/>';
        return \`
          <div class="item-personaje \${activo}"
               onclick="verEsquirla('\${e.id}')" data-id="esquirla_\${e.id}">
            <div class="item-avatar" style="background:\${bg};overflow:hidden">\${imgAvatar}</div>
            <div class="item-info">
              <div class="item-nombre">\${e.nombre}</div>
              <div class="item-orden">\${e.estado_actual}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function verEsquirla(id, desdeHistorial) {
      seleccionado = 'esquirla_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'esquirla_' + id);
      });
      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';
      try {
        const res = await fetch(\`\${API}/esquirlas/\${id}\`);
        if (!res.ok) { mostrarErrorFicha('La esquirla "' + id + '" no existe o no está disponible.'); return; }
        const e   = await res.json();
        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = botonVolver() + renderFichaEsquirla(e);
        mostrarFichaMovil();
        if (!desdeHistorial) {
          agregarHistorial('esquirla', id, e.nombre);
          history.pushState({ tipo: 'esquirla', id: id }, '', '?tipo=esquirla&id=' + id);
        }
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch(err) {
        mostrarErrorFicha('Error de conexión al cargar la esquirla.');
      }
    }

    function renderFichaEsquirla(e) {
      const bgMap2  = { honor:'rgba(240,192,64,0.1)', cultivacion:'rgba(39,174,96,0.1)', odium:'rgba(192,57,43,0.1)', represalia:'rgba(79,195,247,0.1)' };
      const borMap  = { honor:'rgba(240,192,64,0.35)', cultivacion:'rgba(39,174,96,0.35)', odium:'rgba(192,57,43,0.35)', represalia:'rgba(79,195,247,0.35)' };
      const bg     = bgMap2[e.id]  || 'rgba(255,255,255,0.04)';
      const border = borMap[e.id]  || 'rgba(255,255,255,0.1)';
      const imgFicha = '<img src="/images/' + e.id + '.png" style="width:100%;height:100%;object-fit:cover;display:block" alt="' + e.nombre + '"/>';

      const badgeEstado = e.estado_actual?.includes('activa')
        ? 'badge-vivo'
        : (e.estado_actual?.includes('fragmentada') || e.estado_actual?.includes('absorbida'))
          ? 'badge-muerto' : 'badge-orden';

      const manifestacionesHtml = (e.manifestaciones_en_roshar ?? []).length
        ? \`<div class="tags">\${e.manifestaciones_en_roshar.map(m => \`<span class="tag">\${m}</span>\`).join('')}</div>\`
        : '<p class=\"sin-datos\">Sin manifestaciones registradas</p>';

      const recipientesHtml = (e.recipientes ?? []).map(r => \`
        <div class="recipiente-item">
          <div class="recipiente-header">
            <span class="recipiente-nombre">\${enlazarEntidad(r.nombre)}</span>
            <span class="badge \${r.estado === 'fallecido' || r.estado === 'fallecida' ? 'badge-muerto' : 'badge-vivo'}" >\${r.estado}</span>
          </div>
          \${r.periodo ? \`<div class="recipiente-periodo">\${r.periodo}</div>\` : ''}
          \${r.notas   ? \`<div class="recipiente-notas">\${r.notas}</div>\`   : ''}
        </div>
      \`).join('');

      const relacionesHtml = e.relacion_con_otras_esquirlas
        ? Object.entries(e.relacion_con_otras_esquirlas).map(([k, v]) => \`
          <div class="relacion-esquirla-item">
            <div class="relacion-esquirla-nombre">\${k.charAt(0).toUpperCase() + k.slice(1)}</div>
            <div class="relacion-esquirla-desc">\${v}</div>
          </div>\`).join('')
        : '';

      const histHtml = e.historia ? \`
        \${e.historia.resumen ? \`<p class="arco-resumen">\${e.historia.resumen}</p>\` : ''}
        \${(e.historia.puntos_clave ?? []).map(pk => \`<div class="punto-clave">\${pk}</div>\`).join('')}
      \` : '';

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar" style="background:\${bg};border-color:\${border};overflow:hidden">\${imgFicha}</div>
            <div class="ficha-titulo">
              <h2>\${e.nombre}</h2>
              \${(e.apodos ?? []).length ? \`<div class="nombre-completo"><em>"\${e.apodos.join('", "')}"</em></div>\` : ''}
              <div class="badges">
                <span class="badge badge-esquirla">Esquirla</span>
                <span class="badge \${badgeEstado}">\${e.estado_actual}</span>
              </div>
            </div>
          </div>

          \${e.descripcion_breve ? \`<div class="descripcion">\${e.descripcion_breve}</div>\` : ''}

          <div class="grid-secciones">
            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[['Intención', e.intencion], ['Estado', e.estado_actual], ['Planeta', e.planeta]]
                .filter(([,v]) => v)
                .map(([l,v]) => \`<div class="campo"><span class="campo-label">\${l}</span><span class="campo-valor">\${v}</span></div>\`)
                .join('')}
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

          <div class="seccion seccion-fullwidth">
            <div class="seccion-titulo">Historia en Roshar</div>
            \${histHtml}
          </div>

          \${e.notas ? \`
          <div class="seccion">
            <div class="seccion-titulo">Notas</div>
            <p class="arco-resumen">\${e.notas}</p>
          </div>\` : ''}
        </div>
      \`;
    }

    // ── Heraldos ───────────────────────────────────────────

    async function cargarHeraldos() {
      document.getElementById('lista-heraldos').innerHTML = skeletonLista(10);
      try {
        const res = await fetch(\`\${API}/heraldos\`);
        todosHeraldos = await res.json();
        if (tabActual === 'heraldos') renderListaHeraldos(todosHeraldos);
        else document.getElementById('lista-heraldos').innerHTML = '';
      } catch (e) {
        document.getElementById('lista-heraldos').innerHTML =
          '<p class="sin-datos">Error cargando heraldos</p>';
      }
    }

    function renderListaHeraldos(lista) {
      const texto = document.getElementById('buscador').value.toLowerCase().trim();
      const filtrada = lista.filter(h =>
        !texto ||
        h.nombre.toLowerCase().includes(texto) ||
        (h.titulo && h.titulo.toLowerCase().includes(texto))
      );
      if (tabActual === 'heraldos') document.getElementById('contador').textContent = filtrada.length;
      const wrap = document.getElementById('lista-heraldos');
      if (!filtrada.length) {
        wrap.innerHTML = '<p class="sin-datos">Sin resultados</p>';
        return;
      }
      const filtradaHOrdenada = [...filtrada].sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'));
      wrap.innerHTML = filtradaHOrdenada.map(h => {
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

    async function verHeraldo(id, desdeHistorial) {
      seleccionado = 'heraldo_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'heraldo_' + id);
      });
      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';
      try {
        const res = await fetch(\`\${API}/heraldos/\${id}\`);
        if (!res.ok) { mostrarErrorFicha('El heraldo "' + id + '" no existe o no está disponible.'); return; }
        const h = await res.json();
        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = botonVolver() + renderFichaHeraldo(h);
        mostrarFichaMovil();
        if (!desdeHistorial) {
          agregarHistorial('heraldo', id, h.nombre);
          history.pushState({ tipo: 'heraldo', id: id }, '', '?tipo=heraldo&id=' + id);
        }
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        mostrarErrorFicha('Error de conexión al cargar el heraldo.');
      }
    }

    function renderFichaHeraldo(h) {
      const herald = h.herald ?? {};
      const estado = h.estado_actual?.toLowerCase();
      const libros = h.apariciones?.libros ?? [];

      const badges = [
        herald.titulo         ? \`<span class="badge badge-orden">\${herald.titulo}</span>\` : '',
        herald.orden_patron   ? \`<span class="badge badge-nivel">Patrón \${herald.orden_patron}</span>\` : '',
        estado === 'muerto'   ? '<span class="badge badge-muerto">Muerto</span>' : '<span class="badge badge-vivo">Vivo</span>',
        herald.abandono_juramento ? '<span class="badge badge-muerto">Abandonó el Juramento</span>' : '',
      ].filter(Boolean).join('');

      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">\${l.titulo}</span>
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

      // Relaciones heraldo — normalizar al helper
      const gruposHeraldo = [
        { titulo: 'familia',  icono: '👪', items: (h.relaciones?.familia  ?? []).map(r => ({ id: r.personaje, nombre: r.personaje, relacion: r.relacion })) },
        { titulo: 'heraldos', icono: '🛡', items: (h.relaciones?.heraldos ?? []).map(r => ({ id: r.personaje, nombre: r.personaje, relacion: r.relacion })) },
        { titulo: 'otros',    icono: '•',  items: (h.relaciones?.otros    ?? []).map(r => ({ id: r.personaje, nombre: r.personaje, relacion: r.relacion })) },
      ];
      const relacionesHeraldoHtml = renderSeccionRelaciones(gruposHeraldo);

      return \`
        <div class="ficha">
          <div class="ficha-header">
            <div class="ficha-avatar-heraldo">
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
                ['Mundo natal',  h.mundo_natal],
                ['Estado',       h.estado_actual],
                ['Muerte',       h.fecha_muerte],
                ['Orden patrón', herald.orden_patron],
                ['Condenación',  herald.condenacion],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>\` : '').join('')}
              \${(herald.otros_titulos ?? []).length ? \`
                <div class="subseccion-label">Otros títulos</div>
                <div class="tags">\${herald.otros_titulos.map(t => \`<span class="tag">\${t}</span>\`).join('')}</div>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Apariencia</div>
              \${h.apariencia?.fisica
                ? \`<p class="texto-normal">\${h.apariencia.fisica}</p>\`
                : ''}
              \${h.apariencia?.voz
                ? \`<div class="campo"><span class="campo-label">Voz</span><span class="campo-valor">\${h.apariencia.voz}</span></div>\`
                : ''}
              \${h.apariencia?.apariencia_como_mendigo ? \`
                <div class="subseccion-label">Como mendigo</div>
                <p class="texto-secundario">\${h.apariencia.apariencia_como_mendigo}</p>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Personalidad</div>
              \${rasgosHtml}
              \${h.personalidad?.evolucion
                ? \`<p class="texto-nota">\${h.personalidad.evolucion}</p>\`
                : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Habilidades</div>
              \${habilidadesHtml}
              \${potenciasHtml ? \`
                <div class="subseccion-label">Potencias</div>
                \${potenciasHtml}
              \` : ''}
              \${h.habilidades?.liderazgo ? \`
                <div class="campo">
                  <span class="campo-label">Liderazgo</span>
                  <span class="campo-valor">\${h.habilidades.liderazgo}</span>
                </div>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Apariciones</div>
              \${librosHtml}
            </div>

          </div>

          \${relacionesHeraldoHtml}

          <div class="seccion" class="seccion-fullwidth">
            <div class="seccion-titulo">Historia</div>
            \${histHtml}
          </div>

        </div>
      \`;
    }

    // ── Spren ──────────────────────────────────────────────
    let ordenPorSpren = {}; // id → orden_radiante

    async function cargarSpren() {
      document.getElementById('lista-spren').innerHTML = skeletonLista(8);
      try {
        const res = await fetch(\`\${API}/spren\`);
        todosSpren = await res.json();
        // Cargar orden vinculada de cada spren en paralelo
        await Promise.all(todosSpren.map(async s => {
          try {
            const r = await fetch(\`\${API}/spren/\${s.id}\`);
            const detalle = await r.json();
            ordenPorSpren[s.id] = detalle.vinculo_nahel?.orden_radiante ?? null;
          } catch(e) { /* ignorar spren sin detalle */ }
        }));
        poblarFiltroTipo();
        if (tabActual === 'spren') renderListaSpren(todosSpren);
        else document.getElementById('lista-spren').innerHTML = '';
      } catch (e) {
        document.getElementById('lista-spren').innerHTML =
          '<p class="sin-datos">Error cargando spren</p>';
      }
    }

    function poblarFiltroTipo() {
      const tipos = [...new Set(todosSpren.map(s => s.tipo_spren).filter(Boolean))].sort();
      const sel = document.getElementById('filtro-tipo');
      while (sel.options.length > 1) sel.remove(1);
      tipos.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        sel.appendChild(opt);
      });
    }

    function emojiSpren(tipo) {
      const m = {
        'honorspren':       '🔵',
        'cryptico':         '🔷',
        'cultivationspren': '🌿',
        'inkspren':         '🖤',
        'peakspren':        '⛰',
        'highspren':        '⚪',
        'ashspren':         '🔴',
        'mistspren':        '🌫',
      };
      return m[tipo] || '✨';
    }

    function renderListaSpren(lista) {
      const texto = document.getElementById('buscador').value.toLowerCase().trim();
      const tipo  = document.getElementById('filtro-tipo').value;
      const filtrada = lista.filter(s => {
        const matchTexto = !texto ||
          s.nombre.toLowerCase().includes(texto) ||
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
      const filtradaSOrdenada = [...filtrada].sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'));
      wrap.innerHTML = filtradaSOrdenada.map(s => {
        const activo    = seleccionado === 'spren_' + s.id ? 'activo' : '';
        const ordenS    = ordenPorSpren[s.id];
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

    async function verSpren(id, desdeHistorial) {
      seleccionado = 'spren_' + id;
      document.querySelectorAll('.item-personaje').forEach(el => {
        el.classList.toggle('activo', el.dataset.id === 'spren_' + id);
      });

      const panel = document.getElementById('panel-detalle');
      panel.innerHTML = '<div class="cargando"><div class="spinner"></div>Invocando la ficha...</div>';

      try {
        const res = await fetch(\`\${API}/spren/\${id}\`);
        if (!res.ok) { mostrarErrorFicha('El spren "' + id + '" no existe o no está disponible.'); return; }
        const s = await res.json();
        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = botonVolver() + renderFichaSpren(s);
        mostrarFichaMovil();
        if (!desdeHistorial) {
          agregarHistorial('spren', id, s.nombre);
          history.pushState({ tipo: 'spren', id: id }, '', '?tipo=spren&id=' + id);
        }
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        mostrarErrorFicha('Error de conexión al cargar el spren.');
      }
    }

    function renderFichaSpren(s) {
      const aparienciaFisica = s.apariencia?.reino_fisico;
      const aparienciaCog    = s.apariencia?.reino_cognitivo;
      const hoja             = s.apariencia?.como_hoja_esquirlada;
      const vinculo          = s.vinculo_nahel;
      const personalidad     = s.personalidad;
      const habilidades      = s.habilidades;
      const historia         = s.historia;
      const libros           = s.apariciones?.libros ?? [];
      const ordenVinculada   = vinculo?.orden_radiante ?? null;

      const badges = [
        s.tipo_spren ? \`<span class="badge badge-orden">\${s.tipo_spren}</span>\` : '',
        s.es_splinter_de ? \`<span class="badge badge-especie">Astilla de \${s.es_splinter_de}</span>\` : '',
        ['activo','activa'].includes(s.estado_actual)
          ? '<span class="badge badge-vivo">Activo</span>'
          : '<span class="badge badge-muerto">Inactivo</span>',
      ].filter(Boolean).join('');

      const librosHtml = libros.length
        ? libros.map(l => \`
          <div class="libro-item">
            <span class="libro-titulo">\${l.titulo}</span>
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

            <div class="seccion">
              <div class="seccion-titulo">Datos generales</div>
              \${[
                ['Tipo',          s.tipo_spren],
                ['Creador',       s.origen?.creador],
                ['Lugar creación',s.origen?.lugar_creacion],
                ['Generación',    s.origen?.generacion],
                ['Astilla de',    s.es_splinter_de],
                ['Mundo natal',   s.mundo_natal],
                ['Estado',        s.estado_actual],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>
              \` : '').join('')}
            </div>

            \${vinculo ? \`
            <div class="seccion">
              <div class="seccion-titulo">Vínculo Nahel</div>
              \${[
                ['Radiante',          enlazarEntidad(vinculo.radiante_actual)],
                ['Orden',             vinculo.orden_radiante],
                ['Forma esquirlada',  vinculo.forma_shardblade],
                ['Estado vínculo',    vinculo.estado_vinculo],
                ['Radiante anterior', enlazarEntidad(vinculo.radiante_anterior)],
              ].map(([l,v]) => v ? \`
                <div class="campo">
                  <span class="campo-label">\${l}</span>
                  <span class="campo-valor">\${v}</span>
                </div>
              \` : '').join('')}
              \${(vinculo.potencias_otorgadas ?? []).length ? \`
                <div class="subseccion-label">Potencias</div>
                <div class="tags">\${vinculo.potencias_otorgadas.map(p => \`<span class="tag">⚡ \${p}</span>\`).join('')}</div>
              \` : ''}
              \${vinculo.notas ? \`<p class="texto-nota">\${vinculo.notas}</p>\` : ''}
            </div>
            \` : ''}

            \${aparienciaFisica ? \`
            <div class="seccion">
              <div class="seccion-titulo">Apariencia</div>
              \${aparienciaFisica.forma_preferida ? \`
                <div class="subseccion-label">Forma principal</div>
                <p class="texto-normal">\${aparienciaFisica.forma_preferida}</p>
              \` : ''}
              \${(aparienciaFisica.formas_alternativas ?? []).length ? \`
                <div class="subseccion-label">Formas alternativas</div>
                <div class="tags">\${aparienciaFisica.formas_alternativas.map(f => \`<span class="tag">\${f}</span>\`).join('')}</div>
              \` : ''}
              \${aparienciaFisica.color ? \`
                <div class="campo">
                  <span class="campo-label">Color</span>
                  <span class="campo-valor">\${aparienciaFisica.color}</span>
                </div>
              \` : ''}
              \${hoja ? \`
                <div class="subseccion-label">Como Hoja Esquirlada</div>
                <div class="campo"><span class="campo-label">Forma</span><span class="campo-valor">\${hoja.forma_habitual}</span></div>
                \${hoja.material ? \`<div class="campo"><span class="campo-label">Material</span><span class="campo-valor">\${hoja.material}</span></div>\` : ''}
              \` : ''}
            </div>
            \` : ''}

            <div class="seccion">
              <div class="seccion-titulo">Personalidad</div>
              \${rasgosHtml}
              \${personalidad?.notas ? \`<p class="texto-nota">\${personalidad.notas}</p>\` : ''}
            </div>

            \${habilidades ? \`
            <div class="seccion">
              <div class="seccion-titulo">Habilidades</div>
              \${(habilidades.generales ?? []).length ? \`
                <div class="tags">\${habilidades.generales.map(h => \`<span class="tag">✦ \${h}</span>\`).join('')}</div>
              \` : ''}
              \${(habilidades.magicas ?? []).length ? \`
                <div class="subseccion-label">Mágicas</div>
                <div class="tags">\${habilidades.magicas.map(h => \`<span class="tag">⚡ \${h}</span>\`).join('')}</div>
              \` : ''}
            </div>
            \` : ''}

            <div class="seccion">
              <div class="seccion-titulo">Apariciones</div>
              \${librosHtml}
            </div>

          </div>

          \${renderSeccionRelaciones([
            { titulo: 'radiante vinculado', icono: '✦', items: s.relaciones?.radiante_vinculado ? [{ id: s.relaciones.radiante_vinculado.personaje, nombre: s.relaciones.radiante_vinculado.personaje, relacion: s.relaciones.radiante_vinculado.relacion }] : [] },
            { titulo: 'otros', icono: '•', items: (s.relaciones?.otros ?? []).map(r => ({ id: r.personaje, nombre: r.personaje, relacion: r.relacion })) },
          ])}

          <div class="seccion" class="seccion-fullwidth">
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
