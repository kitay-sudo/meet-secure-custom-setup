# 🎥 Свой Jitsi Meet сервер с кастомным брендингом

Разворачиваем персонализированный видеосервер с доменом, шифрованием, кастомным дизайном и русским интерфейсом.

---

## ⚙️ 1. Установка Docker и Docker Compose

```bash
sudo apt update
snap install docker
sudo systemctl enable docker
```

📦 2. Загрузка и запуск Jitsi

```bash
git clone https://github.com/jitsi/docker-jitsi-meet.git
cd docker-jitsi-meet-*/
cp env.example .env
./gen-passwords.sh
mkdir -p ~/.jitsi-meet-cfg/{web,transcripts,prosody/config,prosody/prosody-plugins-custom,jicofo,jvb,jigasi,jibri}
```

📝 3. Настройка .env

```bash
PUBLIC_URL=meet.example.com
HTTP_PORT=8000
HTTPS_PORT=8443
```

🌐 4. Конфигурация NGINX

Измените meet.example.com на ваш собственный домен в конфигурации Nginx. При необходимости вы также можете добавить переадресацию (URL-redirect), чтобы закрыть доступ к главной странице. В стандартной конфигурации этот блок закомментирован.

```bash
nano /etc/nginx/sites-available/default
```

```bash
server {
    listen 80;
    server_name meet.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name meet.example.com;

    ssl_certificate /etc/letsencrypt/live/meet.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meet.example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /xmpp-websocket {
        proxy_pass http://localhost:8000/xmpp-websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /colibri-ws {
        proxy_pass http://localhost:8000/colibri-ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /http-bind {
        proxy_pass http://localhost:8000/http-bind;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $host;
    }

    location /images/ {
        proxy_pass http://localhost:8000;
    }

    location /css/ {
        proxy_pass http://localhost:8000;
    }

    location /fonts/ {
        proxy_pass http://localhost:8000;
    }

    location /static/ {
        proxy_pass http://localhost:8000;
    }
    
    location /lang/ {
        proxy_pass http://localhost:8000;
    }
    
    //Отключаем полностью главную страницу чтобы не давать создание новых конференций
    //location = / {
      //  return 301 /url-redirect/; 
    //}

    location ~ ^/([^/]+)$ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

🔐 5. Получение сертификата

```bash
sudo apt install python3-pip -y
pip3 install certbot-nginx
sudo certbot certonly --standalone -d meet.example.com
```

🖌️ 6. Кастомизация интерфейса

```bash
/root/.jitsi-meet-cfg/web/custom-interface_config.js
```

```bash
interfaceConfig = interfaceConfig || {};

// Общий брендинг
interfaceConfig.APP_NAME = 'MyVideoCall';
interfaceConfig.SHOW_JITSI_WATERMARK = false;
interfaceConfig.SHOW_BRAND_WATERMARK = false;
interfaceConfig.SHOW_POWERED_BY = false;
interfaceConfig.SHOW_WATERMARK_FOR_GUESTS = false;
interfaceConfig.ENABLE_WELCOME_PAGE = false;

// Убираем ненужные кнопки
interfaceConfig.TOOLBAR_BUTTONS = [
    'microphone',
    'camera',
    'desktop',
    'security',
    'chat',
    'raisehand',
    'tileview',
    'hangup'
];

// Удаляем разделы настроек
interfaceConfig.SETTINGS_SECTIONS = [ 'devices', 'moderator', 'profile' ];

// Отключаем ненужные функции
interfaceConfig.DISABLE_VIDEO_SHARE = true;
interfaceConfig.CLOSE_CAPTIONS_ENABLED = false;         // Субтитры (СС)
interfaceConfig.DISABLE_TRANSCRIPTIONS = true;          // Расшифровка речи
interfaceConfig.DISABLE_PRESENCE_STATUS = true;
interfaceConfig.INVITE_ENABLED = false;
interfaceConfig.ADD_PEOPLE_ENABLED = false;
interfaceConfig.SHOW_PROMOTIONS = false;
interfaceConfig.FEEDBACK_PERCENT = 0;

// Меню всегда видно
interfaceConfig.TOOLBAR_ALWAYS_VISIBLE = true;
```

```bash
/root/.jitsi-meet-cfg/web/custom-config.js
```

```bash
config = config || {};

// Русский язык по умолчанию
config.defaultLanguage = 'ru';

// Настройка сигналинга
config.bosh = 'https://conf.mirracoin.io/http-bind';
config.websocket = 'wss://conf.mirracoin.io/xmpp-websocket';

// Отключаем субтитры и расшифровку речи (СС)
config.transcribingEnabled = false;

```

Запуск в контейнере
```bash
docker compose up -d
```

Удаление контейнера
```bash
docker-compose down --volumes --rmi all
```

Перезагрузка
```bash
docker compose restart
```