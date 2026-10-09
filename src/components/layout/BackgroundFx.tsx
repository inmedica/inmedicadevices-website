'use client';

import { useEffect, useRef } from 'react';

/**
 * Fixed canvas behind the content: drifting navy nodes + red medical crosses,
 * proximity links, cursor glow/repel and click ripples. Static under reduced motion.
 */
export function BackgroundFx() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const cv = document.createElement('canvas');
    host.appendChild(cv);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    type Pt = { x: number; y: number; vx: number; vy: number; c: boolean };
    let W = 0, H = 0, pts: Pt[] = [];
    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const rip: { x: number; y: number; t: number }[] = [];
    let raf = 0;

    const resize = () => {
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(80, (W * H) / 18000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, c: Math.random() < .25 }));
    };
    const move = (e: PointerEvent) => { m.tx = e.clientX; m.ty = e.clientY; if (m.x < -999) { m.x = m.tx; m.y = m.ty; } };
    const down = (e: PointerEvent) => {
      rip.push({ x: e.clientX, y: e.clientY, t: 0 });
      for (const p of pts) { const dx = p.x - e.clientX, dy = p.y - e.clientY, d = Math.hypot(dx, dy); if (d < 220 && d > 0) { p.vx += dx / d * 2.4; p.vy += dy / d * 2.4; } }
    };
    const leave = () => { m.tx = m.ty = -9999; m.x = m.y = -9999; };

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      if (m.tx > -999) {
        m.x += (m.tx - m.x) * .12; m.y += (m.ty - m.y) * .12;
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 340);
        g.addColorStop(0, 'rgba(13,88,120,.13)'); g.addColorStop(.5, 'rgba(229,45,39,.05)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(m.x - 340, m.y - 340, 680, 680);
      }
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy *= .985; p.vx += (Math.random() - .5) * .02; p.vy += (Math.random() - .5) * .02;
          if (Math.hypot(p.vx, p.vy) < .15) { p.vx *= 1.05; p.vy *= 1.05; }
          const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
          if (d < 140 && d > 0) { p.vx += dx / d * .06; p.vy += dy / d * .06; }
        }
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20; if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.strokeStyle = 'rgba(31,43,91,' + (1 - d / 130) * .12 + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const p of pts) {
        const d = Math.hypot(p.x - m.x, p.y - m.y);
        if (d < 200) { ctx.strokeStyle = 'rgba(229,45,39,' + (1 - d / 200) * .35 + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
        const s = p.c ? 4 : 1.8;
        ctx.fillStyle = p.c ? 'rgba(229,45,39,.45)' : 'rgba(31,43,91,.35)';
        if (p.c) { ctx.fillRect(p.x - s, p.y - 1.2, s * 2, 2.4); ctx.fillRect(p.x - 1.2, p.y - s, 2.4, s * 2); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, 6.283); ctx.fill(); }
      }
      for (let i = rip.length - 1; i >= 0; i--) {
        const r = rip[i]; r.t += 1 / 50;
        if (r.t >= 1) { rip.splice(i, 1); continue; }
        const e = 1 - Math.pow(1 - r.t, 3);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(229,45,39,' + (1 - r.t) * .55 + ')'; ctx.beginPath(); ctx.arc(r.x, r.y, 10 + e * 120, 0, 6.283); ctx.stroke();
        ctx.strokeStyle = 'rgba(13,88,120,' + (1 - r.t) * .4 + ')'; ctx.beginPath(); ctx.arc(r.x, r.y, 6 + e * 70, 0, 6.283); ctx.stroke();
        ctx.lineWidth = 1;
      }
      if (!reduce || rip.length || m.tx > -999) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const moveK = (e: PointerEvent) => { move(e); kick(); };
    const downK = (e: PointerEvent) => { if (!reduce) down(e); kick(); };

    resize();
    addEventListener('resize', resize);
    addEventListener('pointermove', moveK, { passive: true });
    addEventListener('pointerdown', downK, { passive: true });
    document.addEventListener('pointerleave', leave);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', moveK);
      removeEventListener('pointerdown', downK);
      document.removeEventListener('pointerleave', leave);
      cv.remove();
    };
  }, []);

  return <div ref={hostRef} className="fx-layer" aria-hidden="true" />;
}
