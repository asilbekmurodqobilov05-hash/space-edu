import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const COLORS = ['#ffffff', '#ffe8d6', '#e8e0ff', '#d4e8ff', '#fff4e0'];
    let raf, w, h, stars, gradient, resizeTimer;

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      const r = Math.random;

      gradient = ctx.createLinearGradient(0, h * 0.85, w * 0.85, 0);
      gradient.addColorStop(0,    'rgba(55, 15, 95, 0)');
      gradient.addColorStop(0.2,  'rgba(75, 25, 120, 0.016)');
      gradient.addColorStop(0.45, 'rgba(95, 45, 145, 0.028)');
      gradient.addColorStop(0.6,  'rgba(75, 25, 120, 0.016)');
      gradient.addColorStop(1,    'rgba(55, 15, 95, 0)');

      const bg = Array.from({ length: 380 }, () => ({
        x: r() * w, y: r() * h,
        sz: 0.15 + r() * 0.55, spd: 0.003 + r() * 0.008,
        ph: r() * Math.PI * 2, col: '#ffffff',
        base: 0.25 + r() * 0.45, sparkle: false,
      }));

      const mw = Array.from({ length: 750 }, () => {
        const t = r(), perp = (r() - 0.5) * 0.28;
        return {
          x: (t + perp * Math.cos(0.61) - 0.1) * w,
          y: h - (t * 0.9 + perp * Math.sin(0.61)) * h * 1.1,
          sz: 0.08 + r() * 0.42, spd: 0.004 + r() * 0.013,
          ph: r() * Math.PI * 2,
          col: COLORS[Math.floor(r() * COLORS.length)],
          base: 0.18 + r() * 0.55, sparkle: false,
        };
      });

      const bright = Array.from({ length: 22 }, () => ({
        x: r() * w, y: r() * h,
        sz: 1.1 + r() * 1.9, spd: 0.009 + r() * 0.02,
        ph: r() * Math.PI * 2,
        col: r() > 0.5 ? '#ffffff' : r() > 0.25 ? '#c4b5fd' : '#ffe4b5',
        base: 0.65 + r() * 0.3, sparkle: true,
      }));

      stars = [...bg, ...mw, ...bright];
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.spd + s.ph);
        ctx.globalAlpha = s.base * (0.45 + 0.55 * tw);

        if (s.sparkle) {
          ctx.strokeStyle = s.col;
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const ang = (i / 4) * Math.PI * 2;
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + Math.cos(ang) * s.sz * 3.5, s.y + Math.sin(ang) * s.sz * 3.5);
          }
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.sz, 0, Math.PI * 2);
        ctx.fillStyle = s.col;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    init();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}
