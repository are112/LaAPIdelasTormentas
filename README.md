# ⚡ La API de las Tormentas

API REST sobre el universo literario de **El Archivo de las Tormentas** de Brandon Sanderson. Cubre personajes, órdenes de Caballeros Radiantes, spren y heraldos con búsqueda avanzada, filtros, paginación y un explorador visual interactivo.

Construida con **Node.js** (ESModules) y **Express 5**.

---

## Acceso

La API está disponible públicamente sin necesidad de instalación ni autenticación.

| Recurso | URL |
|---|---|
| Explorador visual | `https://laapidelastormentas.onrender.com/explorador` |
| Documentación Swagger | `https://laapidelastormentas.onrender.com/api-docs` |
| Base URL | `https://laapidelastormentas.onrender.com` |

---

## Estructura del proyecto

```
LaAPIdelasTormentas/
├── index.js
├── package.json
├── openapi.yaml
├── routes/
│   ├── explorador.js         # Interfaz visual interactiva
│   ├── personajes.js
│   ├── ordenes.js
│   ├── spren.js
│   ├── heraldos.js
│   ├── relaciones.js
│   ├── buscar.js
│   ├── stats.js
│   └── docs.js
├── controllers/
│   ├── personajesController.js
│   ├── ordenesController.js
│   ├── sprenController.js
│   ├── heraldosController.js
│   ├── relacionesController.js
│   ├── buscarController.js
│   └── statsController.js
├── utils/
│   ├── loadCharacter.js      # Caché de personajes individuales
│   ├── loadList.js           # Caché del índice de personajes
│   ├── loadOrdenes.js        # Caché del catálogo de órdenes
│   ├── loadSpren.js
│   ├── loadSprenList.js
│   ├── loadHeraldo.js
│   └── loadHeraldosList.js
├── data/
│   ├── personajes.json       # Índice resumido (40 personajes)
│   ├── ordenes.json          # Catálogo estático de las 10 órdenes
│   ├── spren.json            # Índice de spren (40 entradas)
│   ├── heraldos.json         # Índice de heraldos (10 entradas)
│   ├── personajes/           # JSON completo por personaje
│   ├── spren/                # JSON completo por spren
│   └── heraldos/             # JSON completo por heraldo
└── public/
    └── images/
        ├── ordenes/          # SVGs de los glifos de cada orden
        └── heraldos/         # Imágenes de los Diez Heraldos
```

Todos los datos se cargan en memoria al arrancar. Las peticiones no tocan disco.

---

## Endpoints

### Explorador

#### `GET /explorador`
Interfaz visual interactiva para navegar por personajes, spren y heraldos. Incluye buscador con autocompletado, filtros por orden y fichas detalladas con relaciones, habilidades y arco narrativo.

---

### Personajes

#### `GET /personajes`
Lista resumida de todos los personajes.

```json
[
  {
    "id": "kaladin",
    "nombre": "Kaladin",
    "orden": "Corredores del Viento",
    "nivel_ideal": 5,
    "estado_actual": "vivo"
  }
]
```

#### `GET /personajes/:id`
Perfil completo de un personaje.

#### `GET /personajes/:id/resumen`
Solo los campos del índice (`id`, `nombre`, `orden`, `nivel_ideal`, `estado_actual`).

#### `GET /personajes/:id/completo`
Resumen e índice fusionados en un único objeto.

#### `GET /personajes/:id/:seccion`
Una sección concreta del perfil. Secciones disponibles:

`orden_radiantes` · `habilidades` · `relaciones` · `estado_mental` · `arco_narrativo` · `situacion_actual` · `apariciones` · `afiliaciones` · `identidades`

```bash
GET /personajes/kaladin/habilidades
GET /personajes/shallan/estado_mental
```

#### `GET /personajes/:id/relaciones`
Todas las relaciones del personaje (familia, amigos, enemigos).

#### `GET /personajes/:id/relaciones/:tipo`
Un tipo concreto de relación. Valores válidos: `familia` · `amigos` · `enemigos`.

```bash
GET /personajes/dalinar/relaciones/familia
```

---

### Órdenes

#### `GET /ordenes`
Lista las 10 órdenes de Caballeros Radiantes con sus datos canónicos y número de miembros.

