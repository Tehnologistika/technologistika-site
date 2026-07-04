/**
 * IntroSplash — Ultra-modern intro animation for ТехноЛогистика
 *
 * NO video files. Pure CSS/JS animation. Works perfectly on any screen.
 *
 * Sequence:
 * Phase 1 — "Production Logo" (4.5s):
 *   Black screen → logo materializes with glow particles + eagle cry
 *   Text "ТЕХНОЛОГИСТИКА" appears below with subtle tracking animation
 *
 * Phase 2 — "Site Intro" (5s):
 *   Futuristic grid/lines animation with company tagline
 *   Particle field + light streaks suggesting speed/technology
 *
 * Phase 3 — "Reveal" (1s):
 *   Headlight beam effect → site fades in underneath
 *
 * Total: ~10.5s max, failsafe at 12s
 * Skip button always visible
 */
import { useCallback, useEffect, useRef, useState } from "react";
import logoSrc from "@/assets/technologistika-logo-transparent.png";
import "./IntroSplash.css";

const SESSION_KEY = "technologistikaIntroShownSession";
const LAST_SHOWN_KEY = "technologistikaIntroLastShownAt";
const COOLDOWN_MS = 10800000; // 3 hours

const PHASE1_DURATION = 4500;
const PHASE2_DURATION = 5000;
const FADEOUT_DURATION = 1000;
const FAILSAFE_MS = 12000;

export function shouldShowIntro(): boolean {
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "true") return false;
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    if (lastShown && Date.now() - Number(lastShown) < COOLDOWN_MS) return false;
    return true;
  } catch {
    return false;
  }
}

function markShown(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {}
}

type Phase = "logo" | "site-intro" | "reveal" | "done";

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState<Phase>("logo");
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closedRef = useRef(false);
  const animFrameRef = useRef<number>(0);

  const handleClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setPhase("reveal");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, FADEOUT_DURATION);
  }, [onComplete]);

  useEffect(() => { markShown(); }, []);

  // Failsafe
  useEffect(() => {
    const t = setTimeout(handleClose, FAILSAFE_MS);
    return () => clearTimeout(t);
  }, [handleClose]);

  // Reduced motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(handleClose, 500);
    }
  }, [handleClose]);

  // Phase transitions
  useEffect(() => {
    // Play eagle sound
    if (audioRef.current) {
      audioRef.current.volume = 0.65;
      audioRef.current.play().catch(() => {});
    }

    const t1 = setTimeout(() => {
      if (!closedRef.current) setPhase("site-intro");
    }, PHASE1_DURATION);

    const t2 = setTimeout(() => {
      if (!closedRef.current) handleClose();
    }, PHASE1_DURATION + PHASE2_DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [handleClose]);

  // Particle canvas for Phase 2
  useEffect(() => {
    if (phase !== "site-intro") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? "#4FD1FF" : "#ffffff",
      });
    }

    // Light streaks
    const streaks: { x: number; y: number; len: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 12; i++) {
      streaks.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        len: Math.random() * 120 + 60,
        speed: Math.random() * 6 + 3,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / PHASE2_DURATION, 1);

      ctx.clearRect(0, 0, w(), h());

      // Grid lines
      ctx.strokeStyle = `rgba(79, 209, 255, ${0.06 * (1 - progress * 0.5)})`;
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      const offsetX = (elapsed * 0.02) % gridSize;
      for (let x = -gridSize + offsetX; x < w(); x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h());
        ctx.stroke();
      }
      const offsetY = (elapsed * 0.015) % gridSize;
      for (let y = -gridSize + offsetY; y < h(); y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w(), y);
        ctx.stroke();
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w();
        if (p.x > w()) p.x = 0;
        if (p.y < 0) p.y = h();
        if (p.y > h()) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (1 - progress * 0.3);
        ctx.fill();
      }

      // Light streaks (horizontal speed lines)
      ctx.globalAlpha = 1;
      for (const s of streaks) {
        s.x += s.speed;
        if (s.x > w() + s.len) {
          s.x = -s.len;
          s.y = Math.random() * h();
        }
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y);
        grad.addColorStop(0, `rgba(79, 209, 255, 0)`);
        grad.addColorStop(0.5, `rgba(79, 209, 255, ${s.alpha})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len, s.y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`intro-splash ${phase === "reveal" ? "intro-splash--reveal" : ""}`}>
      {/* Eagle cry audio */}
      <audio ref={audioRef} src="/intro/intro-audio.mp3" preload="auto" />

      {/* ═══ PHASE 1: Production Logo ═══ */}
      <div className={`intro-phase intro-phase--logo ${phase !== "logo" ? "intro-phase--exit" : ""}`}>
        {/* Radial glow behind logo */}
        <div className="intro-logo-glow" />
        {/* Floating particles around logo */}
        <div className="intro-logo-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="intro-particle" style={{
              '--delay': `${Math.random() * 2}s`,
              '--x': `${(Math.random() - 0.5) * 200}px`,
              '--y': `${(Math.random() - 0.5) * 200}px`,
              '--duration': `${2 + Math.random() * 2}s`,
            } as React.CSSProperties} />
          ))}
        </div>
        {/* Logo */}
        <div className="intro-logo-container">
          <img src={logoSrc} alt="ТС" className="intro-logo-img" />
        </div>
        {/* Company name */}
        <div className="intro-logo-text">
          <span className="intro-logo-title">ТЕХНОЛОГИСТИКА</span>
          <span className="intro-logo-divider" />
        </div>
      </div>

      {/* ═══ PHASE 2: Site Intro ═══ */}
      <div className={`intro-phase intro-phase--site ${phase === "site-intro" ? "intro-phase--active" : ""}`}>
        <canvas ref={canvasRef} className="intro-canvas" />
        <div className="intro-site-content">
          <div className="intro-site-tagline">
            <span className="intro-site-tagline-line">Маршрут</span>
            <span className="intro-site-tagline-line intro-site-tagline-line--accent">к вершине</span>
          </div>
          <div className="intro-site-subtitle">
            Перевозка автомобилей по всей России
          </div>
          <div className="intro-site-tech-badge">
            <span className="intro-badge-dot" />
            AI-Powered Logistics
          </div>
        </div>
        {/* Horizontal scan line */}
        <div className="intro-scanline" />
      </div>

      {/* ═══ Headlight reveal overlay ═══ */}
      {phase === "reveal" && (
        <div className="intro-headlight-reveal" />
      )}

      {/* Skip button */}
      <button className="intro-skip-btn" onClick={handleClose} aria-label="Пропустить">
        Пропустить
      </button>
    </div>
  );
}
