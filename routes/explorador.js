import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Explorador de Personajes</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0a1628;
      color: #e8f4fd;
      margin: 0;
      padding: 0;
    }
    header {
      padding: 1.5rem;
      text-align: center;
      background: #0d1f3c;
    }
    h1 {
      margin: 0;
      color: #4fc3f7;
    }
    .contenedor {
      display: flex;
      height: calc(100vh - 80px);
    }
    .panel-izq {
      width: 300px;
      padding: 1rem;
      border-right: 1px solid rgba(255,255,255,0.1);
      overflow-y: auto;
    }
    .panel-der {
      flex: 1;
      padding: 2rem;
    }
    .item-personaje {
      padding: 0.6rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 0.4rem;
      background: rgba(255,255,255,0.04);
    }
    .item-personaje:hover {
      background: rgba(79,195,247,0.15);
    }
    .item-nombre {
      font-weight: bold;
    }
    .item-orden {
      font-size: 0.85rem;
      opacity: 0.7;
    }
    .sin-datos {
      opacity: 0.6;
      font-style: italic;
    }
    input, select {
      width: 100%;
      margin-bottom: 0.5rem;
      padding: 0.4rem;
    }
  </style>
</head>
<body>

<header>
  <h1>La API de las Tormentas</h1>
</header>

<div class="contenedor">
  <aside class="panel-izq">
    <input type="text" id="buscador" placeholder="Buscar personaje..." />
    <select id="filtro-orden">
      <option value="">Todas las órdenes</option>
    </select>
    <p>Total: <span id="contador">0</span></p>
    <div id="lista-personajes"></div>
  </aside>

  <main class="panel-der" id="panel-detalle">
    <p class="sin-datos">Selecciona un personaje</p>
  </main>
</div>

<script>
  const API = "${baseUrl}";
  let todos = [];

  async function cargarLista() {
    try {
      const res = await fetch(API + "/personajes");
      const json = await res.json();
      todos = json;
      poblarFiltro();
      renderLista(todos);
    } catch (e) {
      document.getElementById("lista-personajes").innerHTML =
        "<p class='sin-datos'>Error cargando personajes</p>";
    }
  }

  function poblarFiltro() {
    const sel = document.getElementById("filtro-orden");
    const ordenes = [...new Set(
      todos.map(p => p.orden).filter(o => o && o !== "Ninguna")
    )].sort();

    ordenes.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o;
      sel.appendChild(opt);
    });
  }

  function renderLista(lista) {
    const wrap = document.getElementById("lista-personajes");
    document.getElementById("contador").textContent = lista.length;

    if (!lista.length) {
      wrap.innerHTML = "<p class='sin-datos'>Sin resultados</p>";
      return;
    }

    wrap.innerHTML = lista.map(p =>
      "<div class='item-personaje' onclick=\\"verPersonaje('" + p.id + "')\\">" +
        "<div class='item-nombre'>" + p.nombre + "</div>" +
        "<div class='item-orden'>" + (p.orden || "Sin orden") + "</div>" +
      "</div>"
    ).join("");
  }

  function aplicarFiltros() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const orden = document.getElementById("filtro-orden").value;

    const filtrados = todos.filter(p => {
      const matchTexto = !texto || p.nombre.toLowerCase().includes(texto);
      const matchOrden = !orden || p.orden === orden;
      return matchTexto && matchOrden;
    });

    renderLista(filtrados);
  }

  async function verPersonaje(id) {
    const panel = document.getElementById("panel-detalle");
    panel.innerHTML = "<p class='sin-datos'>Cargando...</p>";

    try {
      const res = await fetch(API + "/personajes/" + id);
      const p = await res.json();
      panel.innerHTML =
        "<h2>" + p.nombre + "</h2>" +
        "<p><strong>Orden:</strong> " + (p.orden || "Sin orden") + "</p>" +
        "<p><strong>Nivel ideal:</strong> " + (p.nivel_ideal ?? "—") + "</p>";
    } catch {
      panel.innerHTML = "<p class='sin-datos'>Error cargando personaje</p>";
    }
  }

  document.getElementById("buscador").addEventListener("input", aplicarFiltros);
  document.getElementById("filtro-orden").addEventListener("change", aplicarFiltros);

  cargarLista();
</script>

</body>
</html>
`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
