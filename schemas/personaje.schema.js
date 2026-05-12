const { z } = require("zod")

const PersonajeSchema = z.object({
  id: z.string(),

  nombre: z.string(),

  descripcion: z.string().optional(),

  estado: z.string().optional(),

  afiliaciones: z.array(z.string()).optional()
})

module.exports = PersonajeSchema