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