```json
{
  "total_ordenes": 10,
  "ordenes": [
    {
      "id": "corredores-del-viento",
      "nombre": "Corredores del Viento",
      "herald": "Jezrien",
      "virtud": "Protección / Liderazgo",
      "potencias": ["Gravitación", "Adhesión"],
      "spren_tipico": "Honorspren",
      "imagen": "/images/ordenes/corredores-del-viento.svg",
      "total_personajes": 9
    }
  ]
}
```

#### `GET /ordenes/:nombre`
Detalle completo de una orden: datos canónicos (herald, virtud, defecto, descripción) y lista de todos sus miembros con nivel del Ideal, spren asociado y estado del vínculo. Se puede usar el nombre completo o el slug.

```bash
GET /ordenes/Corredores+del+Viento
GET /ordenes/corredores-del-viento
```

---

### Spren

#### `GET /spren`
Lista resumida de todos los spren.

#### `GET /spren/:id`
Perfil completo de un spren.

#### `GET /spren/:id/:seccion`
Sección concreta del perfil de un spren.

---

### Heraldos

#### `GET /heraldos`
Lista de los Diez Heraldos del Todopoderoso.

#### `GET /heraldos/:id`
Perfil completo de un heraldo.

#### `GET /heraldos/:id/:seccion`
Sección concreta del perfil de un heraldo.

---

### Búsqueda

#### `GET /buscar`
Búsqueda avanzada sobre **personajes, heraldos y spren** con filtros combinables, ordenación, paginación y selección de campos.

**Parámetros:**

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `tipo` | Filtra por tipo de entidad | `?tipo=personaje` · `?tipo=heraldo` · `?tipo=spren` |
| `id` | ID exacto | `?id=kaladin` |
| `especie` | Especie | `?especie=cantor` |
| `sexo` | Sexo | `?sexo=femenino` |
| `nacionalidad` | Nacionalidad | `?nacionalidad=alezi` |
| `origen` | Lugar de origen | `?origen=Piedralar` |
| `estado_actual` | Estado vital | `?estado_actual=vivo` · `?estado_actual=fallecido` |
| `afiliacion` | Afiliación exacta | `?afiliacion=Puente+Cuatro` |
| `orden` | Orden radiante | `?orden=Tejedores+de+Luz` |
| `nivel_ideal` | Nivel del Ideal; soporta `>=`, `<=`, `>`, `<` | `?nivel_ideal=>=3` |
| `libro` | Título del libro en que aparece | `?libro=Juramentada` |
| `texto` | Búsqueda libre en todo el perfil | `?texto=depresión` |
| `sort` | Campo de ordenación; prefijo `-` para descendente | `?sort=-nivel_ideal` |
| `page` | Página (empieza en 1) | `?page=2` |
| `limit` | Resultados por página | `?limit=5` |
| `fields` | Campos a devolver, separados por coma | `?fields=nombre,orden_radiantes.orden` |

Todos los parámetros son combinables. También se puede filtrar por cualquier campo anidado usando notación de punto:

```bash
GET /buscar?orden_radiantes.spren_asociado.principal=Sylphrena
GET /buscar?habilidades.magia.potencias=Gravitación
GET /buscar?situacion_actual.rol=sanador
```

Cada resultado incluye un campo `_tipo` (`"personaje"`, `"heraldo"` o `"spren"`) para identificar de qué entidad se trata.

**Respuesta:**

```json
{
  "total": 9,
  "pagina": 1,
  "limite": 10,
  "resultados": [
    { "_tipo": "personaje", "id": "kaladin", "..." : "..." }
  ]
}
```

**Ejemplos:**

```bash
# Corredores del Viento con nivel_ideal >= 3, ordenados de mayor a menor
GET /buscar?orden=Corredores+del+Viento&nivel_ideal=>=3&sort=-nivel_ideal

# Solo heraldos
GET /buscar?tipo=heraldo

# Personajes fallecidos, solo nombre y estado
GET /buscar?estado_actual=fallecido&fields=nombre,estado_actual

# Búsqueda libre en personajes
GET /buscar?texto=Shadesmar&tipo=personaje
```

---

### Stats

#### `GET /stats`
Estadísticas agregadas sobre todos los personajes.

```json
{
  "personajes": 40,
  "heraldos": 10,
  "spren": 40,
  "vivos": 28,
  "fallecidos": 10,
  "sin_estado": 2,
  "caballeros_radiantes": 22,
  "no_radiantes": 18,
  "por_orden": { "Corredores del Viento": 9 },
  "por_especie": { "humano": 35, "cantor": 5 },
  "por_sexo": { "masculino": 22, "femenino": 18 },
  "por_nacionalidad": { "alezi": 20 },
  "nivel_ideal_promedio": 2.85,
  "libros": { "El Camino de los Reyes": 15 }
}
```

