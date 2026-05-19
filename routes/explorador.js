import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>La API de las Tormentas — Explorador</title>
  <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      /* Stormlight tokens */
      --bg:          #050811;
      --bg-deep:     #020410;
      --bg-elev:     #0a0f1c;
      --bg-card:     rgba(255,255,255,0.025);
      --card-border: rgba(255,255,255,0.07);
      --rule:        rgba(255,255,255,0.06);
      --rule-soft:   rgba(255,255,255,0.04);
      --ink:         #ebe4d3;
      --ink70:       rgba(235,228,211,0.7);
      --ink50:       rgba(235,228,211,0.5);
      --ink30:       rgba(235,228,211,0.3);
      --gold:        #c9a84c;
      --gold-glow:   rgba(201,168,76,0.35);
      --gold-glow-strong: rgba(201,168,76,0.6);
      --blue:        #5aa3d4;
      --green:       #5eb88a;
      --red:         #c45a4a;

      /* Compat aliases for var() refs in inline styles & JS */
      --azul-tormenta:    #050811;
      --azul-profundo:    #0a0f1c;
      --azul-medio:       #0f1626;
      --celeste-luz:      #5aa3d4;
      --celeste-vivo:     #5aa3d4;
      --dorado:           #c9a84c;
      --dorado-suave:     #8e7530;
      --blanco-perla:     #ebe4d3;
      --gris-plata:       rgba(235,228,211,0.55);
      --rojo-sangre:      #c45a4a;
      --verde-esmeralda:  #5eb88a;
      --sombra:           rgba(0,0,0,0.7);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      background-color: var(--bg);
      color: var(--ink);
      min-height: 100vh;
      overflow-x: hidden;
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* Atmospheric backdrop */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 65% 35%, rgba(201,168,76,0.07) 0%, transparent 55%),
        radial-gradient(ellipse 60% 40% at 20% 90%, rgba(90,163,212,0.06) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }

    /* === HEADER === */
    header {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 56px;
      border-bottom: 1px solid var(--rule);
      background: rgba(5,8,17,0.88);
      backdrop-filter: blur(8px);
      flex-shrink: 0;
    }
    .header-izq {
      display: flex; align-items: baseline; gap: 14px;
    }
    h1 {
      font-family: 'Spectral', Georgia, serif;
      font-size: 17px;
      font-weight: 500;
      color: var(--ink);
      letter-spacing: 0.01em;
      white-space: nowrap;
    }
    .subtitulo {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      color: var(--ink50);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-style: normal;
    }
    .header-der { display: flex; gap: 18px; align-items: center; }
    .header-der a {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10.5px;
      color: var(--ink70);
      text-decoration: none;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      transition: color 0.15s;
      opacity: 1;
    }
    .header-der a:hover { color: var(--gold); }

    /* === ACERCA OVERLAY === */
    .acerca-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(6px);
      z-index: 1000;
      align-items: center; justify-content: center;
      padding: 24px;
    }
    .acerca-overlay.visible { display: flex; }
    .acerca-panel {
      background: var(--bg-elev);
      border: 1px solid var(--gold-glow);
      border-radius: 6px;
      padding: 28px;
      max-width: 620px; width: 100%;
      max-height: 85vh; overflow-y: auto;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 80px rgba(201,168,76,0.15);
    }
    .acerca-cerrar {
      position: absolute; top: 14px; right: 14px;
      background: none; border: none;
      color: var(--ink50);
      font-size: 18px; cursor: pointer;
      transition: color 0.15s;
      line-height: 1; padding: 4px 8px;
    }
    .acerca-cerrar:hover { color: var(--ink); }
    .acerca-seccion {
      border: 1px solid var(--rule);
      border-radius: 4px;
      padding: 16px 18px;
      margin-bottom: 14px;
      background: var(--bg-card);
    }
    .acerca-seccion-titulo {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: var(--gold);
      margin-bottom: 10px;
    }
    .acerca-seccion p {
      font-size: 13.5px;
      color: var(--ink);
      line-height: 1.7;
      margin-bottom: 6px;
    }
    .acerca-seccion p:last-child { margin-bottom: 0; }
    .acerca-seccion a {
      color: var(--gold);
      text-decoration: none;
      border-bottom: 1px solid var(--gold-glow);
    }
    .acerca-seccion a:hover { border-bottom-color: var(--gold); }
    .acerca-aviso {
      background: rgba(201,168,76,0.04);
      border: 1px solid var(--gold-glow);
      border-radius: 4px;
      padding: 14px;
      margin-bottom: 14px;
    }
    .acerca-aviso p {
      font-family: 'Spectral', Georgia, serif;
      font-style: italic;
      font-size: 12.5px;
      color: var(--ink70);
      line-height: 1.6;
      text-align: center;
    }

    /* === LAYOUT === */
    .contenedor {
      position: relative;
      z-index: 10;
      display: grid;
      grid-template-columns: 308px 1fr;
      gap: 0;
      height: calc(100vh - 56px);
      overflow: hidden;
    }

    /* === TABS === */
    .tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      margin-bottom: 16px;
    }
    .tab {
      padding: 6px 4px;
      background: transparent;
      border: 1px solid var(--rule);
      border-radius: 2px;
      color: var(--ink50);
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
    }
    .tab:hover {
      background: rgba(255,255,255,0.04);
      color: var(--ink);
      border-color: rgba(255,255,255,0.14);
    }
    .tab.activo {
      background: rgba(201,168,76,0.07);
      border-color: var(--gold-glow);
      color: var(--gold);
      box-shadow: 0 0 12px rgba(201,168,76,0.12);
    }

    /* === PANEL IZQUIERDO === */
    .panel-izq {
      border-right: 1px solid var(--rule);
      padding: 22px 18px;
      background: rgba(255,255,255,0.012);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
    }

    /* === BUSCADOR === */
    .buscador-wrap {
      position: relative;
      margin-bottom: 18px;
      flex-shrink: 0;
    }
    .buscador-wrap::before {
      content: '';
      position: absolute;
      left: 12px; top: 50%;
      transform: translateY(-50%);
      width: 13px; height: 13px;
      background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ebe4d3' stroke-opacity='0.5' stroke-width='2'><circle cx='11' cy='11' r='7'/><line x1='20' y1='20' x2='17' y2='17'/></svg>") center/contain no-repeat;
      z-index: 1;
      transition: opacity 0.2s;
    }
    .buscador-wrap:focus-within::before { opacity: 1; }
    #buscador {
      width: 100%;
      padding: 9px 12px 9px 32px;
      background: rgba(255,255,255,0.025);
      border: 1px solid var(--rule);
      border-radius: 3px;
      color: var(--ink);
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    #buscador:focus {
      border-color: var(--gold-glow);
      background: rgba(255,255,255,0.04);
    }
    #buscador::placeholder { color: var(--ink50); }
    #buscador-limpiar {
      position: absolute;
      right: 8px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      color: var(--ink50);
      font-size: 14px; cursor: pointer;
      padding: 2px 6px;
      border-radius: 2px;
      line-height: 1;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s, color 0.15s;
      z-index: 2;
    }
    #buscador-limpiar.visible { opacity: 0.6; pointer-events: auto; }
    #buscador-limpiar:hover { opacity: 1; color: var(--ink); }
    #buscador.con-texto { padding-right: 34px; }

    /* === AUTOCOMPLETE === */
    .autocomplete-lista {
      position: absolute;
      top: calc(100% + 4px);
      left: 0; right: 0;
      background: rgba(5,8,17,0.97);
      border: 1px solid var(--rule);
      border-radius: 3px;
      max-height: 320px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 0 12px 40px rgba(0,0,0,0.7);
      backdrop-filter: blur(12px);
    }
    .autocomplete-lista::-webkit-scrollbar { width: 3px; }
    .autocomplete-lista::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
    .autocomplete-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 13px;
      color: var(--ink);
      border-bottom: 1px solid var(--rule-soft);
      transition: background 0.1s;
    }
    .autocomplete-item:last-child { border-bottom: none; }
    .autocomplete-item:hover, .autocomplete-item.seleccionado-ac {
      background: rgba(201,168,76,0.07);
    }
    .autocomplete-tipo {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-left: auto;
      white-space: nowrap;
    }
    .autocomplete-badge {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 2px;
      background: rgba(255,255,255,0.04);
      color: var(--ink50);
      border: 1px solid var(--rule);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* === FILTROS === */
    .filtro-seccion {
      margin-bottom: 14px;
      flex-shrink: 0;
    }
    .filtro-label {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--ink50);
      margin-bottom: 6px;
      display: block;
    }
    .filtro-select {
      width: 100%;
      padding: 7px 10px;
      background: rgba(255,255,255,0.025);
      border: 1px solid var(--rule);
      border-radius: 3px;
      color: var(--ink);
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12.5px;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .filtro-select:focus { border-color: var(--gold-glow); }
    .filtro-select option { background: var(--bg-elev); color: var(--ink); }

    /* === LISTA HEADER === */
    .lista-titulo {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--ink50);
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      opacity: 1;
    }
    .lista-titulo span {
      background: transparent;
      color: var(--gold);
      font-variant-numeric: tabular-nums;
      padding: 0;
      border-radius: 0;
      font-size: 10px;
      letter-spacing: 0.1em;
    }

    /* === LISTA SCROLL === */
    .lista-scroll {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      padding-right: 4px;
    }
    .lista-scroll::-webkit-scrollbar { width: 3px; }
    .lista-scroll::-webkit-scrollbar-track { background: transparent; }
    .lista-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    .lista-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    /* === SKELETON === */
    .skeleton-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 3px;
      border: 1px solid transparent;
    }
    .skeleton-avatar {
      width: 32px; height: 32px;
      border-radius: 3px;
      background: rgba(255,255,255,0.04);
      animation: esqueleto 1.4s ease-in-out infinite;
      flex-shrink: 0;
    }
    .skeleton-texto {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .skeleton-linea {
      height: 10px;
      border-radius: 2px;
      background: rgba(255,255,255,0.04);
      animation: esqueleto 1.4s ease-in-out infinite;
    }
    .skeleton-linea.corta { width: 55%; animation-delay: 0.15s; }
    @keyframes esqueleto {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }

    /* === ITEM PERSONAJE === */
    .item-personaje {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid transparent;
      position: relative;
      transition: background 0.12s, border-color 0.12s;
    }
    .item-personaje:hover {
      background: rgba(255,255,255,0.025);
      transform: none;
    }
    .item-personaje.activo {
      background: rgba(201,168,76,0.06);
      border-color: var(--gold-glow);
      box-shadow: inset 0 0 16px rgba(201,168,76,0.04);
    }
    .item-personaje.activo::before {
      content: '';
      position: absolute;
      left: -1px;
      top: 6px; bottom: 6px;
      width: 2px;
      background: var(--gold);
      box-shadow: 0 0 10px var(--gold-glow);
    }

    .item-avatar,
    .item-avatar-deshecho,
    .item-avatar-heraldo {
      width: 32px; height: 32px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.025);
      border: 1px solid var(--rule);
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
      padding: 0;
      font-size: 16px;
    }
    .item-personaje.activo .item-avatar,
    .item-personaje.activo .item-avatar-heraldo,
    .item-personaje.activo .item-avatar-deshecho {
      border-color: var(--gold-glow);
    }
    .item-avatar img,
    .item-avatar-heraldo img,
    .item-avatar-deshecho img {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
    .item-avatar-deshecho {
      background: rgba(196,90,74,0.08);
      border-color: rgba(196,90,74,0.25);
    }
    .item-avatar-heraldo img {
      object-position: center 10%;
      filter: sepia(0.2) contrast(1.05) brightness(1.05);
    }
    .item-info { flex: 1; min-width: 0; }
    .item-nombre {
      font-family: 'Spectral', Georgia, serif;
      font-size: 15px;
      font-weight: 500;
      color: var(--ink70);
      line-height: 1.15;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-personaje.activo .item-nombre {
      color: var(--ink);
      font-weight: 600;
    }
    .item-orden {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-estado {
      width: 7px; height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .vivo { background: var(--green); box-shadow: 0 0 6px rgba(94,184,138,0.6); }
    .muerto { background: var(--red); box-shadow: 0 0 6px rgba(196,90,74,0.5); }

    /* === ESPECIE AVATARS === */
    .av-especie-s {
      width: 32px; height: 32px;
      border-radius: 3px;
      border: 1px solid var(--rule);
      flex-shrink: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .av-especie-g {
      width: 72px; height: 72px;
      border-radius: 6px;
      border: 1px solid var(--gold-glow);
      flex-shrink: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      z-index: 2;
      box-shadow: 0 0 20px var(--gold-glow);
    }

    /* === PANEL DERECHO === */
    .panel-der {
      padding: 0;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      position: relative;
      background: transparent;
    }
    .panel-der::-webkit-scrollbar { width: 4px; }
    .panel-der::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    /* Grafo overlay */
    .grafo-panel.visible {
      position: absolute;
      inset: 0;
      z-index: 10;
      background: var(--bg);
      display: flex !important;
      flex-direction: column;
      padding: 20px 28px 18px;
      overflow-y: auto;
    }
    .grafo-panel.visible .grafo-canvas {
      flex: 1;
      min-height: 0;
      max-height: calc(100% - 180px);
    }
    .grafo-panel.visible .grafo-stats {
      flex-shrink: 0;
    }

    /* === ESTADO VACIO === */
    .estado-vacio {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0.55;
      text-align: center;
      position: fixed;
      top: 56px; left: 308px; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 5;
      gap: 10px;
    }
    .estado-vacio p {
      font-family: 'Spectral', Georgia, serif;
      font-size: 18px;
      font-style: italic;
      color: var(--ink70);
    }
    .estado-vacio .cita {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      letter-spacing: 0.22em;
      color: var(--ink50);
      opacity: 0.8;
      margin-top: 6px;
      text-transform: uppercase;
    }

    /* === CARGANDO === */
    .cargando {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      gap: 14px;
      color: var(--ink50);
      font-family: 'Spectral', Georgia, serif;
      font-style: italic;
      font-size: 14px;
    }
    .spinner {
      width: 24px; height: 24px;
      border: 1.5px solid var(--rule);
      border-top-color: var(--gold);
      border-radius: 50%;
      animation: girar 0.8s linear infinite;
      box-shadow: 0 0 12px var(--gold-glow);
    }
    @keyframes girar { to { transform: rotate(360deg); } }

    /* === FICHA === */
    .ficha {
      animation: aparecer 0.3s ease;
      padding-bottom: 32px;
    }
    @keyframes aparecer {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ficha-header {
      position: relative;
      display: flex;
      gap: 24px;
      align-items: flex-start;
      margin: 0 0 20px;
      padding: 28px 40px 24px;
      border-bottom: 1px solid var(--rule);
      overflow: hidden;
    }

    /* Orbital glow — concentric rings via stacked radial gradients */
    .ficha-header::before {
      content: '';
      position: absolute;
      right: -110px;
      top: -100px;
      width: 420px;
      height: 420px;
      pointer-events: none;
      background:
        radial-gradient(circle at center, transparent 47px, rgba(201,168,76,0.5) 49px, transparent 51px),
        radial-gradient(circle at center, transparent 87px, rgba(201,168,76,0.3) 89px, transparent 91px),
        radial-gradient(circle at center, transparent 127px, rgba(201,168,76,0.22) 129px, transparent 131px),
        radial-gradient(circle at center, transparent 167px, rgba(201,168,76,0.14) 169px, transparent 171px),
        radial-gradient(ellipse 50% 50% at center, rgba(201,168,76,0.2) 0%, transparent 60%);
      z-index: 0;
    }
    .ficha-header::after {
      content: '';
      position: absolute;
      right: 96px; top: 108px;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--gold);
      box-shadow: 0 0 16px var(--gold);
      z-index: 0;
    }

    .ficha-avatar,
    .ficha-avatar-deshecho,
    .ficha-avatar-heraldo {
      width: 72px; height: 72px;
      border-radius: 6px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--gold-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      flex-shrink: 0;
      overflow: hidden;
      padding: 0;
      position: relative;
      z-index: 2;
      box-shadow: 0 0 20px var(--gold-glow);
    }
    .ficha-avatar img,
    .ficha-avatar-heraldo img,
    .ficha-avatar-deshecho img {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
    .ficha-avatar-deshecho {
      background: rgba(196,90,74,0.1);
      border-color: rgba(196,90,74,0.4);
      box-shadow: 0 0 24px rgba(196,90,74,0.3);
    }
    .ficha-avatar-heraldo img {
      object-position: center 10%;
      filter: sepia(0.2) contrast(1.05) brightness(1.05);
    }

    .ficha-titulo {
      position: relative;
      z-index: 2;
      flex: 1;
      min-width: 0;
    }
    .ficha-titulo h2 {
      font-family: 'Spectral', Georgia, serif;
      font-size: clamp(36px, 5.5vw, 64px);
      font-weight: 500;
      color: var(--ink);
      margin: 2px 0 6px;
      line-height: 0.96;
      letter-spacing: -0.015em;
    }
    .ficha-titulo .nombre-completo {
      font-family: 'Spectral', Georgia, serif;
      font-size: 17px;
      font-style: italic;
      color: var(--gold);
      margin-bottom: 4px;
      opacity: 1;
    }
    .ficha-titulo .nombre-completo em { font-style: italic; }

    /* === BADGES === */
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 12px;
    }
    .badge {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      padding: 4px 9px;
      border-radius: 2px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      border: 1px solid var(--rule);
      background: rgba(255,255,255,0.02);
      color: var(--ink70);
    }
    .badge-orden,
    .badge-nivel,
    .badge-esquirla {
      background: rgba(201,168,76,0.07);
      color: var(--gold);
      border-color: rgba(201,168,76,0.3);
    }
    .badge-vivo {
      background: rgba(94,184,138,0.07);
      color: var(--green);
      border-color: rgba(94,184,138,0.3);
    }
    .badge-vivo::before {
      content: '';
      display: inline-block;
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 6px var(--green);
      margin-right: 6px;
      vertical-align: middle;
    }
    .badge-muerto,
    .badge-deshecho {
      background: rgba(196,90,74,0.07);
      color: var(--red);
      border-color: rgba(196,90,74,0.3);
    }
    .badge-muerto::before {
      content: '';
      display: inline-block;
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--red);
      margin-right: 6px;
      vertical-align: middle;
    }
    .badge-especie {
      background: rgba(255,255,255,0.025);
      color: var(--ink70);
      border-color: var(--rule);
    }

    /* === DESCRIPCION === */
    .descripcion {
      font-family: 'Spectral', Georgia, serif;
      font-style: italic;
      font-size: 17px;
      color: var(--ink);
      line-height: 1.55;
      padding: 0 22px;
      margin: 0 40px 22px;
      max-width: 920px;
      border-left: 2px solid var(--gold);
      background: transparent;
    }

    /* === GRID SECCIONES === */
    .grid-secciones {
      columns: 2 300px;
      column-gap: 18px;
      padding: 0 40px;
      margin-bottom: 16px;
    }

    .seccion {
      break-inside: avoid;
      margin-bottom: 18px;
      background: var(--bg-card);
      border: 1px solid var(--card-border);
      border-radius: 4px;
      padding: 16px 18px;
      transition: border-color 0.2s, background 0.2s;
    }
    .seccion:hover {
      border-color: rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.035);
    }
    .seccion-fullwidth {
      margin: 18px 40px;
      background: var(--bg-card);
      border: 1px solid var(--card-border);
      border-radius: 4px;
      padding: 18px 22px;
    }
    .seccion-titulo {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: var(--ink50);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 1;
    }
    .seccion-titulo::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    /* === CAMPOS === */
    .campo {
      display: grid;
      grid-template-columns: 38% 1fr;
      gap: 10px;
      align-items: baseline;
      padding: 5px 0;
      border-bottom: 1px solid var(--rule);
    }
    .campo:last-child { border-bottom: none; }
    .campo-label {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      opacity: 1;
    }
    .campo-valor {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12.5px;
      color: var(--ink);
      line-height: 1.5;
    }

    /* === TAGS === */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 4px;
      margin-bottom: 2px;
    }
    .tag {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 11.5px;
      padding: 3px 9px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--rule);
      border-radius: 2px;
      color: var(--ink70);
      opacity: 1;
    }
    .tag-dorado {
      border-color: rgba(201,168,76,0.3);
      color: var(--gold);
      background: rgba(201,168,76,0.07);
    }

    /* === LIBROS === */
    .libro-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 0;
      border-bottom: 1px solid var(--rule);
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12.5px;
    }
    .libro-item:last-child { border-bottom: none; }
    .libro-titulo { color: var(--ink); flex: 1; line-height: 1.4; }
    .libro-rol {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      flex-shrink: 0;
      opacity: 1;
      font-style: normal;
    }
    .libro-pov {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9px;
      padding: 2px 6px;
      background: rgba(201,168,76,0.08);
      color: var(--gold);
      border-radius: 2px;
      border: 1px solid var(--gold-glow);
      letter-spacing: 0.16em;
    }

    /* === ARCO === */
    .arco-resumen {
      font-family: 'Spectral', Georgia, serif;
      font-style: italic;
      font-size: 13.5px;
      line-height: 1.65;
      color: var(--ink70);
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--rule);
    }
    .punto-clave {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 7px 0;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 13px;
      color: var(--ink70);
      border-bottom: 1px solid var(--rule);
      line-height: 1.6;
    }
    .punto-clave:last-child { border-bottom: none; }
    .punto-clave::before {
      content: '';
      width: 4px; height: 4px;
      background: var(--gold);
      transform: rotate(45deg);
      margin-top: 8px;
      flex-shrink: 0;
      opacity: 1;
    }

    /* === MENTAL === */
    .mental-item {
      padding: 7px 0;
      border-bottom: 1px solid var(--rule);
    }
    .mental-item:last-child { border-bottom: none; }
    .mental-label {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      margin-bottom: 4px;
      opacity: 1;
    }
    .mental-valor {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12.5px;
      color: var(--ink);
      line-height: 1.6;
    }

    /* === IDEALES === */
    .nivel-ideales-wrap {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid var(--rule);
    }
    .nivel-ideales-label {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      margin-bottom: 8px;
      opacity: 1;
    }
    .nivel-ideales-circulos {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .ideal-circulo {
      width: 16px; height: 16px;
      border-radius: 0;
      border: 1.5px solid rgba(201,168,76,0.3);
      background: transparent;
      transform: rotate(45deg);
      transition: all 0.3s ease;
    }
    .ideal-circulo.activo {
      background: var(--gold);
      border-color: var(--gold);
      box-shadow: 0 0 10px var(--gold-glow);
    }
    .nivel-ideales-texto {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      color: var(--ink50);
      letter-spacing: 0.12em;
      margin-left: 6px;
    }

    /* === STATS BAR === */
    .stats-bar {
      display: flex;
      gap: 28px;
      padding: 14px 20px;
      background: var(--bg-card);
      border: 1px solid var(--card-border);
      border-radius: 4px;
      margin: 0 40px 18px;
      flex-wrap: wrap;
    }
    .stat-item { text-align: left; }
    .stat-num {
      font-family: 'Spectral', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: var(--ink);
      display: block;
      line-height: 1;
    }
    .stat-label {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9px;
      color: var(--ink50);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      margin-top: 4px;
      opacity: 1;
    }

    /* === AFILIACIONES === */
    .afiliacion-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12.5px;
      border-bottom: 1px solid var(--rule);
      color: var(--ink);
    }
    .afiliacion-item:last-child { border-bottom: none; }
    .afiliacion-item::before {
      content: '';
      width: 4px; height: 4px;
      background: var(--gold);
      transform: rotate(45deg);
      flex-shrink: 0;
      opacity: 1;
      font-size: 0;
      color: transparent;
    }

    /* === SIN DATOS === */
    .sin-datos {
      font-family: 'Spectral', Georgia, serif;
      font-style: italic;
      font-size: 12.5px;
      color: var(--ink50);
      opacity: 1;
      padding: 4px 0;
    }

    /* === ERROR === */
    .error-ficha {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      gap: 12px;
      text-align: center;
      padding: 40px;
    }
    .error-ficha .error-icono {
      font-size: 32px;
      opacity: 0.6;
      color: var(--gold);
    }
    .error-ficha .error-titulo {
      font-family: 'Spectral', Georgia, serif;
      font-size: 18px;
      color: var(--ink);
      opacity: 1;
    }
    .error-ficha .error-desc {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 13px;
      color: var(--ink50);
      font-style: normal;
      opacity: 1;
    }

    /* === HISTORIAL === */
    .historial-barra {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 40px;
      margin: 16px 0 0;
      flex-wrap: wrap;
    }
    .historial-btn {
      padding: 4px 10px;
      background: transparent;
      border: 1px solid var(--rule);
      border-radius: 2px;
      color: var(--ink50);
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 1;
    }
    .historial-btn:hover {
      color: var(--ink);
      border-color: var(--gold-glow);
      background: rgba(255,255,255,0.025);
    }
    .historial-btn.actual {
      color: var(--gold);
      border-color: var(--gold-glow);
      background: rgba(201,168,76,0.06);
    }
    .historial-separador {
      color: var(--ink30);
      font-size: 10px;
      opacity: 1;
    }

    /* === TEXTO util === */
    .texto-normal {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12.5px;
      color: var(--ink);
      line-height: 1.55;
    }
    .texto-secundario {
      font-family: 'Spectral', Georgia, serif;
      font-style: italic;
      font-size: 12.5px;
      color: var(--ink70);
      line-height: 1.55;
    }
    .texto-nota {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12px;
      color: var(--ink50);
      font-style: italic;
      line-height: 1.55;
      margin-top: 6px;
      opacity: 1;
    }
    .subseccion-label {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      text-transform: uppercase;
      letter-spacing: 0.16em;
      margin-top: 10px;
      margin-bottom: 4px;
      opacity: 1;
    }

    /* === RECIPIENTES === */
    .recipiente-item {
      padding: 9px 0;
      border-bottom: 1px solid var(--rule);
    }
    .recipiente-item:last-child { border-bottom: none; }
    .recipiente-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 4px;
    }
    .recipiente-nombre {
      font-family: 'Spectral', Georgia, serif;
      font-size: 15px;
      font-weight: 600;
      color: var(--ink);
    }
    .recipiente-periodo {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      color: var(--ink50);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 4px;
      opacity: 1;
    }
    .recipiente-notas {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12px;
      color: var(--ink70);
      line-height: 1.55;
      font-style: normal;
      opacity: 1;
    }

    /* === RELACIONES ESQUIRLA === */
    .relacion-esquirla-item {
      padding: 7px 0;
      border-bottom: 1px solid var(--rule);
    }
    .relacion-esquirla-item:last-child { border-bottom: none; }
    .relacion-esquirla-nombre {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 3px;
      opacity: 1;
    }
    .relacion-esquirla-desc {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 12.5px;
      color: var(--ink);
      line-height: 1.55;
    }

    /* === CLICKABLE === */
    .clickable {
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: var(--gold-glow);
      text-underline-offset: 3px;
      transition: color 0.15s, text-decoration-color 0.15s;
    }
    .clickable:hover {
      color: var(--gold);
      text-decoration-color: var(--gold);
    }

    /* === BTN RELACIONES === */
    .btn-relaciones {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid var(--gold-glow);
      color: var(--gold);
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 8px 14px;
      border-radius: 2px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
      margin: 0 40px 22px;
    }
    .btn-relaciones:hover {
      background: rgba(201,168,76,0.08);
      border-color: var(--gold);
      box-shadow: 0 0 16px var(--gold-glow);
    }
    .btn-relaciones svg { width: 12px; height: 12px; opacity: 0.9; }

    /* === BTN VOLVER === */
    .btn-volver {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--rule);
      color: var(--ink70);
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 2px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-volver:hover {
      border-color: var(--gold-glow);
      color: var(--ink);
    }

    /* === GRAFO === */
    .grafo-panel { display: none; }
    .grafo-panel.visible { display: block; }
    .grafo-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .grafo-titulo-wrap { flex: 1; }
    .grafo-titulo {
      font-family: 'Spectral', Georgia, serif;
      font-size: 18px;
      font-weight: 500;
      color: var(--ink);
    }
    .grafo-titulo span { color: var(--gold); }
    .grafo-subtitle {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      color: var(--ink50);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-top: 4px;
      opacity: 1;
    }
    .grafo-filtros {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .grafo-filtro-btn {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9.5px;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1px solid var(--rule);
      background: transparent;
      color: var(--ink50);
      cursor: pointer;
      transition: 0.15s;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .grafo-filtro-btn:hover {
      border-color: rgba(255,255,255,0.25);
      color: var(--ink);
    }
    .grafo-filtro-btn.activo.todos { border-color: rgba(255,255,255,0.35); color: var(--ink); background: rgba(255,255,255,0.04); }
    .grafo-filtro-btn.activo.familia { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.07); }
    .grafo-filtro-btn.activo.amigos { border-color: var(--blue); color: var(--blue); background: rgba(90,163,212,0.07); }
    .grafo-filtro-btn.activo.enemigos { border-color: var(--red); color: var(--red); background: rgba(196,90,74,0.07); }

    .grafo-canvas {
      width: 100%;
      flex: 1;
      min-height: 320px;
      background:
        radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 60%),
        var(--bg-deep);
      border: 1px solid var(--rule);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    .grafo-canvas svg { width: 100%; height: 100%; }
    .grafo-stats {
      display: flex;
      gap: 24px;
      margin-top: 12px;
      padding: 12px 16px;
      background: var(--bg-card);
      border: 1px solid var(--card-border);
      border-radius: 4px;
      flex-wrap: wrap;
      align-items: center;
    }
    .grafo-stat-item { display: flex; flex-direction: column; gap: 2px; }
    .grafo-stat-num {
      font-family: 'Spectral', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: var(--ink);
      line-height: 1;
    }
    .grafo-stat-label {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 9px;
      color: var(--ink50);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      opacity: 1;
    }
    .grafo-leyenda {
      display: flex;
      gap: 16px;
      margin-left: auto;
      flex-wrap: wrap;
    }
    .grafo-leg {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      color: var(--ink50);
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .grafo-leg-line { width: 18px; height: 2px; border-radius: 0; }
    .grafo-leg-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.6);
    }
    .grafo-tooltip {
      position: absolute;
      background: rgba(5,8,17,0.97);
      border: 1px solid var(--gold-glow);
      border-radius: 6px;
      padding: 14px 16px;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 13px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.12s;
      max-width: 270px;
      z-index: 10;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
    }
    .grafo-tooltip h4 {
      font-family: 'Spectral', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--gold);
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .grafo-tooltip .gt-orden {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      color: var(--ink50);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 8px;
      opacity: 1;
    }
    .grafo-tooltip .gt-desc {
      font-family: 'Spectral', Georgia, serif;
      font-style: italic;
      font-size: 12.5px;
      color: var(--ink70);
      margin-bottom: 10px;
      line-height: 1.5;
      opacity: 1;
    }
    .grafo-tooltip .gt-conn { display: flex; flex-direction: column; gap: 5px; }
    .grafo-tooltip .gt-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
    .grafo-tooltip .gt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .grafo-tooltip .gt-val { color: var(--ink); }

    /* === RESPONSIVE === */
    @media (max-width: 768px) {
      header { padding: 0 16px; height: 48px; }
      h1 { font-size: 14px; }
      .subtitulo { display: none; }
      .header-der { display: none; }

      .contenedor {
        grid-template-columns: 1fr;
        height: calc(100vh - 48px);
        position: relative;
      }

      .panel-izq {
        position: absolute;
        inset: 0;
        height: 100%;
        border-right: none;
        z-index: 10;
        transition: transform 0.3s ease;
        transform: translateX(0);
        padding: 16px;
      }
      .panel-izq.oculto {
        transform: translateX(-100%);
        pointer-events: none;
      }

      .panel-der {
        position: absolute;
        inset: 0;
        height: 100%;
        z-index: 20;
        transition: transform 0.3s ease;
        transform: translateX(100%);
      }
      .panel-der.visible {
        transform: translateX(0);
      }

      .ficha-header {
        flex-direction: column;
        gap: 14px;
        padding: 16px 18px 14px;
      }
      .ficha-header::before {
        width: 260px; height: 260px;
        right: -70px; top: -60px;
      }
      .ficha-header::after { right: 60px; top: 76px; }
      .ficha-avatar,
      .ficha-avatar-deshecho,
      .ficha-avatar-heraldo,
      .av-especie-g {
        width: 52px; height: 52px;
        font-size: 22px;
      }
      .ficha-titulo h2 { font-size: 36px; }
      .ficha-titulo .nombre-completo { font-size: 14px; }
      .descripcion {
        font-size: 14px;
        padding: 0 0 0 14px;
        margin: 14px 18px;
      }
      .grid-secciones { columns: 1; padding: 0 18px; column-gap: 0; }
      .seccion-fullwidth { margin: 14px 18px; }
      .stats-bar { margin: 0 18px 14px; }
      .btn-relaciones { margin: 0 18px 18px; }
      .historial-barra { display: none; }
      .estado-vacio { display: none; }

      .tabs { gap: 3px; margin-bottom: 12px; }
      .tab { font-size: 9px; padding: 5px 3px; }

      .btn-volver {
        display: flex;
        width: 100%;
        padding: 12px 16px;
        margin: 0;
        border: none;
        border-bottom: 1px solid var(--rule);
        border-radius: 0;
        justify-content: flex-start;
        background: rgba(255,255,255,0.02);
      }
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>
</head>
<body>

  <header>
    <div class="header-izq">
      <h1 onclick="volverInicio()" style="cursor:pointer;transition:opacity 0.15s" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">La API de las Tormentas</h1>
      <span class="subtitulo">Un proyecto fan del Cosmere</span>
    </div>
    <div class="header-der">
      <a href="https://laapidelastormentas.onrender.com/api-docs" title="Documentación de la API">API Docs</a>
      <a href="#" onclick="abrirAcercaDe(); return false;" title="Acerca de este proyecto">Acerca de</a>
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
      return ''; // el fondo se pone con background-image en el contenedor
    }

    function avatarEspecie(orden, especie, size) {
      if (orden && ORDEN_SLUG[orden]) return null;
      if (!especie) return null;
      const e = especie.toLowerCase();
      const s = size || 32;
      const r = s <= 32 ? '6px' : '12px';
      const cls = s <= 32 ? 'av-especie-s' : 'av-especie-g';
      let url = null;
      if (e === 'humano') url = '/images/humano.png';
      else if (e.includes('cantor') || e.includes('pars')) url = '/images/parshmenios.png';
      if (!url) return null;
      return '<div class="' + cls + '" style="background-image:url(' + url + ')"></div>';
    }

    function logoSpren(tipo, size) {
      const s = size || 28;
      // Mapeo tipo de spren → orden radiante
      const tipoOrden = {
        'honorspren':     'Corredores del Viento',
        'críptico':       'Tejedores de Luz',
        'cultivacispren': 'Danzantes del Filo',
        'brumaspren':     'Vigilantes de la Verdad',
        'tintaspren':     'Nominadores de Lo Otro',
        'altospren':      'Rompedores del Cielo',
        'cenizaspren':    'Portadores del Polvo',
        'alcanzador':     'Escultores de Voluntad',
        'cumbrespren':    'Custodios de la Piedra',
        'lumispren':      'Forjadores de Vínculos',
      };
      const orden = tipoOrden[tipo];
      if (orden && ORDEN_SLUG[orden]) {
        const inner = Math.round(s * 0.92);
        return \`<img src="/images/ordenes/\${ORDEN_SLUG[orden]}.svg" width="\${inner}" height="\${inner}" style="filter:brightness(2.5) saturate(1.2);object-fit:contain;display:block" alt="\${orden}" />\`;
      }
      // Spren primigenios y sin orden conocida — emoji como fallback
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
          \${avatarEspecie(p.orden, p.especie, 32) || '<div class="item-avatar">' + logoOrden(p.orden, 28) + '</div>'}
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
          history.pushState({ tipo: 'personaje', id: id, historial: JSON.parse(JSON.stringify(historialNavegacion)) }, '', '?tipo=personaje&id=' + id);
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
            \${avatarEspecie(orden, p.especie, 72) || '<div class="ficha-avatar">' + logoOrden(orden, 72) + '</div>'}
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

          <button class="btn-relaciones" onclick="verRelaciones('\${p.id}','personaje')"><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='6' cy='6' r='2'/><circle cx='18' cy='18' r='2'/><circle cx='12' cy='18' r='2'/><line x1='8' y1='6' x2='16' y2='6'/><line x1='7' y1='8' x2='11' y2='16'/><line x1='17' y1='8' x2='13' y2='16'/></svg>Ver relaciones</button>

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
        seleccionado = null;
        historialNavegacion = [];
        document.querySelectorAll('.item-personaje').forEach(el => el.classList.remove('activo'));
        document.getElementById('panel-detalle').innerHTML = '';
        document.getElementById('estado-vacio').style.display = '';
        if (esMobil()) volverListaMovil();
        return;
      }
      if (state.historial) historialNavegacion = state.historial;
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
        renderListaDeshechos(todosDeshechos);
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
          history.pushState({ tipo: 'deshecho', id: id, historial: JSON.parse(JSON.stringify(historialNavegacion)) }, '', '?tipo=deshecho&id=' + id);
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
        renderListaEsquirlas(todosEsquirlas);
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
        const imgAvatar = '<img src="/images/' + e.id + '.png" style="width:100%;height:100%;object-fit:cover" alt="' + e.nombre + '"/>';
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
          history.pushState({ tipo: 'esquirla', id: id, historial: JSON.parse(JSON.stringify(historialNavegacion)) }, '', '?tipo=esquirla&id=' + id);
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
      const imgFicha = '<img src="/images/' + e.id + '.png" style="width:100%;height:100%;object-fit:cover" alt="' + e.nombre + '"/>';

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
        renderListaHeraldos(todosHeraldos);
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
          history.pushState({ tipo: 'heraldo', id: id, historial: JSON.parse(JSON.stringify(historialNavegacion)) }, '', '?tipo=heraldo&id=' + id);
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

          <button class="btn-relaciones" onclick="verRelaciones('\${h.id}','heraldo')"><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='6' cy='6' r='2'/><circle cx='18' cy='18' r='2'/><circle cx='12' cy='18' r='2'/><line x1='8' y1='6' x2='16' y2='6'/><line x1='7' y1='8' x2='11' y2='16'/><line x1='17' y1='8' x2='13' y2='16'/></svg>Ver relaciones</button>

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
        renderListaSpren(todosSpren);
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
          history.pushState({ tipo: 'spren', id: id, historial: JSON.parse(JSON.stringify(historialNavegacion)) }, '', '?tipo=spren&id=' + id);
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

          <button class="btn-relaciones" onclick="verRelaciones('\${s.id}','spren')"><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='6' cy='6' r='2'/><circle cx='18' cy='18' r='2'/><circle cx='12' cy='18' r='2'/><line x1='8' y1='6' x2='16' y2='6'/><line x1='7' y1='8' x2='11' y2='16'/><line x1='17' y1='8' x2='13' y2='16'/></svg>Ver relaciones</button>

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

          <div class="seccion" class="seccion-fullwidth">
            <div class="seccion-titulo">Historia</div>
            \${histHtml}
          </div>

        </div>
      \`;
    }

    // Filtro tipo spren
    document.getElementById('filtro-tipo').addEventListener('change', () => renderListaSpren(todosSpren));

    // ── Acerca de ─────────────────────────────────────────────
    function abrirAcercaDe() {
      document.getElementById('acerca-overlay').classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
    function cerrarAcercaDe() {
      document.getElementById('acerca-overlay').classList.remove('visible');
      document.body.style.overflow = '';
    }

    // ── Ver relaciones (grafo) ─────────────────────────────
    // Estado del grafo activo
    const grafoState = {
      id: null, tipo: null, sim: null,
      linkSel: null, nodeSel: null, filtro: 'todos',
      fichaEl: null, panelEl: null,
    };

    function verRelaciones(id, tipo) {
      const panel = document.getElementById('panel-detalle');
      const ficha = panel.querySelector('.ficha');
      if (!ficha) return;

      // Siempre crear panel nuevo (el anterior se eliminó al cerrar)
      const grafoPanel = document.createElement('div');
      grafoPanel.className = 'grafo-panel';
      if (true) {
        grafoPanel.innerHTML =
          '<div class="grafo-header">' +
            '<button class="btn-volver" onclick="cerrarGrafo()">← Ficha</button>' +
            '<div class="grafo-titulo-wrap">' +
              '<div class="grafo-titulo">Red de <span id="grafo-nombre"></span></div>' +
              '<div class="grafo-subtitle">Conexiones directas · 1 salto</div>' +
            '</div>' +
          '</div>' +
          '<div class="grafo-filtros">' +
            '<button class="grafo-filtro-btn todos activo" onclick="grafoFiltrar(&apos;todos&apos;,this)">Todos</button>' +
            '<button class="grafo-filtro-btn familia"  onclick="grafoFiltrar(&apos;familia&apos;,this)">Familia</button>' +
            '<button class="grafo-filtro-btn amigos"   onclick="grafoFiltrar(&apos;amigos&apos;,this)">Amigos</button>' +
            '<button class="grafo-filtro-btn enemigos" onclick="grafoFiltrar(&apos;enemigos&apos;,this)">Enemigos</button>' +
          '</div>' +
          '<div class="grafo-canvas" id="grafo-canvas-inner"><svg id="grafo-svg-inner"></svg><div class="grafo-tooltip" id="grafo-tooltip"></div></div>' +
          '<div class="grafo-stats">' +
            '<div class="grafo-stat-item"><span class="grafo-stat-num" id="gstat-nodos">-</span><span class="grafo-stat-label">Total</span></div>' +
            '<div class="grafo-stat-item"><span class="grafo-stat-num" style="color:#c9a84c" id="gstat-familia">-</span><span class="grafo-stat-label">Familia</span></div>' +
            '<div class="grafo-stat-item"><span class="grafo-stat-num" style="color:#4a9eca" id="gstat-amigos">-</span><span class="grafo-stat-label">Amigos</span></div>' +
            '<div class="grafo-stat-item"><span class="grafo-stat-num" style="color:#e05c5c" id="gstat-enemigos">-</span><span class="grafo-stat-label">Enemigos</span></div>' +
            '<div class="grafo-leyenda">' +
              '<div class="grafo-leg"><div class="grafo-leg-line" style="background:#c9a84c"></div>Familia</div>' +
              '<div class="grafo-leg"><div class="grafo-leg-line" style="background:#4a9eca"></div>Amigos</div>' +
              '<div class="grafo-leg"><div class="grafo-leg-line" style="background:#e05c5c;height:2px;border-top:2px dashed #e05c5c;background:none"></div>Enemigos</div>' +
              '<div class="grafo-leg"><div class="grafo-leg-dot" style="background:#c9a84c"></div>Origen</div>' +
            '</div>' +
          '</div>';
        panel.appendChild(grafoPanel);
      }  // end if(true)

      grafoState.id      = id;
      grafoState.tipo    = tipo;
      grafoState.fichaEl = ficha;
      grafoState.panelEl = grafoPanel;
      grafoState.filtro  = 'todos';

      // Resetear filtros UI
      grafoPanel.querySelectorAll('.grafo-filtro-btn').forEach(b => b.classList.remove('activo'));
      grafoPanel.querySelector('.grafo-filtro-btn.todos').classList.add('activo');

      // La ficha NO se oculta — el grafo flota encima como overlay
      grafoPanel.classList.add('visible');

      // Limpiar SVG anterior
      const svgEl = document.getElementById('grafo-svg-inner');
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
      if (grafoState.sim) { grafoState.sim.stop(); grafoState.sim = null; }

      fetch(API + '/grafo/' + id)
        .then(r => r.json())
        .then(data => {
          // Esperar a que el navegador calcule el layout flex antes de leer dimensiones
          requestAnimationFrame(() => buildGrafoD3(data, id));
        })
        .catch(() => {
          grafoPanel.querySelector('.grafo-canvas').innerHTML =
            '<p style="color:var(--gris-plata);padding:2rem;text-align:center">Error al cargar el grafo</p>';
        });
    }

    function cerrarGrafo() {
      if (!grafoState.panelEl) return;
      // Eliminar el overlay — la ficha ya es visible debajo
      grafoState.panelEl.remove();
      grafoState.panelEl = null;
      if (grafoState.sim) { grafoState.sim.stop(); grafoState.sim = null; }
    }

    function buildGrafoD3(data, raizId) {
      const nodos   = data.nodos;
      const aristas = data.aristas;

      const nombre = nodos.find(n => n.id === raizId)?.nombre || raizId;
      document.getElementById('grafo-nombre').textContent = nombre;

      // Solo aristas directas del nodo raíz (lo que corresponde a la ficha)
      const directas = aristas.filter(a => a.origen === raizId || a.destino === raizId);
      const cFam = directas.filter(a => a.tipo === 'familia').length;
      const cAmi = directas.filter(a => a.tipo === 'amigos').length;
      const cEne = directas.filter(a => a.tipo === 'enemigos').length;
      document.getElementById('gstat-nodos').textContent   = directas.length;
      document.getElementById('gstat-familia').textContent  = cFam;
      document.getElementById('gstat-amigos').textContent   = cAmi;
      document.getElementById('gstat-enemigos').textContent = cEne;

      const COLOR_ORDEN = {
        'Corredores del Viento':   '#4a9eca',
        'Tejedores de Luz':        '#b07cd4',
        'Forjadores de Vinculos':  '#e8a44a',
        'Forjadores de Vínculos': '#e8a44a',
        'Rompedores del Cielo':    '#ea6060',
        'Vigilantes de la Verdad': '#a0c44a',
        'Escultores de Voluntad':  '#e86e30',
        'Nominadores de Lo Otro':  '#4acea0',
        'Danzantes del Filo':      '#e0b44a',
        'Ninguna':                 '#566478',
        'honorspren':              '#4a9eca',
        'cryptico':                '#b07cd4',
        'cultivacispren':          '#4acea0',
        'alcanzador':              '#e8a44a',
        'spren primigenio':        '#c9a84c',
      };

      const canvas  = document.getElementById('grafo-canvas-inner');
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      const svgSel = d3.select('#grafo-svg-inner');
      const defs   = svgSel.append('defs');

      // Filtro glow
      const fGlow = defs.append('filter').attr('id','g-glow').attr('x','-80%').attr('y','-80%').attr('width','260%').attr('height','260%');
      fGlow.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','3').attr('result','blur');
      const fM = fGlow.append('feMerge');
      fM.append('feMergeNode').attr('in','blur');
      fM.append('feMergeNode').attr('in','SourceGraphic');

      // Fondo radial
      const rg = defs.append('radialGradient').attr('id','g-bg').attr('cx','50%').attr('cy','50%').attr('r','50%');
      rg.append('stop').attr('offset','0%').attr('stop-color','#c9a84c').attr('stop-opacity','0.04');
      rg.append('stop').attr('offset','100%').attr('stop-color','#080c14').attr('stop-opacity','0');
      svgSel.append('rect').attr('width','100%').attr('height','100%').attr('fill','url(#g-bg)');

      const g    = svgSel.append('g');
      const zoom = d3.zoom().scaleExtent([0.2, 4]).on('zoom', e => g.attr('transform', e.transform));
      svgSel.call(zoom);

      const links = aristas.map(a => ({...a, source: a.origen, target: a.destino}));

      const sim = d3.forceSimulation(nodos)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.tipo === 'familia' ? 85 : 115).strength(0.7))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(W/2, H/2))
        .force('collision', d3.forceCollide().radius(d => (d.id === raizId ? 22 : 12) + 8));

      grafoState.sim    = sim;
      grafoState.aristas = aristas;

      const colorArista = { familia: '#c9a84c', amigos: '#4a9eca', enemigos: '#e05c5c' };

      const linkSel = g.append('g').selectAll('line')
        .data(links).enter().append('line')
        .attr('stroke', d => colorArista[d.tipo] || '#4a5568')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', d => d.origen === raizId || d.destino === raizId ? 2 : 1.2)
        .attr('stroke-dasharray', d => d.tipo === 'enemigos' ? '4,3' : null);

      grafoState.linkSel = linkSel;

      const nodeSel = g.append('g').selectAll('.gn')
        .data(nodos).enter().append('g').attr('class','gn')
        .call(d3.drag()
          .on('start', (e,d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx=e.x; d.fy=e.y; })
          .on('drag',  (e,d) => { d.fx=e.x; d.fy=e.y; })
          .on('end',   (e,d) => { if (!e.active) sim.alphaTarget(0); d.fx=null; d.fy=null; })
        );

      grafoState.nodeSel = nodeSel;

      // Halo nodo raíz
      nodeSel.filter(d => d.id === raizId).append('circle')
        .attr('r', 28).attr('fill','none')
        .attr('stroke','#c9a84c').attr('stroke-width',1).attr('stroke-opacity',0.2)
        .attr('filter','url(#g-glow)');

      const r = d => d.id === raizId ? 18 : Math.min(6 + (d.grado || 0) * 0.8, 13);

      nodeSel.append('circle')
        .attr('r', r)
        .attr('fill', d => COLOR_ORDEN[d.orden] || '#566478')
        .attr('fill-opacity', d => d.id === raizId ? 1 : 0.8)
        .attr('stroke', d => d.id === raizId ? '#c9a84c' : (COLOR_ORDEN[d.orden] || '#566478'))
        .attr('stroke-width', d => d.id === raizId ? 2.5 : 1.5)
        .attr('stroke-opacity', d => d.id === raizId ? 1 : 0.4)
        .attr('filter', d => d.id === raizId ? 'url(#g-glow)' : null)
        .style('cursor', d => d.id === raizId ? 'default' : 'pointer');

      nodeSel.append('text')
        .text(d => d.nombre)
        .attr('dy', d => r(d) + 12)
        .attr('text-anchor','middle')
        .attr('font-size', d => d.id === raizId ? '12px' : '10px')
        .attr('font-weight', d => d.id === raizId ? '600' : 'normal')
        .attr('fill', d => d.id === raizId ? '#c9a84c' : '#f0ece8')
        .attr('opacity', d => d.id === raizId ? 1 : 0.75)
        .style('pointer-events','none')
        .style('text-shadow','0 1px 4px #080c14');

      const tooltip = document.getElementById('grafo-tooltip');

      nodeSel.on('mouseover', (event, d) => {
        const conn    = aristas.filter(a => a.origen === d.id || a.destino === d.id);
        const fam     = conn.filter(a => a.tipo === 'familia').length;
        const ami     = conn.filter(a => a.tipo === 'amigos').length;
        const ene     = conn.filter(a => a.tipo === 'enemigos').length;
        const desc    = conn.find(a => a.origen === raizId || a.destino === raizId)?.descripcion || '';

        tooltip.innerHTML =
          '<h4>' + d.nombre + '</h4>' +
          '<div class="gt-orden">' + (d.orden || d.tipo || '') + '</div>' +
          (desc ? '<div class="gt-desc">' + desc + '</div>' : '') +
          '<div class="gt-conn">' +
          (fam ? '<div class="gt-row"><div class="gt-dot" style="background:#c9a84c"></div><span class="gt-val">' + fam + ' familia</span></div>' : '') +
          (ami ? '<div class="gt-row"><div class="gt-dot" style="background:#4a9eca"></div><span class="gt-val">' + ami + ' amigos</span></div>' : '') +
          (ene ? '<div class="gt-row"><div class="gt-dot" style="background:#e05c5c"></div><span class="gt-val">' + ene + ' enemigos</span></div>' : '') +
          '</div>';

        tooltip.style.opacity = '1';
        tooltip.style.left    = (event.offsetX + 16) + 'px';
        tooltip.style.top     = (event.offsetY - 10) + 'px';

        linkSel.attr('stroke-opacity', a => (a.origen === d.id || a.destino === d.id) ? 1 : 0.04)
               .attr('stroke-width',   a => (a.origen === d.id || a.destino === d.id) ? 2.5 : 0.8);
        nodeSel.select('circle').attr('fill-opacity', n => {
          const c = aristas.some(a => (a.origen === d.id && a.destino === n.id) || (a.destino === d.id && a.origen === n.id));
          return n.id === d.id || c ? 1 : 0.1;
        }).attr('stroke-opacity', n => {
          const c = aristas.some(a => (a.origen === d.id && a.destino === n.id) || (a.destino === d.id && a.origen === n.id));
          return n.id === d.id || c ? 1 : 0.1;
        });
        nodeSel.select('text').attr('opacity', n => {
          const c = aristas.some(a => (a.origen === d.id && a.destino === n.id) || (a.destino === d.id && a.origen === n.id));
          return n.id === d.id || c ? 1 : 0.15;
        });
      }).on('mousemove', event => {
        tooltip.style.left = (event.offsetX + 16) + 'px';
        tooltip.style.top  = (event.offsetY - 10) + 'px';
      }).on('mouseout', () => {
        tooltip.style.opacity = '0';
        grafoAplicarFiltro();
      }).on('click', (event, d) => {
        // No navegar al hacer click en el nodo raíz
        if (d.id === raizId) return;
        // Cerrar el grafo y abrir la ficha correspondiente según el tipo de entidad
        cerrarGrafo();
        if (d.tipo === 'heraldo')   { cambiarTab('heraldos');   verHeraldo(d.id); }
        else if (d.tipo === 'spren'){ cambiarTab('spren');       verSpren(d.id); }
        else                        { cambiarTab('personajes');  verPersonaje(d.id); }
      });

      sim.on('tick', () => {
        linkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
               .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        nodeSel.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
      });
    }

    function grafoAplicarFiltro() {
      const f = grafoState.filtro;
      if (!grafoState.linkSel || !grafoState.nodeSel) return;

      const raizId  = grafoState.id;
      const aristas = grafoState.aristas || [];

      // IDs de nodos que tienen al menos una arista del tipo filtrado con el raíz
      const nodosVisibles = new Set([raizId]);
      if (f === 'todos') {
        aristas.forEach(a => { nodosVisibles.add(a.origen); nodosVisibles.add(a.destino); });
      } else {
        aristas
          .filter(a => a.tipo === f && (a.origen === raizId || a.destino === raizId))
          .forEach(a => { nodosVisibles.add(a.origen); nodosVisibles.add(a.destino); });
      }

      // Aristas visibles: solo si ambos extremos están en nodosVisibles Y son del tipo filtrado
      grafoState.linkSel
        .style('display', d => {
          if (!nodosVisibles.has(d.origen) || !nodosVisibles.has(d.destino)) return 'none';
          if (f !== 'todos' && d.tipo !== f) return 'none';
          return null;
        })
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', d => (d.origen === raizId || d.destino === raizId) ? 2 : 1.2);

      // Nodos: visibles u ocultos según si tienen conexión del tipo filtrado
      grafoState.nodeSel
        .style('display', d => nodosVisibles.has(d.id) ? null : 'none');

      grafoState.nodeSel.select('circle')
        .attr('fill-opacity', d => d.id === raizId ? 1 : 0.8)
        .attr('stroke-opacity', d => d.id === raizId ? 1 : 0.4);

      grafoState.nodeSel.select('text')
        .attr('opacity', d => d.id === raizId ? 1 : 0.75);
    }

    function grafoFiltrar(tipo, btn) {
      grafoState.filtro = tipo;
      document.querySelectorAll('.grafo-filtro-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      grafoAplicarFiltro();
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') cerrarAcercaDe();
    });
  </script>

  <!-- Overlay Acerca de -->
  <div class="acerca-overlay" id="acerca-overlay" onclick="if(event.target===this)cerrarAcercaDe()">
    <div class="acerca-panel">
      <button class="acerca-cerrar" onclick="cerrarAcercaDe()">✕</button>

      <div style="text-align:center; margin-bottom:1.5rem;">
        <h2 style="font-family:'Cinzel Decorative',serif; font-size:1.2rem; color:var(--dorado); letter-spacing:0.1em; margin-bottom:0.4rem;">La API de las Tormentas</h2>
        <p style="color:var(--gris-plata); font-style:italic; font-size:0.9rem;">Un proyecto fan del Cosmere</p>
      </div>

      <div class="acerca-seccion">
        <div class="acerca-seccion-titulo">¿Qué es esto?</div>
        <p>Una API REST de acceso libre dedicada al universo de <strong>El Archivo de las Tormentas</strong> de Brandon Sanderson. Cubre personajes, spren, heraldos, Deshechos y Esquirlas con búsqueda avanzada, filtros y este explorador visual.</p>
      </div>

      <div class="acerca-seccion">
        <div class="acerca-seccion-titulo">Autor</div>
        <p>Proyecto creado y mantenido por <strong style="color:var(--celeste-luz);">Are112</strong>.</p>
      </div>

      <div class="acerca-seccion">
        <div class="acerca-seccion-titulo">Agradecimientos</div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div style="display:flex; gap:0.75rem; align-items:flex-start;">
            <div>
              <p style="font-weight:600; margin-bottom:0.2rem;">Brandon Sanderson</p>
              <p style="font-size:0.88rem; opacity:0.7;">Por crear el universo de El Archivo de las Tormentas y la riqueza de su mundo, personajes y sistema de magia.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.75rem; align-items:flex-start;">
            <div>
              <p style="font-weight:600; margin-bottom:0.2rem;">La Coppermind Wiki</p>
              <p style="font-size:0.88rem; opacity:0.7;">Fuente de referencia canónica para todos los datos. Un trabajo enciclopédico extraordinario mantenido por la comunidad.</p>
              <a href="https://es.coppermind.net/" target="_blank" style="font-size:0.82rem;">coppermind.net →</a>
            </div>
          </div>
        </div>
      </div>

      <div class="acerca-seccion">
        <div class="acerca-seccion-titulo">Licencia</div>
        <p><strong>Datos (JSON)</strong> — <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank">CC BY 4.0</a>. Libres para usar, compartir y adaptar citando la fuente.</p>
        <p style="margin-top:0.5rem;"><strong>Código fuente</strong> — MIT. Libre para usar y modificar.</p>
      </div>

      <div class="acerca-aviso">
        <p>El universo, personajes y elementos narrativos de El Archivo de las Tormentas son propiedad intelectual de <strong style="color:var(--blanco-perla);">Brandon Sanderson</strong> y Dragonsteel Entertainment. Este es un proyecto fan sin ánimo de lucro, no afiliado ni respaldado oficialmente.</p>
      </div>

      <div style="text-align:center; padding-top:0.5rem;">
        <a href="/api-docs" style="font-size:0.8rem; color:var(--celeste-luz); text-decoration:none; letter-spacing:0.08em; text-transform:uppercase; opacity:0.7;">API Docs →</a>
      </div>
    </div>
  </div>

</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
