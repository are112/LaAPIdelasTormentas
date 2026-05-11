// glyphs.jsx - Glifos geométricos SVG planos. Sin filigranas reales del libro;
// originales: composiciones geométricas que evocan cada concepto.

const STROKE = 1.25;

function GlyphFrame({ children, size = 96, hueShift = 0 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
         style={{ display: 'block', overflow: 'visible' }}>
      {children}
    </svg>
  );
}

// ── Categorías ─────────────────────────────────────────────────────────────

const CategoryGlyphs = {
  figure: (
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round">
      <circle cx="50" cy="50" r="42" />
      <circle cx="50" cy="36" r="9" />
      <path d="M30 78 Q50 52 70 78" />
      <path d="M50 45 L50 65" />
      <path d="M16 50 L84 50" strokeOpacity="0.2" strokeDasharray="2 4" />
    </g>
  ),
  spiral: (
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round">
      <circle cx="50" cy="50" r="42" />
      <path d="M50 50 m0 -28 a28 28 0 1 1 -19.8 47.8" />
      <path d="M50 50 m0 -16 a16 16 0 1 1 -11.3 27.3" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </g>
  ),
  sun: (
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round">
      <circle cx="50" cy="50" r="42" />
      <circle cx="50" cy="50" r="14" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const x1 = 50 + Math.cos(a) * 22;
        const y1 = 50 + Math.sin(a) * 22;
        const x2 = 50 + Math.cos(a) * 34;
        const y2 = 50 + Math.sin(a) * 34;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
  ),
  fracture: (
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" />
      <path d="M50 14 L40 38 L56 46 L34 60 L60 64 L46 86" />
      <path d="M22 30 L34 40" strokeOpacity="0.45" />
      <path d="M72 64 L82 56" strokeOpacity="0.45" />
    </g>
  ),
  shard: (
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" />
      <path d="M50 14 L72 50 L50 86 L28 50 Z" />
      <path d="M50 14 L50 86" strokeOpacity="0.45" />
      <path d="M28 50 L72 50" strokeOpacity="0.45" />
    </g>
  )
};

function CategoryGlyph({ kind, size = 96 }) {
  return <GlyphFrame size={size}>{CategoryGlyphs[kind]}</GlyphFrame>;
}

// ── Diez Órdenes (geométricos originales) ──────────────────────────────────

const OrderGlyphs = {
  corredores: (
    // viento ascendente: tres flechas/chevrons
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M30 64 L50 38 L70 64" />
      <path d="M34 76 L50 54 L66 76" strokeOpacity="0.55" />
      <path d="M38 28 L50 18 L62 28" strokeOpacity="0.8" />
    </g>
  ),
  tejedores: (
    // tesela / diamante con luz refractada
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M50 18 L78 50 L50 82 L22 50 Z" />
      <path d="M50 30 L68 50 L50 70 L32 50 Z" strokeOpacity="0.7" />
      <path d="M22 50 L78 50" strokeOpacity="0.35" />
      <path d="M50 18 L50 82" strokeOpacity="0.35" />
    </g>
  ),
  forjadores: (
    // unión: dos arcos enlazados
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <circle cx="40" cy="50" r="18" />
      <circle cx="60" cy="50" r="18" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </g>
  ),
  danzantes: (
    // hoja / espiral elegante
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M28 72 Q28 28 50 28 Q72 28 72 50 Q72 72 50 72 Q40 72 36 64" />
      <path d="M28 72 L72 28" strokeOpacity="0.35" />
    </g>
  ),
  rompedores: (
    // rayo angular descendiendo
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M58 16 L34 52 L52 52 L42 84" />
      <path d="M22 50 L78 50" strokeOpacity="0.25" strokeDasharray="2 4" />
    </g>
  ),
  vigilantes: (
    // hexágono con punto: ojo geométrico
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M50 18 L80 35 L80 65 L50 82 L20 65 L20 35 Z" />
      <path d="M50 30 L68 40 L68 60 L50 70 L32 60 L32 40 Z" strokeOpacity="0.55" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </g>
  ),
  custodios: (
    // montaña / piedra triangular sólida
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M18 72 L50 22 L82 72 Z" />
      <path d="M30 72 L50 42 L70 72" strokeOpacity="0.55" />
      <path d="M18 72 L82 72" />
    </g>
  ),
  forjadores2: (
    // reloj / hexágono abierto
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" strokeLinecap="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M24 22 L76 22 L24 78 L76 78 Z" />
      <path d="M50 22 L50 78" strokeOpacity="0.45" strokeDasharray="2 4" />
    </g>
  ),
  llamadores: (
    // prisma / cristal angular
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M50 16 L74 36 L66 78 L34 78 L26 36 Z" />
      <path d="M50 16 L50 78" strokeOpacity="0.45" />
      <path d="M26 36 L74 36" strokeOpacity="0.45" />
      <path d="M34 78 L74 36" strokeOpacity="0.25" />
      <path d="M66 78 L26 36" strokeOpacity="0.25" />
    </g>
  ),
  portadores: (
    // llama angular / V invertida con chispa
    <g fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="42" strokeOpacity="0.35" />
      <path d="M30 80 L50 24 L70 80" />
      <path d="M38 70 L50 42 L62 70" strokeOpacity="0.6" />
      <circle cx="50" cy="58" r="3" fill="currentColor" />
    </g>
  )
};

function OrderGlyph({ id, size = 80 }) {
  return <GlyphFrame size={size}>{OrderGlyphs[id] || OrderGlyphs.corredores}</GlyphFrame>;
}

// Marca / wordmark glyph: tres líneas inclinadas dentro de un círculo (tormenta abstracta)
function BrandMark({ size = 40 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="50" cy="50" r="44" strokeOpacity="0.4" />
        <path d="M28 70 L48 30" />
        <path d="M42 76 L62 36" strokeOpacity="0.7" />
        <path d="M56 78 L72 46" strokeOpacity="0.45" />
      </g>
    </svg>
  );
}

Object.assign(window, { CategoryGlyph, OrderGlyph, BrandMark });
