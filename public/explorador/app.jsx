// app.jsx - Página de inicio de "La API de las Tormentas"
// Layout: hero -> categorías -> destacados -> diez órdenes -> footer
// + overlay de detalle + tweaks (modo oscuro/claro, intensidad atmósfera)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "atmosphere": 0.45,
  "density": "regular"
}/*EDITMODE-END*/;

const DATA = window.TORMENTAS_DATA;

// ── Utilidades ─────────────────────────────────────────────────────────────

function useEscape(onClose) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
}

const pad = (n, w = 2) => String(n).padStart(w, '0');

// ── Top Bar ────────────────────────────────────────────────────────────────

function TopBar({ dark, onToggleDark }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#">
          <BrandMark size={36} />
          <div className="brand-text">
            <div className="brand-title">La API de las Tormentas</div>
            <div className="brand-sub">códice digital · cosmere</div>
          </div>
        </a>
        <nav className="nav">
          <a href="#categorias">Explorador</a>
          <a href="#ordenes">Diez Órdenes</a>
          <a href="#api">API</a>
          <a href="#acerca">Acerca</a>
        </nav>
        <div className="topbar-actions">
          <button className="theme-btn" onClick={onToggleDark} title="Cambiar tema">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    {[0,1,2,3,4,5,6,7].map(i => {
      const a = (i / 8) * Math.PI * 2;
      const x1 = 12 + Math.cos(a) * 7, y1 = 12 + Math.sin(a) * 7;
      const x2 = 12 + Math.cos(a) * 9.5, y2 = 12 + Math.sin(a) * 9.5;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" />
  </svg>
);

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero({ atmosphere, accent }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        {atmosphere > 0 && <Atmosphere intensity={atmosphere} accent={accent} />}
      </div>

      <div className="hero-grid">
        <h1 className="hero-title">
          La API<br />
          de las <em>Tormentas</em>
        </h1>

        <p className="hero-tagline">
          Un atlas vivo del universo de <em>El Archivo de las Tormentas</em>.
          Personajes, spren, heraldos, deshechos y esquirlas catalogados como datos abiertos.
        </p>

        <div className="hero-cta">
          <a className="btn btn-primary" href="#categorias">Empezar a explorar</a>
          <a className="btn btn-ghost" href="#api">Documentación API ↗</a>
        </div>
      </div>

      <div className="hero-foot">
        <span className="mono mono-small">Proyecto fan · sin ánimo de lucro</span>
        <span className="mono mono-small">v2.4 · 366 entradas · CC-BY 4.0</span>
      </div>
    </section>
  );
}

// ── Categorías ─────────────────────────────────────────────────────────────

function CategoriesSection({ onOpenCategory }) {
  const cats = DATA.categorias;
  return (
    <section className="section" id="categorias">
      <SectionHeader num="Catálogo" title="Cinco dominios" caption="Cada dominio agrupa un tipo de entidad del universo. Selecciona uno para abrir su índice." />
      <div className="cats-grid">
        {cats.map((c, i) => (
          <button key={c.id}
                  className={"cat-card " + (i === 0 ? 'cat-card-lg' : '')}
                  onClick={() => onOpenCategory(c)}>
            <div className="cat-card-head">
              <span className="cat-num mono">{pad(i + 1)}</span>
              <span className="cat-count mono">{c.count}</span>
            </div>
            <div className="cat-glyph">
              <CategoryGlyph kind={c.glyph} size={64} />
            </div>
            <div className="cat-card-foot">
              <div className="cat-name">{c.nombre}</div>
              <div className="cat-tag">{c.tagline}</div>
            </div>
            <div className="cat-arrow">→</div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Destacados ─────────────────────────────────────────────────────────────

function FeaturedSection({ onOpenEntry }) {
  const [filter, setFilter] = React.useState('todas');
  const entries = filter === 'todas'
    ? DATA.destacados
    : DATA.destacados.filter(e => e.categoria === filter);

  return (
    <section className="section" id="destacados">
      <SectionHeader num="Selección" title="Entradas destacadas"
                     caption="Una selección curada del códice. Toca una ficha para abrirla." />
      <div className="filter-row">
        {[
          ['todas', 'Todas'],
          ['personajes', 'Personajes'],
          ['spren', 'Spren'],
          ['heraldos', 'Heraldos'],
          ['deshechos', 'Deshechos'],
          ['esquirlas', 'Esquirlas']
        ].map(([k, label]) => (
          <button key={k} className={"chip " + (filter === k ? 'chip-on' : '')}
                  onClick={() => setFilter(k)}>{label}</button>
        ))}
      </div>
      <div className="entries-grid">
        {entries.map((e, i) => (
          <button key={e.id} className="entry-card" onClick={() => onOpenEntry(e)}>
            <div className="entry-head">
              <span className="entry-num mono">{pad(i + 1, 3)}</span>
              <span className="entry-cat mono">{e.categoria}</span>
            </div>
            <div className="entry-glyph">
              <CategoryGlyph kind={DATA.categorias.find(c => c.id === e.categoria).glyph} size={56} />
            </div>
            <div className="entry-name">{e.nombre}</div>
            <div className="entry-meta">
              {e.orden && (
                <span className="meta-pill">
                  <OrderGlyph id={e.orden} size={14} />
                  {DATA.ordenes.find(o => o.id === e.orden)?.nombre.split(' ').slice(0,2).join(' ')}
                </span>
              )}
              {e.juramento && <span className="meta-pill">Juramento {e.juramento}</span>}
              {e.numero && <span className="meta-pill mono">N°{pad(e.numero)}</span>}
            </div>
            <div className="entry-epi">{e.epigrafe}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Diez Órdenes ───────────────────────────────────────────────────────────

function OrdersSection({ onOpenOrder }) {
  return (
    <section className="section section-orders" id="ordenes">
      <SectionHeader num="Estructura" title="Las diez órdenes"
                     caption="Los Caballeros Radiantes están agrupados en diez órdenes, cada una vinculada a un tipo de spren." />
      <div className="orders-grid">
        {DATA.ordenes.map((o, i) => (
          <button key={o.id} className="order-cell" onClick={() => onOpenOrder(o)}>
            <span className="order-num mono">{pad(i + 1)}</span>
            <div className="order-glyph">
              <OrderGlyph id={o.id} size={84} />
            </div>
            <div className="order-name">{o.nombre}</div>
            <div className="order-spren mono">{o.spren}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── API teaser ─────────────────────────────────────────────────────────────

function ApiSection() {
  return (
    <section className="section section-api" id="api">
      <SectionHeader num="API" title="Datos abiertos" caption="Un endpoint REST para cada dominio. Esquema versionado, JSON limpio." />
      <div className="api-grid">
        <div className="api-copy">
          <p>
            Cada entrada del códice está respaldada por un endpoint estable, documentado y libre.
            Construye visualizaciones, bots, wikis o cuadernos de investigación.
          </p>
          <ul className="api-bullets">
            <li><span className="b">Datos</span> licenciados bajo CC-BY 4.0</li>
            <li><span className="b">Código</span> bajo MIT, abierto en GitHub</li>
            <li><span className="b">Búsqueda</span> avanzada, filtros y paginación</li>
            <li><span className="b">Sin tokens</span> ni claves para empezar</li>
          </ul>
          <div className="api-actions">
            <a className="btn btn-primary" href="#">Documentación ↗</a>
            <a className="btn btn-ghost" href="#">Repositorio ↗</a>
          </div>
        </div>
        <div className="api-snippet">
          <div className="snippet-bar">
            <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            <span className="snippet-path mono">GET /v2/personajes/kaladin</span>
          </div>
          <pre className="snippet-code mono">{`{
  "id": "kaladin",
  "nombre": "Kaladin Bendito por la Tormenta",
  "categoria": "personajes",
  "orden": "corredores_del_viento",
  "spren": { "ref": "/v2/spren/sylphrena", "nombre": "Syl" },
  "juramento": 3,
  "atributos": ["Protector", "Líder"],
  "epigrafe": "Protegeré a aquellos que no
              pueden protegerse a sí mismos.",
  "afiliaciones": ["Puente Cuatro", "Kholin"]
}`}</pre>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer" id="acerca">
      <div className="footer-grid">
        <div>
          <BrandMark size={28} />
          <div className="footer-title">La API de las Tormentas</div>
          <div className="footer-sub">códice digital del Cosmere</div>
        </div>
        <div>
          <div className="footer-h">Proyecto</div>
          <a href="#">Acerca</a>
          <a href="#">Changelog</a>
          <a href="#">Roadmap</a>
        </div>
        <div>
          <div className="footer-h">Datos</div>
          <a href="#">API Docs</a>
          <a href="#">Esquemas</a>
          <a href="#">Estado</a>
        </div>
        <div>
          <div className="footer-h">Comunidad</div>
          <a href="https://es.coppermind.net/">Coppermind ↗</a>
          <a href="#">GitHub ↗</a>
          <a href="#">Discord ↗</a>
        </div>
      </div>
      <div className="footer-rule"></div>
      <div className="footer-fine">
        <span>Datos CC-BY 4.0 · Código MIT · Por Are112 · 2026</span>
        <span className="mono">v2.4.1 · build 0c7af1</span>
      </div>
      <div className="footer-fine fine-italic">
        El universo de <em>El Archivo de las Tormentas</em> es propiedad de Brandon Sanderson y Dragonsteel Entertainment.
        Proyecto fan sin ánimo de lucro, no afiliado ni respaldado oficialmente.
      </div>
    </footer>
  );
}

// ── Section Header reutilizable ────────────────────────────────────────────

function SectionHeader({ num, title, caption }) {
  return (
    <div className="sec-head">
      <div className="sec-num mono">{num}</div>
      <h2 className="sec-title">{title}</h2>
      {caption && <p className="sec-caption">{caption}</p>}
    </div>
  );
}

// ── Overlay de detalle ─────────────────────────────────────────────────────

function DetailOverlay({ payload, onClose }) {
  useEscape(onClose);
  if (!payload) return null;

  const { kind, item } = payload;
  return (
    <div className="overlay" onClick={onClose}>
      <aside className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="sheet-kicker mono">/ {kind}</div>
          <button className="sheet-x" onClick={onClose}>✕</button>
        </div>

        {kind === 'categoria' && <CategoryDetail c={item} />}
        {kind === 'entrada'   && <EntryDetail e={item} />}
        {kind === 'orden'     && <OrderDetail o={item} />}
      </aside>
    </div>
  );
}

function CategoryDetail({ c }) {
  return (
    <div className="detail">
      <div className="detail-glyph"><CategoryGlyph kind={c.glyph} size={140} /></div>
      <div className="detail-count mono">{c.count} entradas</div>
      <h3 className="detail-title">{c.nombre}</h3>
      <p className="detail-tagline">{c.tagline}</p>
      <div className="detail-body">
        <p>{c.descripcion}</p>
      </div>
      <div className="detail-snippet">
        <div className="snippet-bar">
          <span className="snippet-path mono">GET /v2/{c.id}</span>
        </div>
        <pre className="snippet-code mono">{`[
  { "id": "...", "nombre": "..." },
  { "id": "...", "nombre": "..." },
  ...${c.count} resultados
]`}</pre>
      </div>
    </div>
  );
}

function EntryDetail({ e }) {
  const cat = DATA.categorias.find(c => c.id === e.categoria);
  const orden = e.orden ? DATA.ordenes.find(o => o.id === e.orden) : null;
  const full = e.full || {};
  return (
    <div className="detail">
      <div className="detail-glyph">
        {orden ? <OrderGlyph id={orden.id} size={140} /> : <CategoryGlyph kind={cat.glyph} size={140} />}
      </div>
      <div className="detail-count mono">/{e.categoria} · {full.tipo || e.tipo}</div>
      <h3 className="detail-title">{full.nombre || e.nombre}</h3>
      {(full.descripcion_breve || e.epigrafe) && (
        <p className="detail-tagline"><em>«{full.descripcion_breve || e.epigrafe}»</em></p>
      )}
      <div className="detail-table">
        <div className="trow"><span>Categoría</span><span>{cat.nombre}</span></div>
        {(full.orden || orden) && <div className="trow"><span>Orden</span><span>{full.orden || orden?.nombre}</span></div>}
        {(full.nivel_ideal || e.juramento) && <div className="trow"><span>Juramento</span><span>{full.nivel_ideal || e.juramento} de 5</span></div>}
        {full.especie && <div className="trow"><span>Especie</span><span>{full.especie}</span></div>}
        {full.nacionalidad && <div className="trow"><span>Nacionalidad</span><span>{full.nacionalidad}</span></div>}
        {full.spren && <div className="trow"><span>Spren</span><span>{typeof full.spren === 'string' ? full.spren : full.spren.nombre}</span></div>}
        {full.estado && <div className="trow"><span>Estado</span><span>{full.estado}</span></div>}
        {full.afiliaciones && <div className="trow"><span>Afiliaciones</span><span>{Array.isArray(full.afiliaciones) ? full.afiliaciones.join(', ') : full.afiliaciones}</span></div>}
      </div>
      {full.descripcion && (
        <div className="detail-body"><p>{full.descripcion}</p></div>
      )}
      <div className="detail-snippet">
        <div className="snippet-bar">
          <span className="snippet-path mono">GET /personajes/{e.id}/completo</span>
        </div>
        <pre className="snippet-code mono">{JSON.stringify(
          full && Object.keys(full).length ? full : { id: e.id, nombre: e.nombre },
          null, 2
        ).slice(0, 600)}</pre>
      </div>
    </div>
  );
}

function OrderDetail({ o }) {
  return (
    <div className="detail">
      <div className="detail-glyph"><OrderGlyph id={o.id} size={140} /></div>
      <div className="detail-count mono">orden radiante</div>
      <h3 className="detail-title">{o.nombre}</h3>
      <p className="detail-tagline">Vinculados a <em>{o.spren}</em></p>
      <div className="detail-table">
        <div className="trow"><span>Spren</span><span>{o.spren}</span></div>
        <div className="trow"><span>Atributos</span><span>{o.atributos.join(', ')}</span></div>
        <div className="trow"><span>Potencias</span><span>{o.potencias.join(' · ')}</span></div>
      </div>
      <div className="detail-snippet">
        <div className="snippet-bar">
          <span className="snippet-path mono">GET /v2/ordenes/{o.id}</span>
        </div>
        <pre className="snippet-code mono">{JSON.stringify({
          id: o.id, nombre: o.nombre, spren: o.spren,
          atributos: o.atributos, potencias: o.potencias
        }, null, 2)}</pre>
      </div>
    </div>
  );
}

// ── App raíz ───────────────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [overlay, setOverlay] = React.useState(null);

  React.useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
    document.documentElement.dataset.density = t.density;
  }, [t.dark, t.density]);

  const accent = t.dark ? '#a8b3ff' : '#5b6bd6';

  return (
    <div className="app">
      <TopBar dark={t.dark} onToggleDark={() => setTweak('dark', !t.dark)} />
      <main>
        <Hero atmosphere={t.atmosphere} accent={accent} />
        <CategoriesSection onOpenCategory={(c) => {
          if (c.disabled) return;
          setOverlay({ kind: 'categoria', item: c });
        }} />
        <FeaturedSection onOpenEntry={async (e) => {
          setOverlay({ kind: 'entrada', item: e, loading: true });
          const full = await window.TORMENTAS_LOAD_DETAIL(e.categoria, e.id);
          setOverlay({ kind: 'entrada', item: { ...e, full } });
        }} />
        <OrdersSection onOpenOrder={(o) => setOverlay({ kind: 'orden', item: o })} />
        <ApiSection />
      </main>
      <Footer />

      <DetailOverlay payload={overlay} onClose={() => setOverlay(null)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tema" />
        <TweakToggle label="Modo oscuro" value={t.dark}
                     onChange={(v) => setTweak('dark', v)} />
        <TweakSection label="Atmósfera" />
        <TweakSlider label="Intensidad" value={t.atmosphere} min={0} max={2} step={0.1}
                     onChange={(v) => setTweak('atmosphere', v)} />
        <TweakSection label="Densidad" />
        <TweakRadio label="Espaciado" value={t.density}
                    options={['compact', 'regular', 'comfy']}
                    onChange={(v) => setTweak('density', v)} />
      </TweaksPanel>
    </div>
  );
}

// Carga datos desde la API real antes de montar la app
(async () => {
  try { await window.TORMENTAS_LOAD(); }
  catch (err) { console.error('Error cargando datos', err); }
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
