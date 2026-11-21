// Light ribbon: a glowing pink → gold → cream trail that follows the pointer (idle drift on touch / no pointer).
// Ported from the design canvas (Option B). Returns a cleanup function.

// Reduced motion stills the ribbon; ?motion=on overrides it so it can be previewed on a Mac with Reduce Motion on.
export const reducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches && new URLSearchParams(location.search).get('motion') !== 'on';

export function initRibbon(canvas, host, opts) {
  const o = Object.assign({ colors: ['#FF0088', '#DDB866', '#FDFCF9'], life: 700, width: 8, glow: 0.55,
    idle: [0.5, 0.3, 0.36, 0.15] }, opts || {});
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const G = 6, g = document.createElement('canvas'), gx = g.getContext('2d'); // 1/6-res glow buffer, never attached
  const reduce = reducedMotion();
  const touch = matchMedia('(hover: none)').matches;
  const rgb = o.colors.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
  // t: 0 head .. 1 tail; k darkens toward black instead of alpha (section bg is #000, so joints don't bead)
  const col = (t, k) => { const s = t * (rgb.length - 1), i = Math.min(rgb.length - 2, s | 0), f = s - i;
    return 'rgb(' + rgb[i].map((v, j) => Math.round((v + (rgb[i + 1][j] - v) * f) * k)) + ')'; };
  let W = 0, H = 0, raf = 0, on = false, seen = false, prev = 0, lastMove = -1e9;
  const pts = [], p = { x: 0, y: 0, vx: 0, vy: 0 }, tgt = { x: 0, y: 0 };
  function stroke(c, s, wMul) {
    const n = pts.length; c.lineCap = c.lineJoin = 'round';
    for (let i = 1; i < n - 1; i++) {
      const a = pts[i - 1], b = pts[i], d = pts[i + 1], u = i / (n - 1);
      c.strokeStyle = col(1 - u, u);
      c.lineWidth = (1 + (o.width - 1) * u) * wMul * s;
      c.beginPath();
      c.moveTo((a.x + b.x) / 2 * s, (a.y + b.y) / 2 * s);
      c.quadraticCurveTo(b.x * s, b.y * s, (b.x + d.x) / 2 * s, (b.y + d.y) / 2 * s);
      c.stroke();
    }
  }
  function render() {
    ctx.clearRect(0, 0, W, H); gx.clearRect(0, 0, g.width, g.height);
    if (pts.length < 3) return;
    stroke(gx, 1 / G, 3.5);
    ctx.globalAlpha = o.glow; ctx.drawImage(g, 0, 0, W, H);
    ctx.globalAlpha = 1; stroke(ctx, 1, 1);
  }
  function drawStatic() {
    pts.length = 0;
    for (let i = 0; i <= 40; i++) { const u = i / 40;
      pts.push({ x: W * (0.9 - 0.8 * u), y: H * (0.3 + 0.12 * u - 0.1 * Math.sin(u * Math.PI)) }); }
    render();
  }
  function step(now) {
    raf = requestAnimationFrame(step);
    const f = prev ? Math.min(3, (now - prev) / 16.67) : 1; prev = now;
    if (touch || now - lastMove > 2000) { const s = now / 12000 * 2 * Math.PI, c = o.idle;
      tgt.x = W * (c[0] + c[2] * Math.sin(s)); tgt.y = H * (c[1] + c[3] * Math.sin(2 * s + 1)); }
    const damp = Math.pow(0.8, f);
    p.vx = (p.vx + (tgt.x - p.x) * 0.07 * f) * damp; p.vy = (p.vy + (tgt.y - p.y) * 0.07 * f) * damp;
    p.x += p.vx * f; p.y += p.vy * f;
    const l = pts[pts.length - 1];
    if (!l || Math.hypot(p.x - l.x, p.y - l.y) > 1.5) pts.push({ x: p.x, y: p.y, t: now });
    while (pts.length && (now - pts[0].t > o.life || pts.length > 48)) pts.shift();
    render();
  }
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, touch ? 1 : 1.5);
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.width = Math.max(1, Math.ceil(W / G)); g.height = Math.max(1, Math.ceil(H / G));
    if (reduce) drawStatic(); else if (!pts.length) { p.x = tgt.x = W / 2; p.y = tgt.y = H / 3; }
  }
  function move(e) {
    if (e.pointerType === 'touch') return;
    const r = host.getBoundingClientRect(), s = W / r.width;
    tgt.x = (e.clientX - r.left) * s; tgt.y = (e.clientY - r.top) * s; lastMove = performance.now();
  }
  const sync = () => { const want = seen && !document.hidden && !reduce;
    if (want && !on) { prev = 0; raf = requestAnimationFrame(step); } else if (!want && on) cancelAnimationFrame(raf);
    on = want; };
  const ro = new ResizeObserver(size), io = new IntersectionObserver((es) => { seen = es[es.length - 1].isIntersecting; sync(); });
  ro.observe(host); io.observe(host);
  if (!reduce) host.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('visibilitychange', sync);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    host.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', sync); };
}
