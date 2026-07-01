/*
 * TECHNOLOGISTIKA — Calculator Component
 * Ориентировочный расчёт заявки на перевозку с валидацией и success-состоянием.
 * Окончательная стоимость подтверждается менеджером после проверки деталей.
 * Design: Editorial Swiss + Futuristic Alpine Industrial
 */
import { useState } from "react";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

type DriveStatus = "yes" | "no" | "uncertain";
type ServiceType = "carCarrier" | "multimodal" | "chinaImport" | "dealer" | "other";
type PaymentType = "unspecified" | "cash" | "bankNoVat" | "bankVat";

interface FormData {
  serviceType: ServiceType;
  from: string;
  to: string;
  carModel: string;
  carYear: string;
  driveStatus: DriveStatus;
  readyDate: string;
  paymentType: PaymentType;
  name: string;
  phone: string;
  comment: string;
  consent: boolean;
}

interface FormErrors {
  from?: string;
  to?: string;
  carModel?: string;
  name?: string;
  phone?: string;
  consent?: string;
}

// Поля, по которым ведётся валидация и отметка touched
const VALIDATED_FIELDS: (keyof FormErrors)[] = ["from", "to", "carModel", "name", "phone", "consent"];

const DRIVE_OPTIONS: { value: DriveStatus; label: string }[] = [
  { value: "uncertain", label: "Нужно уточнить" },
  { value: "yes", label: "Да, на ходу" },
  { value: "no", label: "Нет, не на ходу" },
];

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "carCarrier", label: "Перевозка автовозом" },
  { value: "multimodal", label: "Мультимодальная перевозка" },
  { value: "chinaImport", label: "Доставка авто из Китая" },
  { value: "dealer", label: "Перевозка для дилера" },
  { value: "other", label: "Другая задача" },
];

const PAYMENT_OPTIONS: { value: PaymentType; label: string }[] = [
  { value: "unspecified", label: "Пока не выбрано" },
  { value: "cash", label: "Наличные" },
  { value: "bankNoVat", label: "Безнал без НДС" },
  { value: "bankVat", label: "Безнал с НДС" },
];

const INITIAL_DATA: FormData = {
  serviceType: "carCarrier",
  from: "",
  to: "",
  carModel: "",
  carYear: "",
  driveStatus: "uncertain",
  readyDate: "",
  paymentType: "unspecified",
  name: "",
  phone: "",
  comment: "",
  consent: false,
};

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
  if (!data.carModel.trim()) {
    errors.carModel = "Укажите марку и модель автомобиля";
  }
  if (!data.name.trim()) {
    errors.name = "Введите ваше имя";
  }
  if (!data.phone.trim()) {
    errors.phone = "Введите номер телефона";
  } else if (!/^[\d\s\+\-\(\)]{10,18}$/.test(data.phone.trim())) {
    errors.phone = "Введите корректный номер телефона";
  }
  if (!data.consent) {
    errors.consent = "Подтвердите согласие на обработку данных";
  }
  return errors;
}

