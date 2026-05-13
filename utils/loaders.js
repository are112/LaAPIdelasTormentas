import { createLoader } from "./dataLoader.js";

// buildIndex: true → pre-calcula índice de texto al arrancar
// Solo en las entidades que usan búsqueda de texto libre (/buscar?texto=)
export const personajes = createLoader({ dir: "personajes", listFile: "personajes.json", label: "personajes", buildIndex: true });
export const heraldos   = createLoader({ dir: "heraldos",   listFile: "heraldos.json",   label: "heraldos",   buildIndex: true });
export const spren      = createLoader({ dir: "spren",      listFile: "spren.json",       label: "spren",      buildIndex: true });
export const deshechos  = createLoader({ dir: "deshechos",  listFile: "deshechos.json",   label: "deshechos",  buildIndex: true });
export const esquirlas  = createLoader({ dir: "esquirlas",  listFile: "esquirlas.json",   label: "esquirlas",  buildIndex: true });
export const ordenes    = createLoader({                     listFile: "ordenes.json",     label: "órdenes" });

// Esperar a que todas las entidades estén cargadas antes de arrancar el servidor
export async function waitForLoaders() {
  await Promise.all([
    personajes.ready,
    heraldos.ready,
    spren.ready,
    deshechos.ready,
    esquirlas.ready,
    ordenes.ready,
  ]);
}
