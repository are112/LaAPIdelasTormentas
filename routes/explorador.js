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
      grid-template-columns: 300px 1fr;
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
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.18);
      color: var(--blanco-perla);
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
    .filtro-select option { background: #0d1f3c; }

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
    .lista-scroll::-webkit-scrollbar { width: 4px; }
    .lista-scroll::-webkit-scrollbar-track { background: transparent; }
    .lista-scroll::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }

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
      background: rgba(79,195,247,0.06);
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
      background: rgba(79,195,247,0.06);
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
      background: rgba(255,255,255,0.07);
      border-color: rgba(255,255,255,0.1);
      box-shadow: inset 3px 0 0 rgba(255,255,255,0.35);
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
    /* Avatar deshecho — gradiente rojo oscuro */
    .item-avatar-deshecho {
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem;
      background: radial-gradient(circle, rgba(192,57,43,0.35), rgba(80,10,10,0.6));
      border: 1px solid rgba(192,57,43,0.4);
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
      padding: 2rem;
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
    /* Avatar ficha deshecho */
    .ficha-avatar-deshecho {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle at 40% 35%, rgba(192,57,43,0.4), rgba(60,5,5,0.8));
      border: 2px solid rgba(192,57,43,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem;
      flex-shrink: 0;
      box-shadow: 0 0 20px rgba(192,57,43,0.2);
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
      font-size: clamp(1.4rem, 3vw, 2rem);
      color: var(--blanco-perla);
      margin-bottom: 0.3rem;
      line-height: 1.2;
    }
    .ficha-titulo .nombre-completo {
      font-size: 0.9rem;
      color: var(--gris-plata);
      font-style: italic;
      margin-bottom: 0.5rem;
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
    .badge-deshecho { background: rgba(192,57,43,0.1);    color: #c0614f;  border: 1px solid rgba(192,57,43,0.2); }

    /* Descripción */
    .descripcion {
      background: transparent;
      border-left: 2px solid rgba(255,255,255,0.15);
      padding: 0.75rem 1.25rem;
      font-style: italic;
      font-size: 1.05rem;
      color: var(--gris-plata);
      margin-bottom: 1.75rem;
      line-height: 1.7;
    }

    /* Grid de secciones */
    .grid-secciones {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .seccion {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 7px;
      padding: 1.25rem;
      transition: border-color 0.2s;
    }
    .seccion:hover { border-color: rgba(255,255,255,0.13); }
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
    .punto-clave::before { content: '–'; color: var(--gris-plata); flex-shrink: 0; opacity: 0.5; }

    /* Estado mental */
    .mental-item { margin-bottom: 0.75rem; }
    .mental-label {
      font-size: 0.75rem;
      color: var(--gris-plata);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.2rem;
    }
    .mental-valor { font-size: 0.9rem; color: var(--blanco-perla); line-height: 1.5; }

    /* Nivel ideal — círculos */
    .nivel-ideales-wrap { margin-top: 0.75rem; }
    .nivel-ideales-label {
      font-size: 0.75rem;
      color: var(--gris-plata);
      text-transform: uppercase;
      letter-spacing: 0.08em;
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

    /* Afiliaciones */
    .afiliacion-item {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.3rem 0;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .afiliacion-item::before { content: '–'; font-size: 0.8rem; color: var(--gris-plata); opacity: 0.4; }

    /* Sin datos */
    .sin-datos {
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
      background: rgba(79,195,247,0.06);
      border: 1px solid rgba(79,195,247,0.18);
      border-radius: 4px;
      color: var(--gris-plata);
      font-family: 'Crimson Pro', serif;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .historial-btn:hover {
      background: rgba(79,195,247,0.12);
      color: var(--blanco-perla);
      border-color: rgba(79,195,247,0.35);
    }
    .historial-btn.actual {
      color: var(--celeste-luz);
      border-color: rgba(79,195,247,0.4);
      background: rgba(79,195,247,0.1);
    }
    .historial-separador {
      color: var(--gris-plata);
      font-size: 0.7rem;
      opacity: 0.5;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .contenedor { grid-template-columns: 1fr; }
      .panel-izq {
        border-right: none;
        border-bottom: 1px solid rgba(79,195,247,0.15);
        height: 45vh;
      }
      .lista-scroll { max-height: 160px; }
      .ficha-header { flex-direction: column; }
      .grid-secciones { grid-template-columns: 1fr; }
      .historial-barra { display: none; }
    }
  </style>
</head>
<body>

  <header>
    <div class="header-izq">
      <h1>La API de las Tormentas</h1>
      <span class="subtitulo">Un proyecto fan del Cosmere</span>
    </div>
    <div class="header-der">
      <a href="/docs" title="Documentación de la API">API Docs</a>
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
    </aside>

    <!-- Panel derecho -->
    <main class="panel-der" id="panel-detalle"></main>

    <!-- Estado vacío: fuera del panel, centrado en toda la ventana -->
    <div class="estado-vacio" id="estado-vacio">
      <p>Selecciona un elemento para explorar su ficha</p>
    </div>
  </div>

  <script>
    const API = '';
    let todos         = [];
    let todosHeraldos = [];
    let todosSpren    = [];
    let todosDeshechos= [];
    let filtrados     = [];
    let seleccionado  = null;

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
            const accion = { personaje: verPersonaje, spren: verSpren, heraldo: verHeraldo, deshecho: verDeshecho };
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
          <div class="item-avatar">\${logoOrden(p.orden)}</div>
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
        const p = await detRes.value.json();
        const rel = relRes.status === 'fulfilled' && relRes.value.ok
          ? (await relRes.value.json())
          : null;

        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = renderFicha(p, rel);
        if (!desdeHistorial) agregarHistorial('personaje', id, p.nombre);
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        panel.innerHTML = '<p class="sin-datos">Error cargando el personaje</p>';
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

      // Relaciones
      let relHtml = '<p class="sin-datos">Sin relaciones registradas</p>';
      if (rel?.relaciones) {
        const iconos = { familia: '👪', amigos: '🤝', enemigos: '⚔' };
        relHtml = Object.entries(rel.relaciones).map(([tipo, items]) => \`
          <div class="relacion-grupo">
            <div class="relacion-grupo-titulo">\${iconos[tipo] || '•'} \${tipo}</div>
            \${items.map(r => {
              const personajeRef = todos.find(px => px.id === r.personaje);
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
            <div class="ficha-avatar">\${logoOrden(orden, 60)}</div>
            <div class="ficha-titulo">
              <h2>\${p.nombre}</h2>
              \${p.nombre_completo && p.nombre_completo !== p.nombre
                ? \`<div class="nombre-completo">\${p.nombre_completo}</div>\` : ''}
              \${apodos.length
                ? \`<div class="nombre-completo" style="color:var(--gris-plata)">"<em>\${apodos.join('", "')}</em>"</div>\`
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
                    if (!raw || raw.trim() === '') return '<em style="color:var(--gris-plata);font-style:italic">Desconocido</em>';
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
              <div class="seccion-titulo">Relaciones</div>
              \${relHtml}
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

          <div class="seccion" style="margin-bottom:2rem">
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
      };
      const badgeText = { personaje: 'Personaje', spren: 'Spren', heraldo: 'Heraldo', deshecho: 'Deshecho' };

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
      if (!img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = '/images/heraldos/' + id + '.jpg';
      } else {
        img.parentElement.innerHTML = '&#128081;';
      }
    }

    cargarLista();
    cargarSpren();
    cargarHeraldos();
    cargarDeshechos();

    // ── Tabs ───────────────────────────────────────────────
    let tabActual = 'personajes';

    function cambiarTab(tab) {
      tabActual = tab;
      ['personajes','spren','deshechos','heraldos'].forEach(t => {
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
        tab === 'deshechos'  ? 'Deshechos'  : 'Heraldos';

      // BUG CORREGIDO: cada tab re-aplica sus propios filtros respetando
      // el texto del buscador en lugar de pasar la lista completa.
      if      (tab === 'personajes') aplicarFiltros();
      else if (tab === 'spren')      renderListaSpren(todosSpren);
      else if (tab === 'deshechos')  renderListaDeshechos(todosDeshechos);
      else                           renderListaHeraldos(todosHeraldos);
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
            <div class="item-avatar-deshecho">👁</div>
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
        const d = await res.json();
        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = renderFichaDeshecho(d);
        if (!desdeHistorial) agregarHistorial('deshecho', id, d.nombre);
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        panel.innerHTML = '<p class="sin-datos">Error cargando el deshecho</p>';
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
            <div class="ficha-avatar-deshecho">👁</div>
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

          \${d.notas ? \`
            <div class="seccion" style="margin-bottom:2rem">
              <div class="seccion-titulo">Notas</div>
              <p style="font-size:0.85rem;color:var(--gris-plata);font-style:italic">\${d.notas}</p>
            </div>
          \` : ''}
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
        const h = await res.json();
        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = renderFichaHeraldo(h);
        if (!desdeHistorial) agregarHistorial('heraldo', id, h.nombre);
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        panel.innerHTML = '<p class="sin-datos">Error cargando el heraldo</p>';
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
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">Otros títulos</div>
                <div class="tags">\${herald.otros_titulos.map(t => \`<span class="tag">\${t}</span>\`).join('')}</div>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Apariencia</div>
              \${h.apariencia?.fisica
                ? \`<p style="font-size:0.9rem;color:var(--blanco-perla);margin-bottom:0.5rem">\${h.apariencia.fisica}</p>\`
                : ''}
              \${h.apariencia?.voz
                ? \`<div class="campo"><span class="campo-label">Voz</span><span class="campo-valor">\${h.apariencia.voz}</span></div>\`
                : ''}
              \${h.apariencia?.apariencia_como_mendigo ? \`
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.25rem">Como mendigo</div>
                <p style="font-size:0.85rem;color:var(--gris-plata);font-style:italic">\${h.apariencia.apariencia_como_mendigo}</p>
              \` : ''}
            </div>

            <div class="seccion">
              <div class="seccion-titulo">Personalidad</div>
              \${rasgosHtml}
              \${h.personalidad?.evolucion
                ? \`<p style="font-size:0.85rem;color:var(--gris-plata);margin-top:0.5rem;font-style:italic">\${h.personalidad.evolucion}</p>\`
                : ''}
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
        const s = await res.json();
        document.getElementById('estado-vacio').style.display = 'none';
        panel.innerHTML = renderFichaSpren(s);
        if (!desdeHistorial) agregarHistorial('spren', id, s.nombre);
        renderHistorial();
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        panel.innerHTML = '<p class="sin-datos">Error cargando el spren</p>';
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
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">Potencias</div>
                <div class="tags">\${vinculo.potencias_otorgadas.map(p => \`<span class="tag">⚡ \${p}</span>\`).join('')}</div>
              \` : ''}
              \${vinculo.notas ? \`<p style="font-size:0.85rem;color:var(--gris-plata);margin-top:0.5rem;font-style:italic">\${vinculo.notas}</p>\` : ''}
            </div>
            \` : ''}

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

            <div class="seccion">
              <div class="seccion-titulo">Personalidad</div>
              \${rasgosHtml}
              \${personalidad?.notas ? \`<p style="font-size:0.85rem;color:var(--gris-plata);margin-top:0.5rem;font-style:italic">\${personalidad.notas}</p>\` : ''}
            </div>

            \${habilidades ? \`
            <div class="seccion">
              <div class="seccion-titulo">Habilidades</div>
              \${(habilidades.generales ?? []).length ? \`
                <div class="tags">\${habilidades.generales.map(h => \`<span class="tag">✦ \${h}</span>\`).join('')}</div>
              \` : ''}
              \${(habilidades.magicas ?? []).length ? \`
                <div class="campo-label" style="margin-top:0.5rem;margin-bottom:0.3rem">Mágicas</div>
                <div class="tags">\${habilidades.magicas.map(h => \`<span class="tag">⚡ \${h}</span>\`).join('')}</div>
              \` : ''}
            </div>
            \` : ''}

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

    // Filtro tipo spren
    document.getElementById('filtro-tipo').addEventListener('change', () => renderListaSpren(todosSpren));
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
