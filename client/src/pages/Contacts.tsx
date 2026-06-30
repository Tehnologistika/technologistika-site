/*
 * TECHNOLOGISTIKA — Contacts Page
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 */
import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Calculator from "@/components/Calculator";
import { CONTACTS } from "@/lib/constants";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Contacts() {
  const heroSection = useInView(0.1);
  const contactsSection = useInView(0.1);
  const calcSection = useInView(0.1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: "#0F1115", minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <section style={{ paddingTop: "140px", paddingBottom: "4rem" }}>
        <div className="container">
          <div
            ref={heroSection.ref}
            style={{
              opacity: heroSection.inView ? 1 : 0,
              transform: heroSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div className="section-badge">Контакты</div>
            <h1 className="display-lg" style={{ color: "#F5F7FA", marginBottom: "1.25rem", maxWidth: "600px" }}>
              Свяжитесь с нами
            </h1>
            <p style={{ color: "#AAB3C2", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "520px" }}>
              Ответим на вопросы, рассчитаем стоимость и организуем перевозку. Менеджер перезвонит в течение 15 минут в рабочее время.
            </p>
          </div>
        </div>
      </section>

      {/* Contacts grid */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="container">
          <div
            ref={contactsSection.ref}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1.5rem",
              opacity: contactsSection.inView ? 1 : 0,
              transform: contactsSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
            className="sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Phone */}
            <div style={{ padding: "2rem", backgroundColor: "#161A20", border: "1px solid rgba(79, 209, 255, 0.15)", borderRadius: "0.5rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Phone size={20} style={{ color: "#4FD1FF" }} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                {CONTACTS.phoneLabel}
              </div>
              <a
                href={CONTACTS.phoneHref}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#F5F7FA", textDecoration: "none", letterSpacing: "-0.02em", display: "block", marginBottom: "1rem" }}
              >
                {CONTACTS.phone}
              </a>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                {CONTACTS.phoneReserveLabel}
              </div>
              <a
                href={CONTACTS.phoneReserveHref}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#F5F7FA", textDecoration: "none", letterSpacing: "-0.02em", display: "block", marginBottom: "0.75rem" }}
              >
                {CONTACTS.phoneReserve}
              </a>
              <p style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>
                Звонки принимаем ежедневно с 8:00 до 22:00 (МСК)
              </p>
            </div>

            {/* Email */}
            <div style={{ padding: "2rem", backgroundColor: "#161A20", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Mail size={20} style={{ color: "#4FD1FF" }} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                {CONTACTS.emailLabel}
              </div>
              <a
                href={CONTACTS.emailHref}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#F5F7FA", textDecoration: "none", display: "block", marginBottom: "1rem" }}
              >
                {CONTACTS.email}
              </a>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                {CONTACTS.emailDocsLabel}
              </div>
              <a
                href={CONTACTS.emailDocsHref}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#F5F7FA", textDecoration: "none", display: "block", marginBottom: "0.75rem" }}
              >
                {CONTACTS.emailDocs}
              </a>
              <p style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>
                Ответим в течение нескольких часов в рабочее время
              </p>
            </div>

            {/* Telegram */}
            <div style={{ padding: "2rem", backgroundColor: "#161A20", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Send size={20} style={{ color: "#4FD1FF" }} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                Telegram
              </div>
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#4FD1FF", textDecoration: "none", display: "block", marginBottom: "0.5rem" }}
              >
                {CONTACTS.telegramHandle}
              </a>
              <p style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>
                Быстрый ответ в мессенджере — удобно для заявок
              </p>
            </div>

            {/* WhatsApp */}
            <div style={{ padding: "2rem", backgroundColor: "#161A20", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <MessageSquare size={20} style={{ color: "#4FD1FF" }} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                WhatsApp
              </div>
              <a
                href={CONTACTS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#F5F7FA", textDecoration: "none", display: "block", marginBottom: "0.5rem" }}
              >
                {CONTACTS.phone}
              </a>
              <p style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>
                Напишите в WhatsApp — ответим оперативно
              </p>
            </div>

            {/* Address */}
            <div style={{ padding: "2rem", backgroundColor: "#161A20", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <MapPin size={20} style={{ color: "#4FD1FF" }} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                Адрес
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#F5F7FA", marginBottom: "0.5rem" }}>
                {CONTACTS.address}
              </div>
              <p style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>
                Юридический адрес
              </p>
            </div>

            {/* Working hours */}
            <div style={{ padding: "2rem", backgroundColor: "#161A20", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Clock size={20} style={{ color: "#4FD1FF" }} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                Режим работы
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "#F5F7FA", marginBottom: "0.5rem" }}>
                Пн–Вс: 8:00 – 22:00
              </div>
              <p style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>
                Сопровождение перевозки — до выдачи авто
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator section */}
      <section
        style={{
          paddingTop: "6rem",
          paddingBottom: "6rem",
          backgroundColor: "#161A20",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container">
          <div
            ref={calcSection.ref}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              opacity: calcSection.inView ? 1 : 0,
              transform: calcSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
            className="lg:grid-cols-2"
          >
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="section-badge">Быстрая заявка</div>
              <h2 className="display-md" style={{ color: "#F5F7FA", marginBottom: "1.25rem" }}>
                Оставьте заявку<br />на расчёт
              </h2>
              <p style={{ color: "#AAB3C2", fontSize: "1rem", lineHeight: 1.65 }}>
                Заполните форму — менеджер свяжется с вами и подтвердит окончательную стоимость после проверки маршрута, состояния автомобиля и наличия места на автовозе. Без скрытых доплат, с договором и страховкой.
              </p>
            </div>
            <div style={{ backgroundColor: "#1C2028", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem", padding: "2rem" }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#F5F7FA", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
                Оставить заявку
              </h3>
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
