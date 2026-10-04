# Historial de versiones

Cada versión corresponde a una etiqueta en GitHub. Los arreglos que no cambian la API suben el último número (2.3.1); las novedades en la API suben el del medio (2.4.0).

## 2.3.6

Segunda ronda con las skills mobile-native, emil-design-eng, apple-design y break-ui.

- Grafo en pantallas táctiles: el primer toque en un nodo muestra su información y resalta sus conexiones; el segundo abre la ficha. Tocar fuera cierra la información.
- Grafo: se encuadra solo al abrirse, para que todos los nodos queden a la vista (en móvil, la red de Kaladin dejaba 77 de 113 nodos fuera). No amplía los grafos pequeños y respeta la vista si el usuario la mueve.
- Grafo: un clic ya no hace temblar la red; la simulación solo se reactiva al arrastrar un nodo. El tooltip desaparece al instante.
- Teclado: la lista, los nodos del grafo y los nombres enlazados se pueden recorrer con Tab y abrir con Enter, con un contorno dorado en el elemento con foco.
- Móvil: respuesta visual al tocar un elemento de la lista, el scroll no arrastra la página, mantener pulsado un control no selecciona su texto y el teclado ajusta el área visible.
- Detalles: cifras de ancho fijo en el contador y en los números del grafo, nombres de dos líneas equilibrados y descripciones sin palabras sueltas.

## 2.3.5

- Explorador: un solo buscador. Al escribir, la lista de la izquierda muestra los resultados de todo el universo (personajes, spren, heraldos, Deshechos y esquirlas) con su etiqueta, en lugar de un desplegable encima de la lista filtrada.
- Resultados ordenados por relevancia y sin distinguir acentos ("sonando" encuentra "Soñando-aunque-Despierta").
- Teclado: flechas para moverse, Enter para abrir y Escape para vaciar.
- Al abrir un resultado se vacía la búsqueda, se pasa a su pestaña y se abre la ficha (antes la lista se quedaba filtrada a un solo nombre).
- Corregido: la lista de esquirlas no se actualizaba al escribir.

## 2.3.4

Revisión del explorador con las skills review-animations, emil-design-eng, mobile-native y break-ui.

- Sin emojis en la interfaz: la lupa del buscador, el icono de error y la marca de los spren sin orden pasan a ser iconos dibujados; fuera los símbolos de las etiquetas de habilidades.
- Lista y tooltip del grafo: bajo el nombre aparece la orden si es Radiante y, si no, la especie (antes "Ninguna"). Los nombres largos muestran el nombre completo al pasar el ratón.
- Desplegable de órdenes: las diez órdenes primero y después "Ninguna" y "Desconocida".
- Grafo: mensaje "Sin relaciones registradas" en las fichas sin relaciones; singular y plural correctos en el tooltip ("1 amigo", "2 amigos").
- Animaciones: transiciones solo de las propiedades que cambian, la ficha aparece en 180 ms, la lista no se desplaza al pasar el ratón y los botones responden al pulsar.
- Movimiento reducido: si el sistema lo pide, se quitan los desplazamientos y el grafo aparece ya colocado.
- Móvil: el efecto hover solo se aplica con ratón, sin destello al tocar, sin zoom al tocar el buscador o el filtro, altura con `dvh` y color de la barra del sistema.

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