export default function Calculator() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: Exclude<keyof FormData, "consent">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateForm({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
    }
  };

  const handleConsentChange = (value: boolean) => {
    const nextData = { ...formData, consent: value };
    setFormData(nextData);
    setTouched((prev) => ({ ...prev, consent: true }));
    const newErrors = validateForm(nextData);
    setErrors((prev) => ({ ...prev, consent: newErrors.consent }));
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = VALIDATED_FIELDS.reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const searchParams = new URLSearchParams(window.location.search);
    const getParam = (name: string) => searchParams.get(name)?.trim() || null;

    // Собранная заявка для отправки на бэкенд (POST /api/leads → Telegram).
    const leadData = {
      serviceType: formData.serviceType,
      from: formData.from.trim(),
      to: formData.to.trim(),
      carModel: formData.carModel.trim(),
      carYear: formData.carYear.trim() || null,
      driveStatus: formData.driveStatus,
      readyDate: formData.readyDate || null,
      paymentType: formData.paymentType,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      comment: formData.comment.trim() || null,
      consent: formData.consent,
      sourcePage: `${window.location.pathname}${window.location.search}`,
      utmSource: getParam("utm_source"),
      utmMedium: getParam("utm_medium"),
      utmCampaign: getParam("utm_campaign"),
      utmContent: getParam("utm_content"),
      utmTerm: getParam("utm_term"),
    };

    setSubmitError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setSuccess(true);
    } catch {
      setSubmitError("Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
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
          <p style={{ color: "#AAB3C2", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "400px" }}>
            Заявка принята. Мы проверим маршрут, актуальную ставку и наличие ближайшего места. Окончательную стоимость сообщит менеджер после подтверждения деталей.
          </p>
        </div>
        <button
          onClick={() => { setSuccess(false); setFormData(INITIAL_DATA); setTouched({}); setErrors({}); }}
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.6875rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#AAB3C2",
    marginBottom: "0.5rem",
  };
  const errorStyle: React.CSSProperties = {
    color: "#ef4444",
    fontSize: "0.75rem",
    marginTop: "0.375rem",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {/* From */}
        <div>
          <label style={labelStyle}>Откуда</label>
          <input
            type="text"
            className={`field-dark${errors.from && touched.from ? " error" : ""}`}
            placeholder="Москва"
            value={formData.from}
            onChange={(e) => handleChange("from", e.target.value)}
            onBlur={() => handleBlur("from")}
            autoComplete="off"
          />
          {errors.from && touched.from && <p style={errorStyle}>{errors.from}</p>}
        </div>

        {/* To */}
        <div>
          <label style={labelStyle}>Куда</label>
          <input
            type="text"
            className={`field-dark${errors.to && touched.to ? " error" : ""}`}
            placeholder="Санкт-Петербург"
            value={formData.to}
            onChange={(e) => handleChange("to", e.target.value)}
            onBlur={() => handleBlur("to")}
            autoComplete="off"
          />
          {errors.to && touched.to && <p style={errorStyle}>{errors.to}</p>}
        </div>

        {/* Car make & model */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Марка и модель автомобиля</label>
          <input
            type="text"
            className={`field-dark${errors.carModel && touched.carModel ? " error" : ""}`}
            placeholder="Toyota Camry"
            value={formData.carModel}
            onChange={(e) => handleChange("carModel", e.target.value)}
            onBlur={() => handleBlur("carModel")}
            autoComplete="off"
          />
          {errors.carModel && touched.carModel && <p style={errorStyle}>{errors.carModel}</p>}
        </div>

        {/* Car year */}
        <div>
          <label style={labelStyle}>Год выпуска</label>
          <input
            type="text"
            inputMode="numeric"
            className="field-dark"
            placeholder="2019"
            value={formData.carYear}
            onChange={(e) => handleChange("carYear", e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Drive status */}
        <div>
          <label style={labelStyle}>Автомобиль на ходу</label>
          <select
            className="field-dark"
            value={formData.driveStatus}
            onChange={(e) => handleChange("driveStatus", e.target.value)}
          >
            {DRIVE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Ready date */}
        <div>
          <label style={labelStyle}>Дата готовности к отправке</label>
          <input
            type="date"
            className="field-dark"
            value={formData.readyDate}
            onChange={(e) => handleChange("readyDate", e.target.value)}
          />
        </div>

        {/* Service type */}
        <div>
          <label style={labelStyle}>Тип услуги</label>
          <select
            className="field-dark"
            value={formData.serviceType}
            onChange={(e) => handleChange("serviceType", e.target.value)}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Payment type */}
        <div>
          <label style={labelStyle}>Форма оплаты</label>
          <select
            className="field-dark"
            value={formData.paymentType}
            onChange={(e) => handleChange("paymentType", e.target.value)}
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label style={labelStyle}>Ваше имя</label>
          <input
            type="text"
            className={`field-dark${errors.name && touched.name ? " error" : ""}`}
            placeholder="Александр"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {errors.name && touched.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>Телефон</label>
          <input
            type="tel"
            className={`field-dark${errors.phone && touched.phone ? " error" : ""}`}
            placeholder="+7 916 000-0000"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
          />
          {errors.phone && touched.phone && <p style={errorStyle}>{errors.phone}</p>}
        </div>

        {/* Comment */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Комментарий</label>
          <textarea
            className="field-dark"
            placeholder="Дополнительные детали по перевозке"
            value={formData.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
            rows={3}
            style={{ resize: "vertical", minHeight: "72px" }}
          />
        </div>

        {/* Consent */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              color: "#AAB3C2",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => handleConsentChange(e.target.checked)}
              style={{ marginTop: "0.15rem" }}
            />
            <span>
              Согласен на обработку персональных данных для расчёта стоимости и связи по заявке.
            </span>
          </label>
          {errors.consent && touched.consent && <p style={errorStyle}>{errors.consent}</p>}
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
                Получить ориентировочный расчёт
                <ArrowRight size={16} />
              </>
            )}
          </button>
          {submitError && (
            <p style={{ ...errorStyle, marginTop: "0.75rem", textAlign: "center" }}>{submitError}</p>
          )}
          <p style={{ color: "#AAB3C2", fontSize: "0.75rem", marginTop: "0.75rem", textAlign: "center", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
            Расчёт предварительный. Окончательную стоимость менеджер подтвердит после проверки маршрута, состояния автомобиля, даты отправки и наличия места на автовозе.
          </p>
        </div>
      </div>
    </form>
  );
}
