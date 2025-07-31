# 🚀 Установка и запуск Jitsi Meet в Docker с кастомным интерфейсом и логикой выхода

## 📦 Требования

- Docker + Docker Compose
- Домен (например, `meet.example.com`) с A-записью на сервер
- Порты 80, 443 (TCP) и 10000 (UDP)

📋 **[Подробные требования к серверу](SERVER-REQUIREMENTS.md)** - минимальные и рекомендуемые характеристики для стабильной работы

🌐 **[Настройка Nginx](NGINX-CONFIG.md)** - рабочая конфигурация веб-сервера с SSL и проксированием

---

## 🔧 Установка

### 1. Клонируем репозиторий и создаём конфиги

```bash
git clone https://github.com/jitsi/docker-jitsi-meet.git
cd docker-jitsi-meet
cp env.example .env
mkdir -p ~/.jitsi-meet-cfg/{web,transcripts,prosody/config,prosody/prosody-plugins-custom,jicofo,jvb}
```

### 2. Настрой `.env`

```ini
CONFIG=/root/.jitsi-meet-cfg
PUBLIC_URL=https://meet.example.com

ENABLE_TRANSCRIPTIONS=0
ENABLE_RECORDING=0
ENABLE_LIVESTREAMING=0
ENABLE_WELCOME_PAGE=0
```

### 3. Генерация паролей

```bash
./gen-passwords.sh
```

---

## 🎨 Кастомизация интерфейса

### `custom-config.js`

```js
config = config || {};
config.defaultLanguage = 'ru';
config.transcribingEnabled = false;
config.enableUserScript = true;

config = config || {};

// Русский язык по умолчанию
config.defaultLanguage = 'ru';

// Настройка сигналинга
config.bosh = 'https://DOMEN/http-bind';
config.websocket = 'wss://DOMEN/xmpp-websocket';

// Отключаем субтитры и расшифровку речи (СС)
config.transcribingEnabled = false;
```

### `custom-interface_config.js`

```js
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

// Отключаем диалоги подтверждения при выходе
interfaceConfig.DISABLE_LEAVE_CONFIRMATION = true;
interfaceConfig.HIDE_LEAVE_CONFERENCE_DIALOG = true;

// Отключаем уведомления
interfaceConfig.DISABLE_NOTIFICATIONS = true;
interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS = true; 
```

---

## 🐳 docker-compose.yml (добавь в `web:` если нет)

```yaml
volumes:
  - ${CONFIG}/web:/config:Z
```

---

## 🚀 Запуск

```bash
docker-compose down --volumes --rmi all
```

```bash
docker compose up -d
```

Проверка:

```bash
docker compose ps
```