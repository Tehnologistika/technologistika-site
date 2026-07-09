import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Экранирование HTML-символов в пользовательских данных (parse_mode: HTML).
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const DRIVE_STATUS_LABELS: Record<string, string> = {
  yes: "Да, на ходу",
  no: "Нет, не на ходу",
  uncertain: "Нужно уточнить",
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  carCarrier: "Перевозка автовозом",
  multimodal: "Мультимодальная перевозка",
  chinaImport: "Доставка авто из Китая",
  dealer: "Перевозка для дилера",
  other: "Другая задача",
};

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  unspecified: "Пока не выбрано",
  cash: "Наличные",
  bankNoVat: "Безнал без НДС",
  bankVat: "Безнал с НДС",
};

// Таймаут запроса к Аюбу (мс). Если Аюб не ответил за это время — уходим в fallback.
const AYUB_TIMEOUT_MS = 5000;

// Нормализованная заявка, пригодная и для Аюба, и для Telegram-фолбэка.
interface NormalizedLead {
  serviceType: string;
  from: string;
  to: string;
  carModel: string;
  carYear: string;
  driveStatus: string;
  readyDate: string;
  paymentType: string;
  name: string;
  phone: string;
  comment: string;
  consent: boolean;
  sourcePage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
}

// Результат попытки доставки: принято ли, каким каналом, и public_id от Аюба.
interface DeliveryResult {
  accepted: boolean;
  channel: "ayub" | "telegram" | null;
  publicId: string | null;
}

/**
 * Попытка доставить заявку в Аюба (CRM leads) через /webhook/site/{secret}.
 * Возвращает true только при HTTP 2xx И теле ответа { ok: true }.
 * Любая иная ситуация (нет конфигурации, network error, timeout, не-2xx,
 * невалидный JSON, ok=false) трактуется как неуспех → вызывающий код делает fallback.
 */
