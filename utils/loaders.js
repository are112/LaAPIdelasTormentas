import { createLoader } from "./dataLoader.js";

export const personajes = createLoader({ dir: "personajes", listFile: "personajes.json", label: "personajes" });
export const heraldos   = createLoader({ dir: "heraldos",   listFile: "heraldos.json",   label: "heraldos" });
export const spren      = createLoader({ dir: "spren",      listFile: "spren.json",       label: "spren" });
export const deshechos  = createLoader({ dir: "deshechos",  listFile: "deshechos.json",  label: "deshechos" });
export const esquirlas  = createLoader({ dir: "esquirlas",  listFile: "esquirlas.json",  label: "esquirlas" });
export const ordenes    = createLoader({                     listFile: "ordenes.json",    label: "órdenes" });
