/*
 * TECHNOLOGISTIKA — Footer Component
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 * Dark premium footer with full contact info
 */
import { Link } from "wouter";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { CONTACTS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A0D10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-3 mb-5">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "linear-gradient(135deg, #4FD1FF 0%, #2BA8D4 100%)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M2 14L10 4L18 14" stroke="#0F1115" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 14L10 8L15 14" stroke="#0F1115" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  </svg>
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", color: "#F5F7FA" }}>
                  TECHNOLOGISTIKA
                </span>
              </div>
            </Link>
            <p style={{ color: "#AAB3C2", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Профессиональная перевозка автомобилей по России и СНГ. Собственный парк автовозов Lohr и сеть из более чем 30 партнёров-перевозчиков.
            </p>
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1rem",
                backgroundColor: "rgba(79, 209, 255, 0.1)",
                border: "1px solid rgba(79, 209, 255, 0.2)",
                borderRadius: "0.25rem",
                color: "#4FD1FF",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <Send size={14} />
              Написать в Telegram
            </a>
          </div>

          {/* Services column */}
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F5F7FA", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Услуги
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { href: "/services/avtovozy", label: "Перевозка автовозами" },
                { href: "/services", label: "Межгород / РФ" },
                { href: "/services", label: "СНГ / Международные" },
                { href: "/services", label: "Для дилеров и бизнеса" },
              ].map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href}>
                    <span style={{ color: "#AAB3C2", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.15s ease", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F7FA")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#AAB3C2")}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F5F7FA", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Компания
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { href: "/about", label: "О компании" },
                { href: "/contacts", label: "Контакты" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span style={{ color: "#AAB3C2", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.15s ease", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F7FA")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#AAB3C2")}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts column */}
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#F5F7FA", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Контакты
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <a
                href={CONTACTS.phoneHref}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#F5F7FA", textDecoration: "none", fontSize: "0.9375rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
              >
                <Phone size={15} style={{ color: "#4FD1FF", flexShrink: 0 }} />
                {CONTACTS.phone}
              </a>
              <a
                href={CONTACTS.emailHref}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#AAB3C2", textDecoration: "none", fontSize: "0.875rem" }}
              >
                <Mail size={15} style={{ color: "#4FD1FF", flexShrink: 0 }} />
                {CONTACTS.email}
              </a>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#AAB3C2", fontSize: "0.875rem" }}>
                <MapPin size={15} style={{ color: "#4FD1FF", flexShrink: 0, marginTop: "2px" }} />
                <span>{CONTACTS.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p style={{ color: "#AAB3C2", fontSize: "0.8125rem" }}>
              © 2025 Technologistika. Все права защищены.
            </p>
            <p style={{ color: "#AAB3C2", fontSize: "0.8125rem", fontFamily: "'Space Mono', monospace" }}>
              Перевозка автомобилей по России и СНГ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
