/*
 * TECHNOLOGISTIKA — 404 Not Found Page
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 * All copy in Russian, dark premium brand styling
 */
import { Link } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "#0F1115",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <Link href="/">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "3rem",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #4FD1FF 0%, #2BA8D4 100%)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 14L10 4L18 14" stroke="#0F1115" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 14L10 8L15 14" stroke="#0F1115" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "-0.02em",
              color: "#F5F7FA",
            }}
          >
            TECHNOLOGISTIKA
          </span>
        </div>
      </Link>

      {/* 404 number */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(5rem, 15vw, 10rem)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          color: "rgba(79, 209, 255, 0.12)",
          marginBottom: "1rem",
          userSelect: "none",
        }}
      >
        404
      </div>

      {/* Icon */}
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "rgba(79, 209, 255, 0.08)",
          border: "1px solid rgba(79, 209, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <MapPin size={22} style={{ color: "#4FD1FF" }} />
      </div>

      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          letterSpacing: "-0.03em",
          color: "#F5F7FA",
          marginBottom: "1rem",
        }}
      >
        Маршрут не найден
      </h1>

      <p
        style={{
          color: "#AAB3C2",
          fontSize: "1rem",
          lineHeight: 1.65,
          maxWidth: "400px",
          marginBottom: "2.5rem",
        }}
      >
        Страница, которую вы ищете, не существует или была перемещена. Вернитесь на главную.
      </p>

      <Link href="/">
        <button
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ArrowLeft size={16} />
          На главную
        </button>
      </Link>
    </div>
  );
}
