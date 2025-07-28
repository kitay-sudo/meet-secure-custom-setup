config = config || {};

// Русский язык по умолчанию
config.defaultLanguage = 'ru';

// Настройка сигналинга
config.bosh = 'https://meet.mirracoin.io/http-bind';
config.websocket = 'wss://meet.mirracoin.io/xmpp-websocket';

// Отключаем субтитры и расшифровку речи (СС)
config.transcribingEnabled = false;