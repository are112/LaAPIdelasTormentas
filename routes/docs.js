import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Endpoint que devuelve el spec OpenAPI como JSON
router.get("/openapi.json", (req, res) => {
  try {
    // Convertimos el YAML a JSON en tiempo de ejecución
    // Para evitar dependencias externas, servimos el YAML directamente
    const yamlPath = path.join(__dirname, "..", "openapi.yaml");
    const content = fs.readFileSync(yamlPath, "utf8");
    res.setHeader("Content-Type", "text/yaml");
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: "No se pudo cargar la especificación OpenAPI" });
  }
});

// Endpoint que sirve la UI de Swagger vía CDN
router.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>La API de las Tormentas — Documentación</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; }
    .topbar { display: none !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: "${baseUrl}/api-docs/openapi.json",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout",
        deepLinking: true,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 2,
      });
    };
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
