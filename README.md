# La API de las Tormentas

[![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-5-blue)](https://expressjs.com/)
[![Licencia datos](https://img.shields.io/badge/datos-CC%20BY%204.0-lightgrey)](https://creativecommons.org/licenses/by/4.0/deed.es)
[![Licencia código](https://img.shields.io/badge/código-MIT-lightgrey)](./LICENSE)

API REST de acceso libre sobre el universo de **El Archivo de las Tormentas** de Brandon Sanderson. Cubre personajes, spren, heraldos, Deshechos y Esquirlas con búsqueda avanzada, filtros, paginación y explorador visual interactivo.

---

## Acceso rápido

| Recurso | URL |
|---|---|
| Explorador visual | https://laapidelastormentas.onrender.com/explorador |
| Documentación | https://laapidelastormentas.onrender.com/api-docs |
| Base URL | https://laapidelastormentas.onrender.com |

No requiere autenticación ni registro.

---

## Endpoints

### `/personajes`

```
GET /personajes                        Lista resumida de todos los personajes
GET /personajes/:id                    Perfil completo
GET /personajes/:id/resumen            Solo campos del índice
GET /personajes/:id/completo           Resumen + perfil fusionados
GET /personajes/:id/:seccion           Sección concreta del perfil
GET /personajes/:id/relaciones         Todas las relaciones
GET /personajes/:id/relaciones/:tipo   Un tipo de relación (familia · amigos · enemigos)
```

Secciones disponibles: `orden_radiantes` · `habilidades` · `relaciones` · `estado_mental` · `arco_narrativo` · `situacion_actual` · `apariciones` · `afiliaciones` · `identidades`

### `/heraldos`

```
GET /heraldos              Lista de los Diez Heraldos
GET /heraldos/:id          Perfil completo
GET /heraldos/:id/:seccion Sección concreta
```

### `/spren`

```
GET /spren              Lista de spren
GET /spren/:id          Perfil completo
GET /spren/:id/:seccion Sección concreta
```

### `/ordenes`

```
GET /ordenes          Las 10 órdenes de Caballeros Radiantes con número de miembros
GET /ordenes/:nombre  Detalle de una orden y lista de sus miembros
```

Acepta nombre completo o slug: `Corredores+del+Viento` · `corredores-del-viento`

### `/buscar`

Búsqueda avanzada sobre personajes, heraldos y spren con filtros combinables.

```bash
GET /buscar?orden=Corredores+del+Viento&nivel_ideal=>=3&sort=-nivel_ideal
GET /buscar?tipo=heraldo
GET /buscar?estado_actual=fallecido&fields=nombre,estado_actual
GET /buscar?texto=Shadesmar&tipo=personaje
GET /buscar?orden_radiantes.spren_asociado.principal=Sylphrena
```

**Parámetros**

| Parámetro | Descripción |
|---|---|
| `tipo` | `personaje` · `heraldo` · `spren` |
| `id` | ID exacto |
| `especie` | Especie del personaje |
| `sexo` | `masculino` · `femenino` |
| `nacionalidad` | Nacionalidad |
| `origen` | Lugar de origen |
| `estado_actual` | `vivo` · `viva` · `fallecido` · `fallecida` |
| `afiliacion` | Afiliación exacta |
| `orden` | Orden de Caballeros Radiantes |
| `nivel_ideal` | Soporta operadores: `>=3` · `<=2` · `>1` · `<4` |
| `libro` | Título del libro en que aparece |
| `texto` | Búsqueda libre en todo el perfil |
| `sort` | Campo de ordenación; prefijo `-` para descendente |
| `page` | Página, empieza en 1 |
| `limit` | Resultados por página |
| `fields` | Campos a devolver, separados por coma. Admite notación de punto |

Cualquier campo anidado es filtrable con notación de punto: `?habilidades.magia.potencias=Gravitación`

**Respuesta**

```json
{
  "total": 9,
  "pagina": 1,
  "limite": 10,
  "resultados": [
    { "_tipo": "personaje", "id": "kaladin" }
  ]
}
```

### `/stats`

```
GET /stats    Estadísticas agregadas: totales, distribución por orden, especie, sexo y libro
```

### `/explorador`

```
GET /explorador    Interfaz visual con buscador, filtros y fichas detalladas
```

---

## Estructura del proyecto

```
LaAPIdelasTormentas/
├── index.js
├── package.json
├── openapi.yaml
├── routes/
│   ├── explorador.js
│   ├── personajes.js
│   ├── ordenes.js
│   ├── spren.js
│   ├── heraldos.js
│   ├── buscar.js
│   ├── stats.js
│   └── docs.js
├── controllers/
├── utils/                  # Carga y caché de datos en memoria
├── data/
│   ├── personajes.json     # Índice resumido
│   ├── ordenes.json
│   ├── spren.json
│   ├── heraldos.json
│   ├── personajes/         # Perfiles completos por personaje
│   ├── spren/
│   └── heraldos/
└── public/
    └── images/
        ├── ordenes/        # SVGs de los glifos
        └── heraldos/
```

Todos los datos se cargan en memoria al arrancar. Las peticiones no tocan disco.

---

## Estructura de datos

### Índice (`personajes.json`)

```json
{
  "id": "kaladin",
  "nombre": "Kaladin",
  "orden": "Corredores del Viento",
  "nivel_ideal": 5,
  "estado_actual": "vivo"
}
```

### Perfil completo

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
  "relaciones": {
    "familia":  [{ "personaje": "lirin",  "relacion": "padre" }],
    "amigos":   [{ "personaje": "teft",   "relacion": "amigo" }],
    "enemigos": [{ "personaje": "moash",  "relacion": "enemigo" }]
  },
  "estado_mental": {
    "diagnostico_general": "trastorno depresivo mayor recurrente",
    "evolucion": "mejora progresiva con recaídas"
  },
  "arco_narrativo": {
    "resumen": "...",
    "puntos_clave": ["..."]
  },
  "situacion_actual": {
    "ocupacion": "Corredor del Viento del Quinto Ideal",
    "rol": "..."
  },
  "descripcion_breve": "...",
  "notas": "..."
}
```

Las plantillas están en `data/personajes/00Plantilla.json`, `data/spren/00Plantilla.json` y `data/heraldos/00Plantilla.json`.

---

## Valores estandarizados

| Campo | Valores |
|---|---|
| `estado_actual` | `vivo` · `viva` · `fallecido` · `fallecida` |
| `rol` en apariciones | `protagonista` · `principal` · `secundario importante` · `secundario` · `menor` |
| `especie` | `humano` · `cantor` · `retornado` |

---

## Tecnologías

- [Node.js](https://nodejs.org/) — ESModules
- [Express 5](https://expressjs.com/)
- [helmet](https://helmetjs.github.io/) — cabeceras de seguridad HTTP
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) — límite de peticiones por IP

---

## Autor

**Are112**

---

## Agradecimientos

- **Brandon Sanderson** — por crear el universo de El Archivo de las Tormentas.
- **La Coppermind Wiki** — fuente de referencia canónica para todos los datos. [coppermind.net](https://es.coppermind.net/)

---

## Licencia

Los **datos** (`/data`) se distribuyen bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es) — libres para usar, compartir y adaptar citando la fuente.

El **código fuente** se distribuye bajo licencia MIT.

El universo, personajes y elementos narrativos de El Archivo de las Tormentas son propiedad intelectual de Brandon Sanderson y Dragonsteel Entertainment. Este proyecto es un trabajo de fans sin ánimo de lucro, no afiliado ni respaldado oficialmente.