async function tryDeliverToAyub(
  lead: NormalizedLead,
): Promise<{ ok: boolean; publicId: string | null }> {
  const baseUrl = process.env.AYUB_API_URL;
  const secret = process.env.SITE_WEBHOOK_SECRET;
  if (!baseUrl || !secret) {
    // Интеграция не настроена — это не ошибка, просто идём в Telegram.
    console.warn("Ayub webhook not configured (AYUB_API_URL / SITE_WEBHOOK_SECRET missing); using Telegram");
    return { ok: false, publicId: null };
  }

  // Собираем URL аккуратно, без двойных слэшей.
  const url = `${baseUrl.replace(/\/+$/, "")}/webhook/site/${encodeURIComponent(secret)}`;

  // Аюб принимает camelCase (utmSource, sourcePage, carModel, readyDate, paymentType).
  const payload = {
    serviceType: lead.serviceType || null,
    from: lead.from,
    to: lead.to,
    carModel: lead.carModel,
    carYear: lead.carYear || null,
    driveStatus: lead.driveStatus || null,
    readyDate: lead.readyDate || null,
    paymentType: lead.paymentType || null,
    name: lead.name,
    phone: lead.phone,
    comment: lead.comment || null,
    consent: lead.consent,
    sourcePage: lead.sourcePage || null,
    utmSource: lead.utmSource || null,
    utmMedium: lead.utmMedium || null,
    utmCampaign: lead.utmCampaign || null,
    utmContent: lead.utmContent || null,
    utmTerm: lead.utmTerm || null,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AYUB_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!resp.ok) {
      // 403 (неверный секрет), 400 (валидация), 500 и т.п. — уходим в fallback.
      console.error("Ayub webhook returned non-2xx status", resp.status);
      return { ok: false, publicId: null };
    }

    let data: unknown = null;
    try {
      data = await resp.json();
    } catch {
      console.error("Ayub webhook returned invalid JSON");
      return { ok: false, publicId: null };
    }

    const obj = (data ?? {}) as Record<string, unknown>;
    if (obj.ok === true) {
      const publicId = typeof obj.public_id === "string" ? obj.public_id : null;
      return { ok: true, publicId };
    }
    console.error("Ayub webhook responded with ok!=true");
    return { ok: false, publicId: null };
  } catch (err) {
    // network error или abort по таймауту
    const reason = err instanceof Error ? err.name === "AbortError" ? "timeout" : err.message : "unknown error";
    console.error("Ayub webhook request failed:", reason);
    return { ok: false, publicId: null };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fallback-доставка заявки напрямую в Telegram (прежняя логика).
 * Возвращает true при успешной отправке сообщения ботом.
 */
async function tryDeliverToTelegram(lead: NormalizedLead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_LEADS_CHAT_ID;
  if (!token || !chatId) {
    console.error("Telegram credentials are not configured");
    return false;
  }

  const driveLabel = DRIVE_STATUS_LABELS[lead.driveStatus] || "Нужно уточнить";
  const serviceLabel = SERVICE_TYPE_LABELS[lead.serviceType] || "Перевозка автовозом";
  const paymentLabel = PAYMENT_TYPE_LABELS[lead.paymentType] || "Пока не выбрано";
  const utmParts = [
    lead.utmSource ? `source=${lead.utmSource}` : "",
    lead.utmMedium ? `medium=${lead.utmMedium}` : "",
    lead.utmCampaign ? `campaign=${lead.utmCampaign}` : "",
    lead.utmContent ? `content=${lead.utmContent}` : "",
    lead.utmTerm ? `term=${lead.utmTerm}` : "",
  ].filter(Boolean);

  const lines = [
    "🆕 <b>Новая заявка с сайта</b>",
    "",
    `Услуга: ${escapeHtml(serviceLabel)}`,
    `Маршрут: ${escapeHtml(lead.from)} → ${escapeHtml(lead.to)}`,
    `Автомобиль: ${escapeHtml(lead.carModel)}`,
    `Год: ${escapeHtml(lead.carYear || "—")}`,
    `На ходу: ${escapeHtml(driveLabel)}`,
    `Дата готовности: ${escapeHtml(lead.readyDate || "—")}`,
    `Форма оплаты: ${escapeHtml(paymentLabel)}`,
    "",
    `Клиент: ${escapeHtml(lead.name)}`,
    `Телефон: ${escapeHtml(lead.phone)}`,
    `Комментарий: ${escapeHtml(lead.comment || "—")}`,
    "",
    "Источник: технологист.рф",
    `Страница: ${escapeHtml(lead.sourcePage || "—")}`,
    `UTM: ${escapeHtml(utmParts.length ? utmParts.join(" / ") : "—")}`,
  ];

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!tgResponse.ok) {
      console.error("Telegram sendMessage failed with status", tgResponse.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to deliver lead to Telegram:", err instanceof Error ? err.message : "unknown error");
    return false;
  }
}

interface LeadPayload {
  serviceType?: unknown;
  from?: unknown;
  to?: unknown;
  carModel?: unknown;
  carYear?: unknown;
  driveStatus?: unknown;
  readyDate?: unknown;
  paymentType?: unknown;
  name?: unknown;
  phone?: unknown;
  comment?: unknown;
  consent?: unknown;
  sourcePage?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  utmContent?: unknown;
  utmTerm?: unknown;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "64kb" }));

  // Приём заявок с формы и отправка в Telegram.
  // ВАЖНО: эндпоинт зарегистрирован ДО app.get("*"), иначе SPA-фолбэк перехватит /api/leads.
  app.post("/api/leads", async (req, res) => {
    const body: LeadPayload = req.body ?? {};

    const asString = (value: unknown): string =>
      typeof value === "string" ? value.trim() : "";

    const lead: NormalizedLead = {
      serviceType: asString(body.serviceType),
      from: asString(body.from),
      to: asString(body.to),
      carModel: asString(body.carModel),
      carYear: asString(body.carYear),
      driveStatus: asString(body.driveStatus),
      readyDate: asString(body.readyDate),
      paymentType: asString(body.paymentType),
      name: asString(body.name),
      phone: asString(body.phone),
      comment: asString(body.comment),
      consent: body.consent === true,
      sourcePage: asString(body.sourcePage),
      utmSource: asString(body.utmSource),
      utmMedium: asString(body.utmMedium),
      utmCampaign: asString(body.utmCampaign),
      utmContent: asString(body.utmContent),
      utmTerm: asString(body.utmTerm),
    };

    // Обязательные поля (валидация на стороне сайта; Аюб также валидирует своё).
    if (!lead.from || !lead.to || !lead.carModel || !lead.name || !lead.phone) {
      return res.status(400).json({ ok: false, error: "Не удалось отправить заявку" });
    }

    const result: DeliveryResult = { accepted: false, channel: null, publicId: null };

    // Шаг 1. Сначала — Аюб (основной канал, CRM leads).
    const ayub = await tryDeliverToAyub(lead);
    if (ayub.ok) {
      result.accepted = true;
      result.channel = "ayub";
      result.publicId = ayub.publicId;
      console.log(
        "lead accepted by Ayub" + (ayub.publicId ? ` (public_id=${ayub.publicId})` : ""),
      );
    } else {
      // Шаг 2. Fallback — прямая отправка в Telegram (прежняя логика).
      const tgOk = await tryDeliverToTelegram(lead);
      if (tgOk) {
        result.accepted = true;
        result.channel = "telegram";
        console.log("fallback to Telegram: lead delivered");
      }
    }

    // Шаг 3. Успех если сработал хотя бы один канал; иначе — ошибка.
    if (!result.accepted) {
      console.error("lead delivery failed on both channels (Ayub + Telegram)");
      return res.status(502).json({ ok: false, error: "Не удалось отправить заявку" });
    }

    const responseBody: { ok: true; publicId?: string } = { ok: true };
    if (result.publicId) responseBody.publicId = result.publicId;
    return res.json(responseBody);
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
