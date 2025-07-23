# 🚀 Установка и запуск Jitsi Meet в Docker с кастомным интерфейсом и логикой выхода

## 📦 Требования

- Docker + Docker Compose
- Домен (например, `meet.example.com`) с A-записью на сервер
- Порты 80, 443 (TCP) и 10000 (UDP)

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
ENABLE_LETSENCRYPT=1
LETSENCRYPT_DOMAIN=meet.example.com
LETSENCRYPT_EMAIL=admin@example.com

ENABLE_XMPP_WEBSOCKET=1
ENABLE_TRANSCRIPTIONS=0
ENABLE_RECORDING=0
ENABLE_LIVESTREAMING=0
ENABLE_WELCOME_PAGE=0

ENABLE_AUTH=1
AUTH_TYPE=internal
XMPP_DOMAIN=meet.example.com
XMPP_AUTH_DOMAIN=auth.meet.example.com
XMPP_GUEST_DOMAIN=guest.meet.example.com
```

### 3. Генерация паролей

```bash
./gen-passwords.sh
```

---

## 👤 Авторизация и режим "Ждём организатора"

```bash
docker compose exec prosody prosodyctl --config /config/prosody.cfg.lua register admin meet.example.com mypassword
```

---

## 🎨 Кастомизация интерфейса

### `custom-config.js`

```js
config = config || {};
config.defaultLanguage = 'ru';
config.transcribingEnabled = false;
config.customStyleUrl = '/custom.css';
config.enableUserScript = true;
config.analyticsScriptUrls = [
  '/custom-hangup-override.js'
];
```

### `custom-interface_config.js`

```js
interfaceConfig = interfaceConfig || {};
interfaceConfig.APP_NAME = 'MyVideoCall';
interfaceConfig.SHOW_JITSI_WATERMARK = false;
interfaceConfig.SHOW_BRAND_WATERMARK = false;
interfaceConfig.SHOW_POWERED_BY = false;
interfaceConfig.SHOW_WATERMARK_FOR_GUESTS = false;
interfaceConfig.ENABLE_WELCOME_PAGE = false;
```

### `custom.css` — розовая кнопка выхода

```css
#hangupButton > .toolbox-icon {
    background-color: #b78bf7 !important;
    border-radius: 50% !important;
}
#hangupButton:hover > .toolbox-icon {
    background-color: #7569f0 !important;
}
```

### `custom-hangup-override.js` — мгновенный выход

```js
APP.UI.emitEvent = (function(original) {
    return function(event, data) {
        if (event === 'hangup') {
            APP.conference.hangup();
            return;
        }
        return original.apply(this, arguments);
    };
})(APP.UI.emitEvent);
```

---

## 🐳 docker-compose.yml (добавь в `web:`)

```yaml
volumes:
  - ${CONFIG}/web:/config:Z
  - ${CONFIG}/web/custom.css:/usr/share/jitsi-meet/custom.css
  - ${CONFIG}/web/custom-hangup-override.js:/usr/share/jitsi-meet/custom-hangup-override.js
```

---

## 🚀 Запуск

```bash
docker compose up -d
```

Проверка:

```bash
docker compose ps
```

Открой в браузере: `https://meet.example.com`

✅ Интерфейс — фиолетовый, кастомный.  
✅ Кнопка выхода розовая.  
✅ Сразу покидает конференцию.  
✅ Без логотипов Jitsi.