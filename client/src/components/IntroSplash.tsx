/**
 * IntroSplash — Premium intro splash screen for ТехноЛогистика
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

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState<"loading" | "playing" | "fadeout" | "done">("loading");
  const [isMuted, setIsMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  // Mark as shown on mount
  useEffect(() => {
    markShown();
  }, []);

  // Start playback or fallback
  useEffect(() => {
    if (prefersReducedMotion) {
      // Show static version briefly then close
      setPhase("playing");
      const timer = setTimeout(() => {
        handleClose();
      }, 2500);
      return () => clearTimeout(timer);
    }

    // Set a safety timeout — if video doesn't start within 4s, use fallback
    fallbackTimerRef.current = setTimeout(() => {
      if (phase === "loading") {
        setVideoFailed(true);
        setPhase("playing");
        // Auto-close fallback after 4 seconds
        setTimeout(() => handleClose(), 4000);
      }
    }, 4000);

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  const handleVideoCanPlay = useCallback(() => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setPhase("playing");
  }, []);

  const handleVideoError = useCallback(() => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setVideoFailed(true);
    setPhase("playing");
    // Auto-close after fallback animation
    setTimeout(() => handleClose(), 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoEnded = useCallback(() => {
    handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = useCallback(() => {
    setPhase("fadeout");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 600);
  }, [onComplete]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {
            // Browser blocked audio — silently ignore
          });
        }
      }
      return next;
    });
  }, []);

  const handleSkip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    handleClose();
  }, [handleClose]);

  if (phase === "done") return null;

  return (
    <div
      className={`intro-splash ${phase === "fadeout" ? "intro-splash--fadeout" : ""}`}
      aria-label="Intro splash screen"
      role="dialog"
      aria-modal="true"
    >
      {/* Background layer */}
      <div className="intro-splash__bg" />

      {/* Video layer */}
      {!videoFailed && !prefersReducedMotion && (
        <video
          ref={videoRef}
          className="intro-splash__video"
          muted
          autoPlay
          playsInline
          poster="/intro/intro-poster.webp"
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
          onEnded={handleVideoEnded}
        >
          <source src="/intro/intro-video.webm" type="video/webm" />
          <source src="/intro/intro-video.mp4" type="video/mp4" />
        </video>
      )}

      {/* Audio element (separate from video for mute control) */}
      <audio ref={audioRef} src="/intro/intro-audio.mp3" preload="auto" />

      {/* Fallback / static content (shown when video fails or reduced motion) */}
      {(videoFailed || prefersReducedMotion) && (
        <div className="intro-splash__fallback">
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
      )}

      {/* Overlay text (shown over video) */}
      {!videoFailed && !prefersReducedMotion && phase === "playing" && (
        <div className="intro-splash__overlay">
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
      )}

      {/* Controls */}
      <div className="intro-splash__controls">
        {/* Mute/unmute button */}
        {!videoFailed && !prefersReducedMotion && (
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
        )}

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
