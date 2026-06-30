/*
 * TECHNOLOGISTIKA — Header Component
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 * Premium dark navigation with mobile hamburger menu
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { CONTACTS, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(15, 17, 21, 0.97)" : "rgba(15, 17, 21, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between" style={{ height: "68px" }}>
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 group">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "linear-gradient(135deg, #4FD1FF 0%, #2BA8D4 100%)",
                    borderRadius: "4px",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 14L10 4L18 14" stroke="#0F1115" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 14L10 8L15 14" stroke="#0F1115" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.0625rem",
                      letterSpacing: "-0.02em",
                      color: "#F5F7FA",
                      lineHeight: 1,
                    }}
                  >
                    TECHNOLOGISTIKA
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.12em",
                      color: "#4FD1FF",
                      textTransform: "uppercase",
                      lineHeight: 1,
                      marginTop: "2px",
                    }}
                  >
                    АВТОЛОГИСТИКА
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="nav-link"
                    style={{
                      color: location === link.href ? "#4FD1FF" : "#AAB3C2",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={CONTACTS.phoneHref}
                className="flex items-center gap-2"
                style={{
                  color: "#F5F7FA",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                }}
              >
                <Phone size={15} style={{ color: "#4FD1FF" }} />
                {CONTACTS.phone}
              </a>
              <Link href="/#calculator">
                <button className="btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}>
                  Рассчитать ориентировочно
                </button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center"
              style={{ width: "40px", height: "40px", color: "#F5F7FA" }}
              onClick={() => setMobileOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 z-50 md:hidden"
        style={{
          backgroundColor: "#0F1115",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.0625rem", letterSpacing: "-0.02em", color: "#F5F7FA" }}>
                TECHNOLOGISTIKA
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ color: "#AAB3C2" }}
              aria-label="Закрыть меню"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile nav links */}
          <nav className="flex flex-col gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  style={{
                    padding: "1rem 0",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    letterSpacing: "-0.02em",
                    color: location === link.href ? "#4FD1FF" : "#F5F7FA",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile contact */}
          <div className="mt-auto pt-8 flex flex-col gap-4">
            <a
              href={CONTACTS.phoneHref}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#F5F7FA",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <Phone size={18} style={{ color: "#4FD1FF" }} />
              {CONTACTS.phone}
            </a>
            <Link href="/#calculator">
              <button className="btn-primary w-full justify-center" style={{ width: "100%" }}>
                Рассчитать ориентировочно
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
