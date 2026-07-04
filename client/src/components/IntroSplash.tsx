/**
 * IntroSplash — Premium intro splash screen for ТехноЛогистика
 *
 * Sequence:
 * 1. Logo reveal phase: white screen, B&W logo fades in with eagle cry sound
 * 2. Tech video phase: user's HUD/city video plays automatically after logo
 * 3. Fade out and reveal the site
 *
 * Behavior:
 * - Shows only on the home page, once per session.
 * - Uses sessionStorage (technologistikaIntroShownSession) to avoid repeat within a session.
 * - Uses localStorage (technologistikaIntroLastShownAt) to enforce a 3-hour cooldown (10800000 ms).
 * - Respects prefers-reduced-motion: shows a brief static version or skips entirely.
 * - Gracefully handles missing video/audio files.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import logoSrc from "@/assets/technologistika-logo-transparent.png";
import "./IntroSplash.css";

const SESSION_KEY = "technologistikaIntroShownSession";
const LAST_SHOWN_KEY = "technologistikaIntroLastShownAt";
const COOLDOWN_MS = 10800000; // 3 hours

/** Determine whether the splash should be displayed */
export function shouldShowIntro(): boolean {
  try {
    // Already shown this session
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      return false;
    }
    // Check cooldown
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    if (lastShown) {
      const elapsed = Date.now() - Number(lastShown);
      if (elapsed < COOLDOWN_MS) {
        return false;
      }
    }
    return true;
  } catch {
    // Storage unavailable (private browsing, etc.)
    return false;
  }
}

/** Mark the intro as shown */
function markShown(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {
    // Silently ignore storage errors
  }
}

type Phase = "logo" | "tech-video" | "fadeout" | "done";

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState<Phase>("logo");
  const [isMuted, setIsMuted] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const techVideoRef = useRef<HTMLVideoElement>(null);
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  // Mark as shown on mount
  useEffect(() => {
    markShown();
  }, []);

  // Phase 1: Logo reveal with eagle sound
  useEffect(() => {
    if (prefersReducedMotion) {
      // Show static version briefly then close
      logoTimerRef.current = setTimeout(() => {
        handleClose();
      }, 2500);
      return () => {
        if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
      };
    }

    // Auto-play eagle sound (will work since it's muted by default,
    // but we attempt unmuted play — browsers may block it)
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(() => {
        // Browser blocked audio — silently ignore
      });
    }

    // After logo animation (4.5 seconds), transition to tech video
    logoTimerRef.current = setTimeout(() => {
      setPhase("tech-video");
    }, 4500);

    return () => {
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // Phase 2: Tech video autoplay
  useEffect(() => {
    if (phase !== "tech-video") return;

    const video = techVideoRef.current;
    if (!video) {
      // Video element not available, close after brief delay
      setTimeout(() => handleClose(), 500);
      return;
    }

    // Attempt to play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked or video failed — close splash
        handleClose();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleClose = useCallback(() => {
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPhase("fadeout");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 600);
  }, [onComplete]);

  const handleTechVideoEnded = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleTechVideoError = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      // Control audio element
      if (audioRef.current) {
        if (next) {
          audioRef.current.volume = 0;
        } else {
          audioRef.current.volume = 0.7;
          audioRef.current.play().catch(() => {});
        }
      }
      // Control tech video
      if (techVideoRef.current) {
        techVideoRef.current.muted = next;
      }
      return next;
    });
  }, []);

  const handleSkip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (techVideoRef.current) {
      techVideoRef.current.pause();
    }
    handleClose();
  }, [handleClose]);

  if (phase === "done") return null;

  const isFadingOut = phase === "fadeout";

  return (
    <div
      className={`intro-splash ${isFadingOut ? "intro-splash--fadeout" : ""}`}
      aria-label="Intro splash screen"
      role="dialog"
      aria-modal="true"
    >
      {/* Eagle cry audio — plays during logo phase */}
      <audio
        ref={audioRef}
        src="/intro/intro-audio.mp3"
        preload="auto"
      />

      {/* ═══ PHASE 1: Logo Reveal ═══ */}
      {(phase === "logo" || (phase === "tech-video" && false)) && (
        <div className={`intro-splash__logo-phase ${phase !== "logo" ? "intro-splash__logo-phase--exit" : ""}`}>
          <div className="intro-splash__bg" />
          <div className="intro-splash__logo-content">
            <div className="intro-splash__logo-wrap intro-splash__logo-wrap--animate">
              <img
                src={logoSrc}
                alt="ТехноЛогистика"
                className="intro-splash__logo"
              />
            </div>
            <div className="intro-splash__text-wrap">
              <h1 className="intro-splash__title">ТехноЛогистика</h1>
              <p className="intro-splash__subtitle">Маршрут к вершине</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PHASE 2: Tech Video ═══ */}
      {phase === "tech-video" && (
        <div className="intro-splash__video-phase">
          <video
            ref={techVideoRef}
            className="intro-splash__video"
            muted
            playsInline
            onEnded={handleTechVideoEnded}
            onError={handleTechVideoError}
          >
            <source src="/intro/intro-tech-video.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* ═══ Reduced motion fallback ═══ */}
      {prefersReducedMotion && phase === "logo" && (
        <div className="intro-splash__fallback">
          <div className="intro-splash__bg" />
          <div className="intro-splash__logo-content">
            <div className="intro-splash__logo-wrap" style={{ opacity: 1, transform: "scale(1)" }}>
              <img
                src={logoSrc}
                alt="ТехноЛогистика"
                className="intro-splash__logo"
              />
            </div>
            <div className="intro-splash__text-wrap" style={{ opacity: 1 }}>
              <h1 className="intro-splash__title">ТехноЛогистика</h1>
              <p className="intro-splash__subtitle">Маршрут к вершине</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Controls ═══ */}
      <div className="intro-splash__controls">
        {/* Mute/unmute button */}
        <button
          className="intro-splash__btn intro-splash__btn--sound"
          onClick={toggleMute}
          aria-label={isMuted ? "Включить звук" : "Выключить звук"}
          title={isMuted ? "Включить звук" : "Выключить звук"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>

        {/* Skip button */}
        <button
          className="intro-splash__btn intro-splash__btn--skip"
          onClick={handleSkip}
          aria-label="Пропустить"
        >
          Пропустить
        </button>
      </div>
    </div>
  );
}
