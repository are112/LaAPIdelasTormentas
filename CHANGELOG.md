# Historial de versiones

Cada versión corresponde a una etiqueta en GitHub. Los arreglos que no cambian la API suben el último número (2.3.1); las novedades en la API suben el del medio (2.4.0).

## 2.3.3

- Explorador: el grafo ya no se corta por abajo cuando se llega a la ficha navegando (la barra de historial empujaba los números y la leyenda fuera de la pantalla).
- Explorador: si se elige otro personaje con el grafo abierto, la ficha nueva vuelve a tener scroll. El modo grafo ya no depende de una clase que podía quedarse puesta.

## 2.3.2

- `/buscar` devuelve `400` si `tipo` no existe o si `page` o `limit` no son enteros mayores que 0 (antes devolvía resultados extraños sin avisar).
- Los errores 404 tienen la misma forma en toda la API: mensaje, `id` (o `nombre` en órdenes) y una sugerencia. Corregida la concordancia ("Esquirla no encontrada").
- Eliminado `routes/ORIexplorador.js`, una copia de seguridad que no se usaba.
- Explorador: limpieza de código sin cambios visibles.

## 2.3.1

- Documentación al día: el README y el OpenAPI recogen el grafo, el validador y los cambios de las versiones 2.1 a 2.3.
- Nuevo CHANGELOG.

## 2.3.0

- Orden: nuevo valor `Desconocida` para quien no se sabe si es Radiante. No cuenta como Radiante en `/stats`.
- Los portadores shin de Hojas de Honor pasan a orden `Ninguna`, con la Hoja anotada en `notas`.
- Yanagawn y Hmask: `Injuramentados` pasa de orden a afiliación.
- Badali: Custodios de la Piedra (antes "Pilares de la Tierra").
- Ulim se traslada de personajes a spren: ahora está en `/spren/ulim`.
- `spren.json` incluye composicion, cusicesh, xorm, yixli y ulim.
- El índice de personajes queda sincronizado con las fichas.
- Nuevo `npm run validar` para comprobar los datos antes de subir.

## 2.2.0

- El grafo incluye las relaciones de spren y heraldos.
- Nuevos tipos de arista: `vinculo` (vínculo Nahel) y `otros`. Una sola arista por pareja.
- Las referencias por nombre o apodo se resuelven a su ID.
- `/grafo/comunidades` detecta comunidades reales y excluye los nodos aislados. Cambia el formato de la respuesta.
- Explorador: filtros, colores y conteos para vínculo y otros.

## 2.1.0

- Explorador: deja de hacer una petición por cada spren al cargar, lo que lo bloqueaba por el límite de peticiones.
- `/spren` incluye `orden_radiante` en el listado.
- `/buscar`: los operadores `>=` y `<=` de `nivel_ideal` funcionan, los niveles vacíos ya no cuentan como 0 y los valores no válidos devuelven `400`.

## 2.0.0

- Estado de partida, etiquetado antes de los arreglos de la auditoría.
