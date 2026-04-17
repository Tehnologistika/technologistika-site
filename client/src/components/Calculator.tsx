/*
 * TECHNOLOGISTIKA — Calculator Component
 * "Рассчитать стоимость" form with real-time validation and success state
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 */
import { useState } from "react";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

interface FormData {
  from: string;
  to: string;
  carType: string;
  name: string;
  phone: string;
}

interface FormErrors {
  from?: string;
  to?: string;
  carType?: string;
  name?: string;
  phone?: string;
}

const CAR_TYPES = [
  { value: "sedan", label: "Седан" },
  { value: "suv", label: "Внедорожник / Кроссовер" },
  { value: "minivan", label: "Минивэн" },
  { value: "premium", label: "Премиум / Эксклюзив" },
  { value: "electric", label: "Электромобиль" },
  { value: "other", label: "Другой тип" },
];

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.from.trim()) {
    errors.from = "Укажите город отправления";
  } else if (data.from.trim().length < 2) {
    errors.from = "Введите корректное название города";
  }
  if (!data.to.trim()) {
    errors.to = "Укажите город назначения";
  } else if (data.to.trim().length < 2) {
    errors.to = "Введите корректное название города";
  }
  if (data.from.trim() && data.to.trim() && data.from.trim().toLowerCase() === data.to.trim().toLowerCase()) {
    errors.to = "Город назначения должен отличаться от города отправления";
  }
  if (!data.carType) {
    errors.carType = "Выберите тип автомобиля";
  }
  if (!data.name.trim()) {
    errors.name = "Введите ваше имя";
  }
  if (!data.phone.trim()) {
    errors.phone = "Введите номер телефона";
  } else if (!/^[\d\s\+\-\(\)]{10,18}$/.test(data.phone.trim())) {
    errors.phone = "Введите корректный номер телефона";
  }
  return errors;
}

export default function Calculator() {
  const [formData, setFormData] = useState<FormData>({
    from: "",
    to: "",
    carType: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateForm({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    // Simulate form submission (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "rgba(79, 209, 255, 0.1)",
            border: "1px solid rgba(79, 209, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle size={28} style={{ color: "#4FD1FF" }} />
        </div>
        <div>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "1.375rem",
              color: "#F5F7FA",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            Заявка принята
          </h3>
          <p style={{ color: "#AAB3C2", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "360px" }}>
            Наш менеджер свяжется с вами в течение 15 минут, чтобы уточнить детали и назвать точную стоимость перевозки.
          </p>
        </div>
        <button
          onClick={() => { setSuccess(false); setFormData({ from: "", to: "", carType: "", name: "", phone: "" }); setTouched({}); setErrors({}); }}
          style={{
            color: "#4FD1FF",
            background: "none",
            border: "none",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {/* From */}
        <div>
          <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
            Откуда
          </label>
          <input
            type="text"
            className={`field-dark${errors.from && touched.from ? " error" : ""}`}
            placeholder="Москва"
            value={formData.from}
            onChange={(e) => handleChange("from", e.target.value)}
            onBlur={() => handleBlur("from")}
            autoComplete="off"
          />
          {errors.from && touched.from && (
            <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.375rem", fontFamily: "'Inter', sans-serif" }}>{errors.from}</p>
          )}
        </div>

        {/* To */}
        <div>
          <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
            Куда
          </label>
          <input
            type="text"
            className={`field-dark${errors.to && touched.to ? " error" : ""}`}
            placeholder="Санкт-Петербург"
            value={formData.to}
            onChange={(e) => handleChange("to", e.target.value)}
            onBlur={() => handleBlur("to")}
            autoComplete="off"
          />
          {errors.to && touched.to && (
            <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.375rem", fontFamily: "'Inter', sans-serif" }}>{errors.to}</p>
          )}
        </div>

        {/* Car type */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
            Тип автомобиля
          </label>
          <select
            className={`field-dark${errors.carType && touched.carType ? " error" : ""}`}
            value={formData.carType}
            onChange={(e) => handleChange("carType", e.target.value)}
            onBlur={() => handleBlur("carType")}
          >
            <option value="" disabled>Выберите тип</option>
            {CAR_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.carType && touched.carType && (
            <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.375rem", fontFamily: "'Inter', sans-serif" }}>{errors.carType}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
            Ваше имя
          </label>
          <input
            type="text"
            className={`field-dark${errors.name && touched.name ? " error" : ""}`}
            placeholder="Александр"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {errors.name && touched.name && (
            <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.375rem", fontFamily: "'Inter', sans-serif" }}>{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#AAB3C2", marginBottom: "0.5rem" }}>
            Телефон
          </label>
          <input
            type="tel"
            className={`field-dark${errors.phone && touched.phone ? " error" : ""}`}
            placeholder="+7 916 000-0000"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
          />
          {errors.phone && touched.phone && (
            <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.375rem", fontFamily: "'Inter', sans-serif" }}>{errors.phone}</p>
          )}
        </div>

        {/* Submit */}
        <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.8 : 1 }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Отправляем заявку...
              </>
            ) : (
              <>
                Рассчитать стоимость
                <ArrowRight size={16} />
              </>
            )}
          </button>
          <p style={{ color: "#AAB3C2", fontSize: "0.75rem", marginTop: "0.75rem", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
            Менеджер перезвонит в течение 15 минут и назовёт точную стоимость
          </p>
        </div>
      </div>
    </form>
  );
}
