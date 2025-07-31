# 🌐 Настройка Nginx для Jitsi Meet

## 📝 Конфигурация nginx

Создайте файл `/etc/nginx/sites-available/jitsi-meet` (или добавьте в основной конфиг):

```nginx
server {
    listen 80;
    server_name meet.mirracoin.io;
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name meet.mirracoin.io;  

    ssl_certificate /etc/letsencrypt/live/meet.mirracoin.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meet.mirracoin.io/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Основной прокси для Jitsi web
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Дополнительные заголовки для Jitsi
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # WebSocket для XMPP
    location /xmpp-websocket {
        proxy_pass http://127.0.0.1:8000/xmpp-websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # WebSocket для Colibri (видео мост)
    location /colibri-ws {
        proxy_pass http://127.0.0.1:8000/colibri-ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # HTTP BIND для XMPP
    location /http-bind {
        proxy_pass http://127.0.0.1:8000/http-bind;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # Дополнительные эндпоинты Jitsi
    location /config.js {
        proxy_pass http://127.0.0.1:8000/config.js;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /interface_config.js {
        proxy_pass http://127.0.0.1:8000/interface_config.js;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 Установка SSL сертификатов с Certbot

### Установка certbot через pip:

```bash
# Обновляем pip
sudo python3 -m pip install --upgrade pip

# Устанавливаем certbot и плагин для nginx
sudo pip3 install certbot certbot-nginx

# Или через виртуальное окружение (рекомендуется)
python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx

# Создаем символическую ссылку для удобства
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```

### Получение SSL сертификата:

```bash
# Создайте директорию для acme-challenge
sudo mkdir -p /var/www/letsencrypt

# Получите сертификат (замените на ваш домен)
sudo certbot --nginx -d meet.mirracoin.io

# Или только получить сертификат без автоконфигурации nginx
sudo certbot certonly --webroot -w /var/www/letsencrypt -d meet.mirracoin.io
```

### Автообновление сертификатов:

```bash
# Добавьте в crontab для автообновления
sudo crontab -e

# Добавьте эту строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔧 Применение конфигурации

### 1. Создайте символическую ссылку:
```bash
sudo ln -s /etc/nginx/sites-available/jitsi-meet /etc/nginx/sites-enabled/
```

### 2. Проверьте конфигурацию:
```bash
sudo nginx -t
```

### 3. Перезапустите nginx:
```bash
sudo systemctl reload nginx
```

---

## 📋 Важные моменты

### 🔐 SSL сертификаты
- Убедитесь, что у вас есть SSL сертификаты для вашего домена
- Пути к сертификатам должны соответствовать реальным файлам
- Замените `meet.mirracoin.io` на ваш домен

### 🚪 Порты
- Nginx слушает порты 80 и 443
- Jitsi Meet контейнер работает на порту 8000
- Убедитесь, что Docker контейнер Jitsi настроен на порт 8000

### ⚡ WebSocket поддержка
- Конфигурация включает поддержку WebSocket для XMPP и Colibri
- Это критично для корректной работы видеомостов

### 🛡️ Security Headers
- Включен HSTS (HTTP Strict Transport Security)
- Настроены современные SSL протоколы и шифры