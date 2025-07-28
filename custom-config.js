config = config || {};

// Русский язык по умолчанию
config.defaultLanguage = 'ru';

// Отключаем глубокие ссылки и перенаправление на мобильное приложение
config.disableDeepLinking = true;

// Отключаем детекцию мобильного приложения
config.enableMobileSimulcast = false;

// Отключаем страницу предварительного входа (prejoin)
config.prejoinPageEnabled = false;

// Отключаем показ страницы приложения для мобильных устройств
config.enableInsecureRoomNameWarning = false;

// Отключаем запросы к внешним ресурсам (включая проверку мобильных приложений)
config.disableThirdPartyRequests = true;

// Принудительно открывать в браузере
config.enableNoAudioDetection = false;
config.enableNoisyMicDetection = false;

// Отключаем субтитры и расшифровку речи (СС)
config.transcribingEnabled = false;

// Настройки для мобильных устройств
config.startWithAudioMuted = false;
config.startWithVideoMuted = false;

// Отключаем дополнительные уведомления
config.enableWelcomePage = false;
config.enableClosePage = false; 