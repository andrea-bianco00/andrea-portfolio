"use client";

import { useEffect, useRef } from "react";

/** A small interactive k-nearest-neighbour graph: each node is an observation. */
export default function DataConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -10000, y: -10000, active: false };
    type Node = { x: number; y: number; vx: number; vy: number; radius: number };
    let nodes: Node[] = [];
    let width = 1, height = 1, frame = 0, visible = true, running = true;
    const random = (n: number) => {
      const x = Math.sin(n * 127.1 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = width < 430 ? 38 : width < 650 ? 55 : 75;
      nodes = Array.from({ length: count }, (_, i) => ({
        x: width * (.07 + random(i + 1) * .86),
        y: height * (.09 + random(i + 211) * .82),
        vx: (random(i + 331) - .5) * .22,
        vy: (random(i + 491) - .5) * .22,
        radius: 1 + random(i + 601) * 1.7,
      }));
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const points = nodes.map((node) => {
        const dx = node.x - pointer.x, dy = node.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const force = pointer.active && distance < 135 ? (135 - distance) * .26 : 0;
        return { x: node.x + dx / distance * force, y: node.y + dy / distance * force, radius: node.radius };
      });

      // A proximity graph: edges appear only between nearby observations.
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 118) continue;
          ctx.strokeStyle = "rgba(255,122,26," + ((1 - distance / 118) * .35).toFixed(3) + ")";
          ctx.lineWidth = .8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const point of points) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,146,65,.92)";
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!running) return;
      if (visible && !media.matches) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 10 || node.x > width - 10) node.vx *= -1;
          if (node.y < 10 || node.y > height - 10) node.vy *= -1;
        }
        draw();
      }
      frame = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      if (media.matches) draw();
    };
    const onLeave = () => { pointer.active = false; if (media.matches) draw(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .02 });
    const resizer = new ResizeObserver(resize);
    resizer.observe(host);
    observer.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const onMediaChange = () => draw();
    media.addEventListener("change", onMediaChange);
    resize();
    tick();

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      media.removeEventListener("change", onMediaChange);
    };
  }, []);

  return <div className="home-data-network" aria-label="Visualizzazione interattiva di osservazioni e relazioni di vicinanza">
    <canvas ref={canvasRef} aria-hidden="true" />
    <div className="home-data-network-label" aria-hidden="true">
      <span>DATA / NETWORK</span>
      <small>Ogni punto è un&apos;osservazione · Le linee collegano punti vicini</small>
    </div>
    <div className="home-data-network-hint" aria-hidden="true">MUOVI IL MOUSE PER ESPLORARE ↗</div>
  </div>;
}