---

## Estructura de datos

### Índice de personaje (`personajes.json`)

```json
{
  "id": "kaladin",
  "nombre": "Kaladin",
  "orden": "Corredores del Viento",
  "nivel_ideal": 5,
  "estado_actual": "vivo"
}
```

### Perfil completo de personaje

```json
{
  "id": "kaladin",
  "nombre": "Kaladin",
  "nombre_completo": "Kaladin hijo de Lirin",
  "apodos": ["Kal", "Kaladin Bendito por la Tormenta"],
  "sexo": "masculino",
  "especie": "humano",
  "nacionalidad": "alezi",
  "origen": "Piedralar",
  "planeta_natal": "Roshar",
  "estado_actual": "vivo",
  "apariciones": {
    "libros": [
      { "titulo": "El Camino de los Reyes", "rol": "protagonista", "pov": true }
    ]
  },
  "afiliaciones": ["Puente Cuatro", "Corredores del Viento"],
  "orden_radiantes": {
    "orden": "Corredores del Viento",
    "nivel_ideal": 5,
    "spren_asociado": { "principal": "Sylphrena" },
    "estado_del_vinculo": "activo"
  },
  "habilidades": {
    "magia": {
      "potencias": ["Gravitación", "Adhesión"],
      "fuente_de_luz": "luz tormentosa"
    },
    "no_magicas": ["combate con lanza", "cirugía básica", "liderazgo"]
  },
  "identidades": {
    "principales": ["Corredor del Viento", "Capitán del Puente Cuatro"],
    "descripcion": "...",
    "estado_en_viento_y_verdad": "..."
  },
  "relaciones": {
    "familia":  [{ "personaje": "lirin",  "relacion": "padre" }],
    "amigos":   [{ "personaje": "teft",   "relacion": "amigo" }],
    "enemigos": [{ "personaje": "moash",  "relacion": "enemigo" }]
  },
  "estado_mental": {
    "diagnostico_general": "trastorno depresivo mayor recurrente",
    "evolucion": "mejora progresiva con recaídas",
    "situacion_en_viento_y_verdad": "..."
  },
  "arco_narrativo": {
    "resumen": "...",
    "puntos_clave": ["..."]
  },
  "situacion_actual": {
    "ocupacion": "Corredor del Viento del Quinto Ideal",
    "rol": "...",
    "relacion_con_spren": "...",
    "otros_detalles": "..."
  },
  "descripcion_breve": "...",
  "notas": "..."
}
```

Las plantillas de personaje, spren y heraldo están disponibles en `data/personajes/00Plantilla.json`, `data/spren/00Plantilla.json` y `data/heraldos/00Plantilla.json`.

---

## Valores estandarizados

### `estado_actual`
`"vivo"` · `"viva"` · `"fallecido"` · `"fallecida"`

### `rol` en apariciones
`"protagonista"` · `"principal"` · `"secundario importante"` · `"secundario"` · `"menor"`

### `especie`
`"humano"` · `"cantor"` · `"retornado"`

---

## Tecnologías

- [Node.js](https://nodejs.org/) — ESModules
- [Express 5](https://expressjs.com/)

---

## Autor

Proyecto creado y mantenido por **Are112**.

---

## Agradecimientos

Este proyecto no existiría sin:

- **Brandon Sanderson** — por crear el universo de El Archivo de las Tormentas y la riqueza de su mundo, personajes y magia.
- **La Coppermind Wiki** — fuente de referencia canónica para todos los datos del proyecto. Un trabajo enciclopédico extraordinario mantenido por la comunidad. → [coppermind.net](https://coppermind.net)

---

## Licencia

Los **datos** de este proyecto (archivos JSON en `/data`) se distribuyen bajo licencia **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

Eres libre de:
- **Compartir** — copiar y redistribuir los datos en cualquier formato
- **Adaptar** — transformarlos y construir sobre ellos para cualquier propósito, incluso comercial

Siempre que:
- **Atribuyas** la autoría a Are112 y menciones este proyecto como fuente

El **código fuente** (Node.js / Express) se distribuye bajo licencia **MIT**.

→ [Más información sobre CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es)
