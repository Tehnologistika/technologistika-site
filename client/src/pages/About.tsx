/*
 * TECHNOLOGISTIKA — О компании Page
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Truck, Users, MapPin, Shield, Phone, Route, ShieldCheck, FileText, Scale, Mountain, Compass, HeartHandshake } from "lucide-react";
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

export default function About() {
  const heroSection = useInView(0.1);
  const missionSection = useInView(0.1);
  const valuesSection = useInView(0.1);
  const yarusySection = useInView(0.1);
  const rolesSection = useInView(0.1);
  const teamSection = useInView(0.1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: "#0F1115", minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <section
        style={{
          paddingTop: "140px",
          paddingBottom: "5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663490180314/YbgXRCtSxpgqz345bJLVUX/about-section_4eb49a1e.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,17,21,0.97) 0%, rgba(15,17,21,0.85) 100%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            ref={heroSection.ref}
            style={{
              opacity: heroSection.inView ? 1 : 0,
              transform: heroSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div className="section-badge">О компании</div>
            <h1 className="display-lg" style={{ color: "#F5F7FA", marginBottom: "1.5rem", maxWidth: "700px" }}>
              Логистика с характером.<br />
              <span style={{ color: "#4FD1FF" }}>Надёжность без компромиссов.</span>
            </h1>
            <p style={{ color: "#AAB3C2", fontSize: "1.0625rem", lineHeight: 1.7, maxWidth: "580px" }}>
              Мы организуем перевозку автомобилей по всей России и СНГ. Работаем с проверенными перевозчиками, подбираем автовоз под маршрут и автомобиль и сопровождаем перевозку до выдачи — с договором на каждом этапе.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: "#161A20", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container py-10">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }} className="sm:grid-cols-4">
            {[
              { value: "50+", label: "городов России и СНГ" },
              { value: "30+", label: "проверенных перевозчиков" },
              { value: "8", label: "автомобилей на автовозе" },
              { value: "5", label: "этапов с фотофиксацией" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "#F5F7FA", letterSpacing: "-0.03em" }}>
                  {stat.value}
                </div>
                <div style={{ color: "#AAB3C2", fontSize: "0.8125rem", marginTop: "0.375rem" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="container">
          <div
            ref={missionSection.ref}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "center",
              opacity: missionSection.inView ? 1 : 0,
              transform: missionSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
            className="lg:grid-cols-2"
          >
            <div>
              <div className="section-badge">Наша миссия</div>
              <h2 className="display-md" style={{ color: "#F5F7FA", marginBottom: "1.25rem" }}>
                Мы делаем логистику<br />предсказуемой
              </h2>
              <p style={{ color: "#AAB3C2", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Перевозка автомобиля — это не просто транспорт. Это ответственность за чужую собственность, за сроки, за сохранность. Мы понимаем это и строим каждый процесс так, чтобы клиент мог доверять нам без оговорок.
              </p>
              <p style={{ color: "#AAB3C2", fontSize: "1rem", lineHeight: 1.7 }}>
                Наша цель — стать стандартом качества в перевозке автомобилей по России: с прозрачными условиями, предварительным расчётом и человеческим подходом к каждому клиенту.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: <Truck size={20} style={{ color: "#4FD1FF" }} />, title: "Автовоз под ваш маршрут", desc: "Подбираем подходящий автовоз с гидравлическими платформами для бережной погрузки любого автомобиля." },
                { icon: <Users size={20} style={{ color: "#4FD1FF" }} />, title: "30+ перевозчиков-партнёров", desc: "Проверенная сеть партнёров на особых условиях — гибкость маршрутов по всей России и СНГ." },
                { icon: <Shield size={20} style={{ color: "#4FD1FF" }} />, title: "Страхование и ответственность", desc: "Страхование и ответственность — по условиям договора. Акт осмотра с фотофиксацией обязателен." },
                { icon: <MapPin size={20} style={{ color: "#4FD1FF" }} />, title: "Сопровождение до выдачи", desc: "Сопровождаем перевозку и держим связь на всём маршруте — вы знаете статус доставки." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", padding: "1.25rem", backgroundColor: "#161A20", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.375rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "0.25rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#F5F7FA", marginBottom: "0.25rem" }}>{item.title}</h4>
                    <p style={{ color: "#AAB3C2", fontSize: "0.875rem", lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values / Brand Story */}
      <section
        style={{
          paddingTop: "6rem",
          paddingBottom: "6rem",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#0A0D10",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663490180314/YbgXRCtSxpgqz345bJLVUX/elbrus-abstract_08197e27.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,13,16,0.88)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            ref={valuesSection.ref}
            style={{
              opacity: valuesSection.inView ? 1 : 0,
              transform: valuesSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="lg:grid-cols-2">
              <div>
                <div className="section-badge">Характер компании</div>
                <h2 className="display-md" style={{ color: "#F5F7FA", marginBottom: "1.25rem" }}>
                  Кавказ. Эльбрус.<br />Сила маршрута.
                </h2>
                <p style={{ color: "#C9D4E3", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  ТехноЛогистика родилась из идеи соединить технологичность современной логистики с характером гор. Наш символ — Эльбрус. Для нас это не просто образ на логотипе, а внутренняя планка: устойчивость, высота, ответственность и движение вперёд.
                </p>
                <p style={{ color: "#AAB3C2", fontSize: "1rem", lineHeight: 1.7 }}>
                  Корни компании связаны с Кабардино-Балкарией — местом, где уважение к слову, дороге и человеку имеет особое значение. Поэтому мы строим логистику не как холодный поток заявок, а как систему доверия, ответственности и сопровождения.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { title: "Сила", desc: "Надёжные перевозчики и широкая партнёрская сеть" },
                  { title: "Точность", desc: "Каждый маршрут выверен, сроки — под контролем" },
                  { title: "Движение", desc: "Непрерывная работа — ежедневные перевозки по всей России" },
                  { title: "Высота", desc: "Стандарты сервиса, которые выше среднего по рынку" },
                ].map((val, i) => (
                  <div key={i} style={{ padding: "1.5rem", backgroundColor: "rgba(22, 26, 32, 0.7)", border: "1px solid rgba(79, 209, 255, 0.1)", borderRadius: "0.375rem" }}>
                    <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.125rem", color: "#4FD1FF", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>{val.title}</h4>
                    <p style={{ color: "#AAB3C2", fontSize: "0.8125rem", lineHeight: 1.55 }}>{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ярусы — внутренняя структура */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div
            ref={yarusySection.ref}
            style={{
              opacity: yarusySection.inView ? 1 : 0,
              transform: yarusySection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div style={{ maxWidth: "620px", marginBottom: "3rem" }}>
              <div className="section-badge">Внутренняя структура</div>
              <h2 className="display-md" style={{ color: "#F5F7FA", marginBottom: "1.25rem" }}>
                У нас нет отделов —<br />у нас Ярусы
              </h2>
              <p style={{ color: "#AAB3C2", fontSize: "1rem", lineHeight: 1.7 }}>
                Каждый Ярус отвечает за свой уровень движения заявки — от первого обращения до выдачи автомобиля клиенту. Вместе они держат маршрут под контролем на всей высоте.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Route size={20} style={{ color: "#4FD1FF" }} />, title: "Ярус Путь", desc: "Операционная логистика и сопровождение рейсов." },
                { icon: <ShieldCheck size={20} style={{ color: "#4FD1FF" }} />, title: "Ярус Щит", desc: "Проверка перевозчиков и безопасность сделки." },
                { icon: <FileText size={20} style={{ color: "#4FD1FF" }} />, title: "Ярус Кодекс", desc: "Договоры, документы и правовая чистота." },
                { icon: <Scale size={20} style={{ color: "#4FD1FF" }} />, title: "Ярус Баланс", desc: "Оплаты, закрывающие документы и финансовая дисциплина." },
                { icon: <Mountain size={20} style={{ color: "#4FD1FF" }} />, title: "Ярус Пик", desc: "Стратегия, аналитика и развитие системы." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", padding: "1.5rem", backgroundColor: "#161A20", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.375rem" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "0.25rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#F5F7FA", marginBottom: "0.375rem", letterSpacing: "-0.01em" }}>{item.title}</h4>
                    <p style={{ color: "#AAB3C2", fontSize: "0.875rem", lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Роли команды */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem", backgroundColor: "#161A20", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div
            ref={rolesSection.ref}
            style={{
              opacity: rolesSection.inView ? 1 : 0,
              transform: rolesSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div style={{ maxWidth: "620px", marginBottom: "3rem" }}>
              <div className="section-badge">Команда</div>
              <h2 className="display-md" style={{ color: "#F5F7FA", marginBottom: "1.25rem" }}>
                Мы называем команду<br />не просто логистами
              </h2>
              <p style={{ color: "#AAB3C2", fontSize: "1rem", lineHeight: 1.7 }}>
                За каждой заявкой стоят люди, у которых есть роль и ответственность за результат, а не строка в штатном расписании.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="sm:grid-cols-3">
              {[
                { icon: <Compass size={22} style={{ color: "#4FD1FF" }} />, title: "Навигаторы", desc: "Помогают выбрать маршрут и решение." },
                { icon: <Truck size={22} style={{ color: "#4FD1FF" }} />, title: "Драйверы", desc: "Находят возможности движения там, где другие видят тупик." },
                { icon: <HeartHandshake size={22} style={{ color: "#4FD1FF" }} />, title: "Кураторы рейсов", desc: "Сопровождают перевозку до результата." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "1.75rem", backgroundColor: "#1C2028", border: "1px solid rgba(79, 209, 255, 0.1)", borderRadius: "0.375rem" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", backgroundColor: "rgba(79, 209, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    {item.icon}
                  </div>
                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#F5F7FA", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{item.title}</h4>
                  <p style={{ color: "#AAB3C2", fontSize: "0.9375rem", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div
            ref={teamSection.ref}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1.5rem",
              opacity: teamSection.inView ? 1 : 0,
              transform: teamSection.inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <h2 className="display-md" style={{ color: "#F5F7FA", maxWidth: "500px" }}>
              Готовы работать вместе?
            </h2>
            <p style={{ color: "#AAB3C2", fontSize: "1rem", maxWidth: "400px", lineHeight: 1.6 }}>
              Свяжитесь с нами для обсуждения условий или рассчитайте стоимость перевозки онлайн.
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
