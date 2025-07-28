interfaceConfig = interfaceConfig || {};

// Общий брендинг
interfaceConfig.APP_NAME = 'MyVideoCall';
interfaceConfig.SHOW_JITSI_WATERMARK = false;
interfaceConfig.SHOW_BRAND_WATERMARK = false;
interfaceConfig.SHOW_POWERED_BY = false;
interfaceConfig.SHOW_WATERMARK_FOR_GUESTS = false;

// ВАЖНО: Отключаем страницу приветствия и мобильные приложения
interfaceConfig.ENABLE_WELCOME_PAGE = false;
interfaceConfig.MOBILE_APP_PROMO = false;

// Отключаем показ ссылок на мобильные приложения
interfaceConfig.MOBILE_DOWNLOAD_LINK_ANDROID = '';
interfaceConfig.MOBILE_DOWNLOAD_LINK_IOS = '';

// Настройки тулбара
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

// Отключаем уведомления о мобильных приложениях
interfaceConfig.ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT = 0;
interfaceConfig.NOTIFICATION_TIMEOUT = {
    LONG: 0,
    MEDIUM: 0,
    SHORT: 0
}; 