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

interface LeadPayload {
  from?: unknown;
  to?: unknown;
  carModel?: unknown;
  carYear?: unknown;
  driveStatus?: unknown;
  readyDate?: unknown;
  name?: unknown;
  phone?: unknown;
  comment?: unknown;
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

    const from = asString(body.from);
    const to = asString(body.to);
    const carModel = asString(body.carModel);
    const carYear = asString(body.carYear);
    const driveStatus = asString(body.driveStatus);
    const readyDate = asString(body.readyDate);
    const name = asString(body.name);
    const phone = asString(body.phone);
    const comment = asString(body.comment);

    // Обязательные поля
    if (!from || !to || !carModel || !name || !phone) {
      return res.status(400).json({ ok: false, error: "Не удалось отправить заявку" });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_LEADS_CHAT_ID;
    if (!token || !chatId) {
      console.error("Telegram credentials are not configured");
      return res.status(500).json({ ok: false, error: "Не удалось отправить заявку" });
    }

    const driveLabel = DRIVE_STATUS_LABELS[driveStatus] || "Нужно уточнить";

    const lines = [
      "🆕 <b>Новая заявка с сайта</b>",
      "",
      `Маршрут: ${escapeHtml(from)} → ${escapeHtml(to)}`,
      `Автомобиль: ${escapeHtml(carModel)}`,
      `Год: ${escapeHtml(carYear || "—")}`,
      `На ходу: ${escapeHtml(driveLabel)}`,
      `Дата готовности: ${escapeHtml(readyDate || "—")}`,
      "",
      `Клиент: ${escapeHtml(name)}`,
      `Телефон: ${escapeHtml(phone)}`,
      `Комментарий: ${escapeHtml(comment || "—")}`,
      "",
      "Источник: технологист.рф",
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
        return res.status(502).json({ ok: false, error: "Не удалось отправить заявку" });
      }

      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to deliver lead to Telegram:", err instanceof Error ? err.message : "unknown error");
      return res.status(502).json({ ok: false, error: "Не удалось отправить заявку" });
    }
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
