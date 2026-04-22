# ⚡ La API de las Tormentas

API REST sobre el universo literario de **El Archivo de las Tormentas** de Brandon Sanderson. Cubre personajes, órdenes de Caballeros Radiantes, spren y heraldos con búsqueda avanzada, filtros y paginación.

Construida con **Node.js** (ESModules) y **Express 5**.

---

## Instalación

```bash
npm install
npm start
```

El servidor arranca en el puerto `3000` por defecto. Se puede cambiar con la variable de entorno `PORT`.

La documentación interactiva (Swagger UI) está disponible en:

```
http://localhost:3000/api-docs
```

---

## Estructura del proyecto

```
LaAPIdelasTormentas/
├── index.js
├── package.json
├── openapi.yaml
├── routes/
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
│   ├── personajes.json       # Índice resumido (36 personajes)
│   ├── ordenes.json          # Catálogo estático de las 10 órdenes
│   ├── spren.json            # Índice de spren (40 entradas)
│   ├── heraldos.json         # Índice de heraldos (10 entradas)
│   ├── personajes/           # JSON completo por personaje
│   ├── spren/                # JSON completo por spren
│   └── heraldos/             # JSON completo por heraldo
└── public/
    └── images/ordenes/       # SVGs de los glifos de cada orden
```

Todos los datos se cargan en memoria al arrancar. Las peticiones no tocan disco.

---

## Endpoints

### Estado

#### `GET /`
Redirige al explorador visual.

---

### Personajes

#### `GET /personajes`
Lista resumida de todos los personajes.

```json
[
  { "id": "kaladin", "nombre": "Kaladin", "orden": "Corredores del Viento", "nivel_ideal": 4 }
]
```

#### `GET /personajes/:id`
Perfil completo de un personaje.

#### `GET /personajes/:id/resumen`
Solo los campos del índice (id, nombre, orden, nivel_ideal).

#### `GET /personajes/:id/completo`
Resumen e índice fusionados en un único objeto.

#### `GET /personajes/:id/:seccion`
Una sección concreta del perfil. Secciones disponibles:

`orden_radiantes` · `habilidades` · `relaciones` · `estado_mental` · `arco_narrativo` · `situacion_actual` · `apariciones` · `afiliaciones`

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
Detalle completo de una orden: datos canónicos (herald, virtud, defecto, descripción) y lista de todos sus miembros con nivel del Ideal, spren asociado y estado del vínculo. Se puede usar el nombre completo o el slug (`corredores-del-viento`).

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
Lista de los 10 Heraldos de Vorinismo.

#### `GET /heraldos/:id`
Perfil completo de un heraldo.

#### `GET /heraldos/:id/:seccion`
Sección concreta del perfil de un heraldo.

---

### Búsqueda

#### `GET /buscar`
Búsqueda avanzada sobre todos los personajes con filtros combinables, ordenación, paginación y selección de campos.

**Parámetros:**

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `id` | ID exacto | `?id=kaladin` |
| `especie` | Especie | `?especie=cantor` |
| `sexo` | Sexo | `?sexo=femenino` |
| `nacionalidad` | Nacionalidad | `?nacionalidad=alezi` |
| `origen` | Lugar de origen | `?origen=Piedralar` |
| `estado_actual` | `vivo` o `muerto` | `?estado_actual=vivo` |
| `afiliacion` | Afiliación exacta | `?afiliacion=Puente+Cuatro` |
| `orden` | Orden radiante | `?orden=Tejedores+de+Luz` |
| `nivel_ideal` | Nivel del Ideal; soporta `>=`, `<=`, `>`, `<` | `?nivel_ideal=>=3` |
| `libro` | Título de libro | `?libro=Juramentada` |
| `texto` | Búsqueda libre en todo el perfil | `?texto=depresión` |
| `sort` | Campo de ordenación; prefijo `-` para descendente | `?sort=-nivel_ideal` |
| `page` | Página (empieza en 1) | `?page=2` |
| `limit` | Resultados por página | `?limit=5` |
| `fields` | Campos a devolver, separados por coma | `?fields=nombre,orden_radiantes.orden` |

Todos los parámetros son combinables. También se puede filtrar por cualquier campo anidado usando notación de punto como nombre del parámetro:

```bash
GET /buscar?orden_radiantes.spren_asociado.principal=Sylphrena
GET /buscar?habilidades.magia.potencias=Gravitación
GET /buscar?situacion_actual.rol=sanador
```

**Respuesta:**

```json
{
  "total": 9,
  "pagina": 1,
  "limite": 10,
  "resultados": [ ... ]
}
```

**Ejemplos:**

```bash
# Corredores del Viento con nivel_ideal >= 3, ordenados de mayor a menor
GET /buscar?orden=Corredores+del+Viento&nivel_ideal=>=3&sort=-nivel_ideal

# Personajes femeninos vivos, solo nombre y orden
GET /buscar?sexo=femenino&estado_actual=vivo&fields=nombre,orden_radiantes.orden

# Segunda página de resultados, 5 por página
GET /buscar?page=2&limit=5
```

---

### Stats

#### `GET /stats`
Estadísticas agregadas de todos los personajes: totales por orden, especie, sexo, nacionalidad, estado vital, libros en los que aparecen y nivel del Ideal promedio.

---

## Estructura de datos

### Personaje

```json
{
  "id": "kaladin",
  "nombre": "Kaladin",
  "nombre_completo": "Kaladin hijo de Lirin",
  "apodos": ["Kal"],
  "sexo": "masculino",
  "especie": "humano",
  "nacionalidad": "Alezi",
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
    "nivel_ideal": 4,
    "spren_asociado": { "principal": "Sylphrena" },
    "estado_del_vinculo": "estable"
  },
  "habilidades": {
    "magia": {
      "potencias": ["Gravitación", "Adhesión"],
      "fuente_de_luz": "Luz tormentosa"
    },
    "no_magicas": ["cirugía básica", "liderazgo"]
  },
  "relaciones": {
    "familia": [{ "personaje": "lirin", "relacion": "padre" }],
    "amigos":  [{ "personaje": "teft",  "relacion": "amigo" }],
    "enemigos": [{ "personaje": "moash", "relacion": "enemigo" }]
  },
  "estado_mental": {
    "diagnostico_general": "trastorno depresivo recurrente",
    "evolucion": "mejora progresiva con recaídas",
    "situacion_en_viento_y_verdad": "..."
  },
  "arco_narrativo": {
    "resumen": "...",
    "puntos_clave": ["..."]
  },
  "situacion_actual": {
    "ocupacion": "sanador",
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

## Tecnologías

- [Node.js](https://nodejs.org/) — ESModules
- [Express 5](https://expressjs.com/)

---

## Licencia

GPL-3.0 — ver [LICENSE](./LICENSE).
