# ⚡ La API de las Tormentas

API REST sobre los personajes del universo literario **El Archivo de las Tormentas** de Brandon Sanderson. Construida con **Node.js** y **Express 5**.

---

## 🚀 Instalación y arranque

```bash
npm install
npm start
```

El servidor arranca por defecto en el puerto `3000`. Puedes cambiarlo con la variable de entorno `PORT`.

---

## 📁 Estructura del proyecto

```
LaAPIdelasTormentas/
├── index.js                  # Punto de entrada, configuración Express
├── package.json
├── routes/
│   ├── personajes.js         # Rutas /personajes
│   └── buscar.js             # Rutas /buscar
├── controllers/
│   ├── personajesController.js
│   └── buscarController.js
├── utils/
│   ├── loadCharacter.js      # Carga y caché de personajes individuales
│   └── loadList.js           # Carga y caché de la lista general
└── data/
    ├── personajes.json        # Índice con resumen de todos los personajes
    └── personajes/            # Un JSON por personaje con datos completos
        ├── kaladin.json
        ├── shallan.json
        └── ...
```

---

## 🔗 Endpoints

### `GET /`
Comprueba que la API está funcionando.

**Respuesta:**
```json
{ "ok": true, "msg": "API El Archivo de las Tormentas funcionando ⚡" }
```

---

### `GET /personajes`
Devuelve la lista resumida de todos los personajes.

**Respuesta:**
```json
[
  { "id": "kaladin", "nombre": "Kaladin", "orden": "Corredores del Viento", "nivel_ideal": 4 },
  { "id": "shallan", "nombre": "Shallan", "orden": "Tejedores de Luz", "nivel_ideal": 4 }
]
```

---

### `GET /personajes/:id`
Devuelve el perfil completo de un personaje.

**Ejemplo:** `GET /personajes/kaladin`

---

### `GET /personajes/:id/resumen`
Devuelve solo el resumen del personaje (desde el índice).

**Ejemplo:** `GET /personajes/kaladin/resumen`

---

### `GET /personajes/:id/completo`
Devuelve resumen + perfil completo fusionados.

**Ejemplo:** `GET /personajes/kaladin/completo`

---

### `GET /personajes/:id/:seccion`
Devuelve una sección concreta del perfil de un personaje.

**Secciones disponibles:** `orden_radiantes`, `habilidades`, `relaciones`, `estado_mental`, `arco_narrativo`, `situacion_actual`, `apariciones`, `afiliaciones`

**Ejemplo:** `GET /personajes/kaladin/habilidades`

---

### `GET /buscar`
Búsqueda avanzada con filtros, ordenación y paginación.

#### Parámetros disponibles

| Parámetro | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `id` | string | Filtra por ID exacto | `?id=kaladin` |
| `especie` | string | Filtra por especie | `?especie=humano` |
| `sexo` | string | Filtra por sexo | `?sexo=femenino` |
| `nacionalidad` | string | Filtra por nacionalidad | `?nacionalidad=alezi` |
| `origen` | string | Filtra por lugar de origen | `?origen=Piedralar` |
| `estado_actual` | string | `vivo` o `muerto` | `?estado_actual=vivo` |
| `afiliacion` | string | Filtra por afiliación exacta | `?afiliacion=Puente+Cuatro` |
| `orden` | string | Orden radiante exacta | `?orden=Corredores+del+Viento` |
| `nivel_ideal` | string | Nivel del Ideal (soporta `>=`, `<=`, `>`, `<`) | `?nivel_ideal=>=3` |
| `libro` | string | Título del libro en que aparece | `?libro=Juramentada` |
| `texto` | string | Búsqueda de texto libre en todo el perfil | `?texto=depresión` |
| `sort` | string | Campo por el que ordenar (prefijo `-` para descendente) | `?sort=-nivel_ideal` |
| `page` | número | Página de resultados | `?page=2` |
| `limit` | número | Resultados por página | `?limit=5` |
| `fields` | string | Campos a devolver (separados por coma, soporta rutas profundas) | `?fields=nombre,orden_radiantes.orden` |

#### Filtros dinámicos (rutas profundas)

Puedes filtrar por cualquier campo anidado usando notación de punto:

```
GET /buscar?orden_radiantes.spren_asociado.principal=Sylphrena
GET /buscar?habilidades.magia.potencias=Gravitación
GET /buscar?situacion_actual.rol=sanador
```

#### Ejemplos de uso

```bash
# Todos los Corredores del Viento
GET /buscar?orden=Corredores+del+Viento

# Personajes femeninos con nivel_ideal >= 3
GET /buscar?sexo=femenino&nivel_ideal=>=3

# Personajes ordenados por nivel_ideal descendente, solo nombre y orden
GET /buscar?sort=-nivel_ideal&fields=nombre,orden_radiantes.orden

# Paginación: segunda página de 5 en 5
GET /buscar?page=2&limit=5

# Búsqueda libre
GET /buscar?texto=Urithiru
```

**Respuesta:**
```json
{
  "total": 10,
  "pagina": 1,
  "limite": 10,
  "resultados": [ ... ]
}
```

---

## 🗂️ Estructura de un personaje

Cada fichero JSON en `data/personajes/` sigue esta estructura:

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
    "familia": [ { "personaje": "lirin", "relacion": "padre" } ],
    "amigos": [ { "personaje": "Teft", "relacion": "amigo" } ],
    "enemigos": [ { "personaje": "Moash", "relacion": "enemigo" } ]
  },
  "estado_mental": {
    "diagnostico_general": "trastorno depresivo recurrente",
    "evolucion": "mejora progresiva con recaídas"
  },
  "arco_narrativo": {
    "resumen": "...",
    "puntos_clave": ["..."]
  },
  "situacion_actual": {
    "ocupacion": "sanador",
    "rol": "..."
  },
  "descripcion_breve": "...",
  "notas": "..."
}
```

---

## 🛠️ Tecnologías

- [Node.js](https://nodejs.org/) (ESModules)
- [Express 5](https://expressjs.com/)

---

## 📖 Documentación interactiva

Con el servidor en marcha, accede a la documentación Swagger en:

```
http://localhost:3000/api-docs
```
