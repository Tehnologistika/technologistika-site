/**
 * IntroSplash — Premium intro splash screen for ТехноЛогистика
 *
 * Sequence:
 * 1. Logo reveal phase (3.5s): white screen, B&W logo fades in with eagle cry sound
 * 2. Tech video phase: existing intro-tech-video.mp4 plays fullscreen (object-fit: cover)
 * 3. Fade out and reveal the site
 *
 * Behavior:
 * - Shows only on the home page, once per session.
 * - Uses sessionStorage to avoid repeat within a session.
 * - Uses localStorage to enforce a 3-hour cooldown.
 * - Video autoplays muted with playsInline — no play button needed.
 * - Failsafe: max 8 seconds total, then close regardless.
 * - If video fails to load/play — close immediately, don't block site.
 * - Always-visible "Пропустить" button.
 * - Respects prefers-reduced-motion.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import logoSrc from "@/assets/technologistika-logo-transparent.png";
import "./IntroSplash.css";

const SESSION_KEY = "technologistikaIntroShownSession";
const LAST_SHOWN_KEY = "technologistikaIntroLastShownAt";
const COOLDOWN_MS = 10800000; // 3 hours
const LOGO_DURATION_MS = 3500; // Logo phase duration
const FAILSAFE_TIMEOUT_MS = 8000; // Max total duration

/** Determine whether the splash should be displayed */
export function shouldShowIntro(): boolean {
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      return false;
    }
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    if (lastShown) {
      const elapsed = Date.now() - Number(lastShown);
      if (elapsed < COOLDOWN_MS) {
        return false;
      }
    }
    return true;
  } catch {
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const techVideoRef = useRef<HTMLVideoElement>(null);
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedRef = useRef(false);

  // Close handler — ensures we only close once
  const handleClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;

    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Stop video
    if (techVideoRef.current) {
      techVideoRef.current.pause();
    }
    // Clear timers
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);

    setPhase("fadeout");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 600);
  }, [onComplete]);

  // Mark as shown on mount
  useEffect(() => {
    markShown();
  }, []);

  // Failsafe: close after max duration no matter what
  useEffect(() => {
    failsafeTimerRef.current = setTimeout(() => {
      handleClose();
    }, FAILSAFE_TIMEOUT_MS);

    return () => {
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
    };
  }, [handleClose]);

  // Check reduced motion preference — skip intro
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setTimeout(() => handleClose(), 500);
    }
  }, [handleClose]);

  // Phase 1: Logo reveal with eagle sound
  useEffect(() => {
    // Try to play eagle cry audio
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(() => {
        // Browser blocked audio — silently ignore
      });
    }

    // After logo animation, transition to tech video
    logoTimerRef.current = setTimeout(() => {
      if (!closedRef.current) {
        setPhase("tech-video");
      }
    }, LOGO_DURATION_MS);

    return () => {
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phase 2: Tech video autoplay
  useEffect(() => {
    if (phase !== "tech-video") return;

    const video = techVideoRef.current;
    if (!video) {
      // Video element not available — close
      handleClose();
      return;
    }

    // Attempt to play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked or video failed — close splash immediately
        handleClose();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleTechVideoEnded = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleTechVideoError = useCallback(() => {
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
      {phase === "logo" && (
        <div className="intro-splash__logo-phase">
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

      {/* ═══ PHASE 2: Tech Video — fullscreen, no controls ═══ */}
      {phase === "tech-video" && (
        <div className="intro-splash__video-phase">
          <video
            ref={techVideoRef}
            className="intro-splash__video"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleTechVideoEnded}
            onError={handleTechVideoError}
          >
            <source src="/intro/intro-tech-video.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* ═══ Skip button — always visible ═══ */}
      <button
        className="intro-splash__btn intro-splash__btn--skip"
        onClick={handleClose}
        aria-label="Пропустить"
      >
        Пропустить
      </button>
    </div>
  );
}
