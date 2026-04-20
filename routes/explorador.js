import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");

  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Explorador de Personajes</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #0a1628;
      color: #e8f4fd;
    }
    header {
      background: #0d1f3c;
      padding: 1rem;
      text-align: center;
    }
    h1 {
      margin: 0;
      color: #4fc3f7;
    }
    .contenedor {
      display: flex;
      height: calc(100vh - 70px);
    }
    .panel-izq {
      width: 300px;
      padding: 1rem;
      border-right: 1px solid rgba(255,255,255,0.15);
      overflow-y: auto;
    }
    .panel-der {
      flex: 1;
      padding: 2rem;
    }
    input, select {
      width: 100%;
      margin-bottom: 0.5rem;
      padding: 0.4rem;
    }
    .item {
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 0.4rem;
      cursor: pointer;
      background: rgba(255,255,255,0.05);
    }
    .item:hover {
      background: rgba(79,195,247,0.25);
    }
    .orden {
      font-size: 0.8rem;
      opacity: 0.7;
    }
    .vacio {
      opacity: 0.6;
      font-style: italic;
    }
  </style>
</head>
<body>

<header>
  <h1>La API de las Tormentas</h1>
</header>

<div class="contenedor">
  <aside class="panel-izq">
    <input id="buscador" placeholder="Buscar personaje…" />
    <select id="filtro-orden">
      <option value="">Todas las órdenes</option>
    </select>
    <p>Total: <span id="contador">0</span></p>
    <div id="lista"></div>
  </aside>

  <main class="panel-der" id="detalle">
    <p class="vacio">Selecciona un personaje</p>
  </main>
</div>

<script>
  const API = "${baseUrl}";
  let personajes = [];

  async function cargarPersonajes() {
    try {
      const res = await fetch(API + "/personajes");
      personajes = await res.json();
      poblarFiltro();
      renderLista(personajes);
    } catch (e) {
      document.getElementById("lista").innerHTML =
        "<p class='vacio'>Error cargando personajes</p>";
    }
  }

  function poblarFiltro() {
    const select = document.getElementById("filtro-orden");
    const ordenes = [...new Set(
      personajes.map(p => p.orden).filter(o => o && o !== "Ninguna")
    )].sort();

    ordenes.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o;
      select.appendChild(opt);
    });
  }

  function renderLista(lista) {
    const cont = document.getElementById("lista");
    document.getElementById("contador").textContent = lista.length;

    if (!lista.length) {
      cont.innerHTML = "<p class='vacio'>Sin resultados</p>";
      return;
    }

    cont.innerHTML = lista.map(p =>
      "<div class='item' onclick=\"verDetalle('" + p.id + "')\">" +
        "<strong>" + p.nombre + "</strong>" +
        "<div class='orden'>" + (p.orden || "Sin orden") + "</div>" +
      "</div>"
    ).join("");
  }

  function aplicarFiltros() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const orden = document.getElementById("filtro-orden").value;

    const filtrados = personajes.filter(p => {
      const okTexto = !texto || p.nombre.toLowerCase().includes(texto);
      const okOrden = !orden || p.orden === orden;
      return okTexto && okOrden;
    });

    renderLista(filtrados);
  }

  async function verDetalle(id) {
    const panel = document.getElementById("detalle");
    panel.innerHTML = "<p class='vacio'>Cargando…</p>";

    try {
      const res = await fetch(API + "/personajes/" + id);
      const p = await res.json();

      panel.innerHTML =
        "<h2>" + p.nombre + "</h2>" +
        "<p><strong>Orden:</strong> " + (p.orden || "Sin orden") + "</p>" +
        "<p><strong>Nivel ideal:</strong> " +
          (p.nivel_ideal === null ? "—" : p.nivel_ideal) +
        "</p>";
    } catch {
      panel.innerHTML = "<p class='vacio'>Error cargando personaje</p>";
    }
  }

  document.getElementById("buscador").addEventListener("input", aplicarFiltros);
  document.getElementById("filtro-orden").addEventListener("change", aplicarFiltros);

  cargarPersonajes();
</script>

</body>
</html>`);
});

export default router;
