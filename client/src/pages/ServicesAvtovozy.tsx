/*
 * TECHNOLOGISTIKA — /services/avtovozy Page
 * SEO target: перевозка автомобилей автовозами, автовозы Lohr
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Truck, Shield, Clock, MapPin, CheckCircle, Phone, Send } from "lucide-react";
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

const steps = [
  { num: "01", title: "Заявка и расчёт", desc: "Оставьте заявку онлайн или позвоните. Менеджер свяжется с вами, рассчитает ориентировочную стоимость и подтвердит окончательную цену после проверки деталей." },
  { num: "02", title: "Договор и страховка", desc: "Заключаем договор с фиксированной ценой. Оформляем страховку на 100% стоимости автомобиля." },
  { num: "03", title: "Приёмка и осмотр", desc: "Составляем акт осмотра с фотофиксацией. Ваш автомобиль принимается в точно зафиксированном состоянии." },
  { num: "04", title: "Перевозка и контроль", desc: "GPS-отслеживание на всём маршруте. Вы можете следить за движением в реальном времени." },
  { num: "05", title: "Сдача и акт", desc: "При получении составляем акт сдачи. Если всё в порядке — подписываем. Если нет — страховка покрывает ущерб." },
];

const faq = [
  { q: "Какие автомобили можно перевозить?", a: "Любые легковые автомобили: седаны, внедорожники, кроссоверы, минивэны, спортивные и премиальные автомобили, электромобили. Для особо ценных или нестандартных автомобилей предусмотрены специальные условия." },
  { q: "Как рассчитывается стоимость?", a: "Стоимость зависит от маршрута (расстояния), автомобиля, состояния авто, даты отправки и наличия места на автовозе. Заполните форму — менеджер рассчитает ориентировочную стоимость и подтвердит окончательную цену после проверки деталей. Итоговая цена фиксируется в договоре и не меняется." },
  { q: "Что такое автовоз Lohr?", a: "Lohr — ведущий европейский производитель автовозов. Их отличительная черта — гидравлические платформы, которые позволяют погружать автомобили с минимальным клиренсом без риска повреждений. Мы используем автовозы Lohr в собственном парке." },
  { q: "Что если автомобиль будет повреждён?", a: "Каждый автомобиль застрахован на 100% стоимости. При приёмке и сдаче составляется акт осмотра с фотофиксацией. В случае ущерба — страховая компания возмещает стоимость ремонта или полную стоимость автомобиля." },
  { q: "Как долго идёт перевозка?", a: "Сроки зависят от маршрута. Москва — Краснодар: 2–3 дня. Москва — Новосибирск: 5–7 дней. Москва — Владивосток: 14–18 дней. Точные сроки фиксируются в договоре." },
  { q: "Можно ли перевозить автомобиль с вещами внутри?", a: "Нет. По правилам страхования и безопасности перевозки, в автомобиле не должно быть личных вещей, документов или ценностей. Мы обязательно предупреждаем об этом при оформлении." },
];

export default function ServicesAvtovozy() {
  const heroSection = useInView(0.1);
  const fleetSection = useInView(0.1);
  const processSection = useInView(0.1);
  const calcSection = useInView(0.1);
  const faqSection = useInView(0.1);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: "#0F1115", minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <section
        style={{
          paddingTop: "0",
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663490180314/YbgXRCtSxpgqz345bJLVUX/services-avtovozy_3c7411ef.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,17,21,0.95) 0%, rgba(15,17,21,0.75) 55%, rgba(15,17,21,0.45) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to top, #0F1115, transparent)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "140px", paddingBottom: "5rem" }}>
          <div
            ref={heroSection.ref}
            style={{
              maxWidth: "680px",
              opacity: heroSection.inView ? 1 : 0,
              transform: heroSection.inView ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease-out",
            }}
          >
            <div className="section-badge">Перевозка автовозами</div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.0,
                color: "#F5F7FA",
                marginBottom: "1.5rem",
              }}
            >
              Перевозка автомобилей<br />
              <span style={{ color: "#4FD1FF" }}>автовозами Lohr</span>
            </h1>
            <p style={{ color: "#C9D4E3", fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "560px" }}>
              Собственный парк европейских автовозов Lohr с гидравлическими платформами и более 30 проверенных партнёров-перевозчиков, с которыми мы работаем на особых условиях. Бережная погрузка, полная страховка, гарантия сроков.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <a href="#calculator-avtovozy">
                <button className="btn-primary">
                  Рассчитать ориентировочно
                  <ArrowRight size={16} />
                </button>
              </a>
              <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer">
                <button className="btn-secondary">
                  <Send size={15} />
                  Написать в Telegram
                </button>
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {["Автовозы Lohr", "Страховка 100%", "GPS 24/7", "Договор"].map((badge) => (
                <div key={badge} className="trust-badge">{badge}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet section */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem", backgroundColor: "#161A20", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div
            ref={fleetSection.ref}
            style={{
              opacity: fleetSection.inView ? 1 : 0,
              transform: fleetSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="lg:grid-cols-2">
              {/* Own fleet */}
              <div style={{ padding: "2rem", backgroundColor: "#1C2028", border: "1px solid rgba(79, 209, 255, 0.15)", borderRadius: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Truck size={24} style={{ color: "#4FD1FF" }} />
                  </div>
                  <div>
                    <div className="label-mono" style={{ marginBottom: "0.25rem" }}>Собственный парк</div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#F5F7FA", letterSpacing: "-0.02em" }}>
                      Автовозы Lohr
                    </h3>
                  </div>
                </div>
                <p style={{ color: "#C9D4E3", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Европейские автовозы Lohr с гидравлическими платформами — стандарт безопасной перевозки автомобилей. Гидравлика позволяет погружать автомобили с минимальным клиренсом без риска повреждений.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {["Гидравлические платформы для бережной погрузки", "Надёжная многоточечная фиксация", "Вместимость до 8 автомобилей", "Регулярное техническое обслуживание", "Опытные водители с многолетним стажем"].map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <CheckCircle size={14} style={{ color: "#4FD1FF", flexShrink: 0 }} />
                      <span style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Partner network */}
              <div style={{ padding: "2rem", backgroundColor: "#1C2028", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "0.375rem", backgroundColor: "rgba(245, 183, 79, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="#F5B74F" strokeWidth="1.5"/>
                      <circle cx="4" cy="6" r="2" stroke="#F5B74F" strokeWidth="1.5"/>
                      <circle cx="20" cy="6" r="2" stroke="#F5B74F" strokeWidth="1.5"/>
                      <circle cx="4" cy="18" r="2" stroke="#F5B74F" strokeWidth="1.5"/>
                      <circle cx="20" cy="18" r="2" stroke="#F5B74F" strokeWidth="1.5"/>
                      <path d="M6 7L9.5 10M14.5 10L18 7M6 17L9.5 14M14.5 14L18 17" stroke="#F5B74F" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#F5B74F", marginBottom: "0.25rem" }}>Партнёрская сеть</div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#F5F7FA", letterSpacing: "-0.02em" }}>
                      30+ партнёров
                    </h3>
                  </div>
                </div>
                <p style={{ color: "#C9D4E3", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Более 30 проверенных партнёров-грузоперевозчиков, с которыми мы работаем на особых условиях. Это даёт нам гибкость маршрутов и возможность организовать перевозку в любую точку России.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {["Проверенные партнёры с подтверждённой репутацией", "Особые условия сотрудничества", "Охват всех регионов России", "Единый стандарт страховки и документов", "Контроль качества на каждом маршруте"].map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <CheckCircle size={14} style={{ color: "#F5B74F", flexShrink: 0 }} />
                      <span style={{ color: "#AAB3C2", fontSize: "0.875rem" }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="container">
          <div
            ref={processSection.ref}
            style={{
              opacity: processSection.inView ? 1 : 0,
              transform: processSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div style={{ marginBottom: "3rem" }}>
              <div className="section-badge">Как это работает</div>
              <h2 className="display-md" style={{ color: "#F5F7FA" }}>
                Процесс перевозки<br />шаг за шагом
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: "1.5rem",
                    paddingBottom: i < steps.length - 1 ? "2rem" : "0",
                    position: "relative",
                  }}
                >
                  {/* Number + line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(79, 209, 255, 0.1)",
                      border: "1px solid rgba(79, 209, 255, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#4FD1FF",
                      flexShrink: 0,
                    }}>
                      {step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ width: "1px", flex: 1, backgroundColor: "rgba(79, 209, 255, 0.15)", marginTop: "0.5rem" }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ paddingTop: "0.625rem", paddingBottom: i < steps.length - 1 ? "1rem" : "0" }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.0625rem", color: "#F5F7FA", letterSpacing: "-0.015em", marginBottom: "0.5rem" }}>
                      {step.title}
                    </h3>
                    <p style={{ color: "#AAB3C2", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section
        id="calculator-avtovozy"
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
              <div className="section-badge">Расчёт стоимости</div>
              <h2 className="display-md" style={{ color: "#F5F7FA", marginBottom: "1.25rem" }}>
                Ориентировочный расчёт<br />перевозки автовозом
              </h2>
              <p style={{ color: "#AAB3C2", fontSize: "1rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                Укажите маршрут и автомобиль — менеджер свяжется с вами и подтвердит окончательную стоимость после проверки маршрута, состояния авто и наличия места на автовозе. Итоговая цена фиксируется в договоре.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href={CONTACTS.phoneHref} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
                  <Phone size={16} style={{ color: "#4FD1FF" }} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.0625rem", color: "#F5F7FA" }}>{CONTACTS.phone}</span>
                </a>
                <a href={CONTACTS.emailHref} style={{ color: "#AAB3C2", fontSize: "0.875rem", textDecoration: "none" }}>{CONTACTS.email}</a>
              </div>
            </div>
            <div style={{ backgroundColor: "#1C2028", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.5rem", padding: "2rem" }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#F5F7FA", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
                Заявка на расчёт
              </h3>
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="container">
          <div
            ref={faqSection.ref}
            style={{
              opacity: faqSection.inView ? 1 : 0,
              transform: faqSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div style={{ marginBottom: "3rem" }}>
              <div className="section-badge">Вопросы и ответы</div>
              <h2 className="display-md" style={{ color: "#F5F7FA" }}>
                Часто задают
              </h2>
            </div>

            <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {faq.map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#161A20",
                    border: "1px solid",
                    borderColor: openFaq === i ? "rgba(79, 209, 255, 0.2)" : "rgba(255,255,255,0.07)",
                    borderRadius: "0.375rem",
                    overflow: "hidden",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.25rem 1.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9375rem", color: "#F5F7FA", letterSpacing: "-0.01em" }}>
                      {item.q}
                    </span>
                    <span style={{ color: "#4FD1FF", flexShrink: 0, fontSize: "1.25rem", lineHeight: 1 }}>
                      {openFaq === i ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 1.5rem 1.25rem", color: "#AAB3C2", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: "5rem", paddingBottom: "5rem", backgroundColor: "#0A0D10", borderTop: "1px solid rgba(79, 209, 255, 0.12)" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
            <h2 className="display-md" style={{ color: "#F5F7FA", maxWidth: "500px" }}>
              Готовы организовать перевозку?
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <a href="#calculator-avtovozy">
                <button className="btn-primary">
                  Рассчитать ориентировочно
                  <ArrowRight size={16} />
                </button>
              </a>
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
