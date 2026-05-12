const fs = require("fs")
const path = require("path")

const PersonajeSchema = require(
  "../schemas/personaje.schema"
)

const charactersPath = path.join(
  __dirname,
  "../data/personajes"
)

const files = fs.readdirSync(charactersPath)

let hasErrors = false

for (const file of files) {

  const filePath = path.join(
    charactersPath,
    file
  )

  const raw = fs.readFileSync(
    filePath,
    "utf8"
  )

  const data = JSON.parse(raw)

  const result =
    PersonajeSchema.safeParse(data)

  if (!result.success) {

    hasErrors = true

    console.log(`\\n❌ Error en ${file}`)

    console.dir(
      result.error.format(),
      { depth: null }
    )

  } else {

    console.log(`✅ ${file}`)

  }
}

if (hasErrors) {

  console.log(
    "\\n❌ Hay errores de validación"
  )

  process.exit(1)

} else {

  console.log(
    "\\n✅ Todos los personajes son válidos"
  )

}