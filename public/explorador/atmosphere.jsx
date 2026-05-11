// atmosphere.jsx - Canvas de partículas: motas de luz tormentosa derivando.

function Atmosphere({ intensity = 1, accent = '#a8b3ff' }) {
  const ref = React.useRef(null);
  const stateRef = React.useRef({ particles: [], w: 0, h: 0, mx: 0.5, my: 0.5, raf: 0 });

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      s.w = rect.width;
      s.h = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const COUNT = Math.round(140 * intensity);
    s.particles = Array.from({ length: COUNT }).map(() => ({
      x: Math.random() * s.w,
      y: Math.random() * s.h,
      r: 0.4 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -0.05 - Math.random() * 0.18,
      a: 0.15 + Math.random() * 0.65,
      tw: Math.random() * Math.PI * 2,
      tws: 0.005 + Math.random() * 0.015
    }));

    // Streaks de "viento"
    const streaks = Array.from({ length: Math.round(8 * intensity) }).map(() => ({
      x: Math.random() * s.w,
      y: Math.random() * s.h,
      len: 80 + Math.random() * 200,
      v: 0.15 + Math.random() * 0.5,
      a: 0.04 + Math.random() * 0.06
    }));

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      s.mx = (e.clientX - rect.left) / rect.width;
      s.my = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      ctx.clearRect(0, 0, s.w, s.h);

      // streaks finos horizontales
      ctx.strokeStyle = accent;
      streaks.forEach(st => {
        st.x += st.v;
        if (st.x - st.len > s.w) {
          st.x = -st.len;
          st.y = Math.random() * s.h;
        }
        const grad = ctx.createLinearGradient(st.x - st.len, st.y, st.x, st.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, accent + Math.round(st.a * 255).toString(16).padStart(2, '0'));
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(st.x - st.len, st.y);
        ctx.lineTo(st.x, st.y);
        ctx.stroke();
      });

      // motas
      s.particles.forEach(p => {
        // deriva por puntero
        const dx = (s.mx - 0.5) * 0.06;
        p.x += p.vx + dx;
        p.y += p.vy;
        p.tw += p.tws;
        if (p.y < -10) { p.y = s.h + 10; p.x = Math.random() * s.w; }
        if (p.x < -10) p.x = s.w + 10;
        if (p.x > s.w + 10) p.x = -10;

        const tw = 0.6 + Math.sin(p.tw) * 0.4;
        const alpha = p.a * tw;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // halo
        if (p.r > 1.1) {
          ctx.globalAlpha = alpha * 0.18;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
    };
  }, [intensity, accent]);

  return <canvas ref={ref} className="atmosphere" />;
}

window.Atmosphere = Atmosphere;
