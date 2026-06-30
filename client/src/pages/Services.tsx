/*
 * TECHNOLOGISTIKA — Services Overview Page
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Truck, MapPin, Globe, Building2, Shield, Clock, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const services = [
  {
    id: "avtovozy",
    icon: <Truck size={28} style={{ color: "#4FD1FF" }} />,
    title: "Перевозка автовозами",
    subtitle: "Флагманская услуга",
    desc: "Собственный парк европейских автовозов Lohr с гидравлическими платформами и более 30 проверенных партнёров-перевозчиков, с которыми мы работаем на особых условиях. Бережная погрузка, надёжная фиксация, полная страховка.",
    features: ["Автовозы Lohr с гидравлическими платформами", "Более 30 партнёров-перевозчиков", "Полная страховка на 100% стоимости", "GPS-отслеживание на всём маршруте", "Акт осмотра при приёмке и сдаче"],
    href: "/services/avtovozy",
    featured: true,
  },
  {
    id: "intercity",
    icon: <MapPin size={28} style={{ color: "#4FD1FF" }} />,
    title: "Межгород по РФ",
    subtitle: "По всей России",
    desc: "Доставка автомобилей между городами России с гарантией сроков. Более 50 городов в нашей сети — от Москвы и Санкт-Петербурга до Краснодара, Екатеринбурга, Новосибирска и Владивостока.",
    features: ["50+ городов России", "Гарантия сроков доставки", "Полная страховка", "Персональный менеджер", "Договор с фиксированной ценой"],
    href: "/services",
    featured: false,
  },
  {
    id: "sng",
    icon: <Globe size={28} style={{ color: "#4FD1FF" }} />,
    title: "СНГ и международные",
    subtitle: "За пределами России",
    desc: "Перевозки в Казахстан, Беларусь и другие страны СНГ с таможенным сопровождением. Мы берём на себя оформление документов и координацию на всех границах.",
    features: ["Казахстан, Беларусь, другие страны СНГ", "Таможенное сопровождение", "Помощь с документами", "Страховка на международных маршрутах", "Опытные водители"],
    href: "/services",
    featured: false,
  },
  {
    id: "dealers",
    icon: <Building2 size={28} style={{ color: "#4FD1FF" }} />,
    title: "Для дилеров и бизнеса",
    subtitle: "B2B-логистика",
    desc: "Специальные условия для автосалонов, дилерских центров, импортёров и логистических партнёров. Объёмные перевозки, приоритетная обработка заявок, персональный менеджер и индивидуальные тарифы.",
    features: ["Индивидуальные тарифы для объёмов", "Приоритетная обработка заявок", "Персональный менеджер", "Отсрочка платежа для партнёров", "Регулярные маршруты под потребности"],
    href: "/services",
    featured: false,
  },
];

export default function Services() {
  const heroSection = useInView(0.1);
  const servicesSection = useInView(0.1);
  const ctaSection = useInView(0.1);

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
            <div className="section-badge">Услуги</div>
            <h1 className="display-lg" style={{ color: "#F5F7FA", marginBottom: "1.25rem", maxWidth: "600px" }}>
              Полный спектр услуг<br />по перевозке автомобилей
            </h1>
            <p style={{ color: "#AAB3C2", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "560px" }}>
              Для частных клиентов, автосалонов, импортёров и крупного бизнеса — мы перевозим любые автомобили по всей России и СНГ с полной страховкой и гарантией сроков.
            </p>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="container">
          <div
            ref={servicesSection.ref}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              opacity: servicesSection.inView ? 1 : 0,
              transform: servicesSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: service.featured ? "#161A20" : "#161A20",
                  border: service.featured ? "1px solid rgba(79, 209, 255, 0.2)" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0" }} className="md:grid-cols-3">
                  {/* Left: info */}
                  <div style={{ padding: "2rem", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ marginBottom: "1rem" }}>{service.icon}</div>
                    {service.featured && (
                      <div style={{ display: "inline-block", padding: "0.2rem 0.625rem", backgroundColor: "rgba(79, 209, 255, 0.1)", border: "1px solid rgba(79, 209, 255, 0.2)", borderRadius: "0.125rem", fontFamily: "'Space Mono', monospace", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4FD1FF", marginBottom: "0.75rem" }}>
                        {service.subtitle}
                      </div>
                    )}
                    {!service.featured && (
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.08em", color: "#AAB3C2", marginBottom: "0.5rem" }}>
                        {service.subtitle}
                      </div>
                    )}
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.375rem", color: "#F5F7FA", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                      {service.title}
                    </h2>
                    <Link href={service.href}>
                      <button
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#4FD1FF",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        Подробнее <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>

                  {/* Middle: description */}
                  <div style={{ padding: "2rem", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ color: "#C9D4E3", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                      {service.desc}
                    </p>
                  </div>

                  {/* Right: features */}
                  <div style={{ padding: "2rem" }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {service.features.map((feat) => (
                        <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "rgba(79, 209, 255, 0.1)", border: "1px solid rgba(79, 209, 255, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3 5.5L6.5 2" stroke="#4FD1FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section style={{ paddingTop: "4rem", paddingBottom: "4rem", backgroundColor: "#161A20", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "1.5rem" }} className="sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Shield size={20} style={{ color: "#4FD1FF" }} />, title: "Полная страховка", desc: "100% стоимости автомобиля" },
              { icon: <Clock size={20} style={{ color: "#4FD1FF" }} />, title: "Гарантия сроков", desc: "SLA выполнения 98%" },
              { icon: <MapPin size={20} style={{ color: "#4FD1FF" }} />, title: "GPS-контроль", desc: "Отслеживание 24/7" },
              { icon: <Truck size={20} style={{ color: "#4FD1FF" }} />, title: "Собственный парк", desc: "Автовозы Lohr" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "0.25rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#F5F7FA", marginBottom: "0.125rem" }}>{item.title}</div>
                  <div style={{ color: "#AAB3C2", fontSize: "0.8125rem" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div
            ref={ctaSection.ref}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1.5rem",
              opacity: ctaSection.inView ? 1 : 0,
              transform: ctaSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <h2 className="display-md" style={{ color: "#F5F7FA", maxWidth: "500px" }}>
              Нужна консультация?
            </h2>
            <p style={{ color: "#AAB3C2", fontSize: "1rem", maxWidth: "400px", lineHeight: 1.6 }}>
              Позвоните или напишите — поможем выбрать подходящую услугу и рассчитаем стоимость.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <Link href="/#calculator">
                <button className="btn-primary">
                  Рассчитать ориентировочно
                  <ArrowRight size={16} />
                </button>
              </Link>
              <a href={CONTACTS.phoneHref}>
                <button className="btn-secondary">
                  <Phone size={15} />
                  {CONTACTS.phone}
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
