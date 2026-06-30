# Деплой на Ubuntu 24.04

Инструкция по развёртыванию сайта **ТехноЛогистика** на чистом сервере Ubuntu 24.04 LTS.

Схема:

- Express-сервер раздаёт собранный сайт на `127.0.0.1:3000`.
- Nginx терминирует HTTPS и проксирует трафик основного домена **технологист.рф** на этот сервер.
- Поддомен **ayub.технологист.рф** работает как reverse proxy на отдельный backend (`AYUB_API_URL`).

> **Важно про IDN-домены.** Имена `технологист.рф` и `ayub.технологист.рф` — кириллические (IDN).
> Nginx, certbot и DNS работают с их punycode-формой:
>
> | Домен                   | Punycode (для конфигов)             |
> | ----------------------- | ----------------------------------- |
> | `технологист.рф`        | `xn--c1adkkjgb0abiz.xn--p1ai`       |
> | `ayub.технологист.рф`   | `ayub.xn--c1adkkjgb0abiz.xn--p1ai`  |
>
> В конфигах nginx ниже используется именно punycode. Убедитесь, что A/AAAA-записи в DNS указывают на IP сервера для обоих доменов.

---

## 1. Подготовка системы

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx
```

## 2. Установка Node.js 22

Через официальный репозиторий NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # ожидается v22.x
```

## 3. Включение Corepack и pnpm

Corepack входит в состав Node.js и управляет версией pnpm, зафиксированной в `package.json` (`packageManager`):

```bash
sudo corepack enable
corepack prepare pnpm@latest --activate
pnpm -v   # проверка
```

## 4. Клонирование репозитория

```bash
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
cd /var/www
git clone https://github.com/Tehnologistika/technologistika-site.git
cd technologistika-site
```

## 5. Переменные окружения

```bash
cp .env.example .env
nano .env   # при необходимости отредактируйте PORT, AYUB_API_URL и т.д.
```

## 6. Установка зависимостей и сборка

```bash
pnpm install --frozen-lockfile
pnpm build
```

После сборки в `dist/` появятся:

- `dist/public/` — статика фронтенда;
- `dist/index.js` — собранный Express-сервер.

## 7. Запуск сервера через systemd

Создайте unit-файл:

```bash
sudo nano /etc/systemd/system/technologistika.service
```

```ini
[Unit]
Description=Technologistika site (Express)
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/technologistika-site
EnvironmentFile=/var/www/technologistika-site/.env
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Дайте права пользователю `www-data` на каталог и запустите сервис:

```bash
sudo chown -R www-data:www-data /var/www/technologistika-site
sudo systemctl daemon-reload
sudo systemctl enable --now technologistika
sudo systemctl status technologistika
```

Проверьте, что сервер отвечает локально:

```bash
curl -I http://127.0.0.1:3000
```

---

## 8. Nginx: основной сайт технологист.рф

```bash
sudo nano /etc/nginx/sites-available/technologist
```

```nginx
server {
    listen 80;
    listen [::]:80;

    # технологист.рф (punycode)
    server_name xn--c1adkkjgb0abiz.xn--p1ai www.xn--c1adkkjgb0abiz.xn--p1ai;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 9. Nginx: поддомен ayub.технологист.рф (reverse proxy)

Поддомен проксирует запросы на backend, указанный в `AYUB_API_URL`.
В примере backend слушает локально на `127.0.0.1:8080` — замените `proxy_pass`
на нужный адрес/порт вашего сервиса.

```bash
sudo nano /etc/nginx/sites-available/ayub
```

```nginx
server {
    listen 80;
    listen [::]:80;

    # ayub.технологист.рф (punycode)
    server_name ayub.xn--c1adkkjgb0abiz.xn--p1ai;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # поддержка WebSocket (если требуется backend'у)
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 10. Активация конфигов nginx

```bash
sudo ln -s /etc/nginx/sites-available/technologist /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ayub /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t          # проверка синтаксиса
sudo systemctl reload nginx
```

---

## 11. SSL через certbot (Let's Encrypt)

Установите certbot и плагин для nginx:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Выпустите сертификаты (certbot сам отредактирует конфиги nginx и настроит редирект на HTTPS).
Используйте punycode-имена доменов:

```bash
sudo certbot --nginx \
  -d xn--c1adkkjgb0abiz.xn--p1ai \
  -d www.xn--c1adkkjgb0abiz.xn--p1ai \
  -d ayub.xn--c1adkkjgb0abiz.xn--p1ai
```

Проверьте автообновление сертификатов:

```bash
sudo certbot renew --dry-run
sudo systemctl list-timers | grep certbot
```

---

## 12. Команды проверки

```bash
# статус сервисов
sudo systemctl status technologistika
sudo systemctl status nginx

# Express отвечает локально
curl -I http://127.0.0.1:3000

# сайт по HTTPS (-L следует за редиректами, --resolve не нужен — домен в DNS)
curl -IL https://технологист.рф
curl -IL https://ayub.технологист.рф

# проверка сертификата
echo | openssl s_client -servername xn--c1adkkjgb0abiz.xn--p1ai \
  -connect xn--c1adkkjgb0abiz.xn--p1ai:443 2>/dev/null | openssl x509 -noout -dates

# логи
sudo journalctl -u technologistika -f
sudo tail -f /var/log/nginx/error.log
```

---

## 13. Обновление сайта (redeploy)

```bash
cd /var/www/technologistika-site
git pull
pnpm install --frozen-lockfile
pnpm build
sudo systemctl restart technologistika
```
