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

---

## 🐳 docker-compose.yml (добавь в `web:`)

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