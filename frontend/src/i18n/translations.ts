export type Language = 'ru' | 'en' | 'uz';

export interface Translations {
  // Navigation
  navHome: string;
  navCalendar: string;
  navAlarm: string;
  navSettings: string;

  // Header
  appTitle: string;
  greetingMorning: string;
  greetingDay: string;
  greetingEvening: string;

  // Home Screen
  todayProgressTitle: string;
  streakDays: string;
  completedOf: string;
  rituals: string;
  thisWeekTitle: string;
  liveCalendarBadge: string;
  filterAll: string;
  filterMorning: string;
  filterAfternoon: string;
  filterEvening: string;
  stepButtonText: string;

  // Calendar Screen
  calendarTitle: string;
  interactiveCalendarSubtitle: string;
  exportToCalendarBtn: string;
  scheduleFor: string;
  completedTasksCount: string;

  // Alarm Screen
  alarmTitle: string;
  alarmSubtitle: string;
  testSoundBtn: string;
  addAlarmBtn: string;
  editAlarmTitle: string;
  newAlarmTitle: string;
  deleteAlarmBtn: string;
  deleteAlarmConfirm: string;
  alarmSoundLabel: string;

  // Add & Edit Habit Modal
  newRitualTitle: string;
  editRitualTitle: string;
  habitNamePlaceholder: string;
  habitTitleLabel: string;
  inspirationsLabel: string;
  aestheticTitle: string;
  aestheticSubtitle: string;
  categoryLabel: string;
  cadenceLabel: string;
  cadenceSubtitle: string;
  everyday: string;
  weekdays: string;
  targetGoalLabel: string;
  unitLabel: string;
  reminderLabel: string;
  timeRangeLabel: string;
  timeFrom: string;
  timeTo: string;
  createHabitBtn: string;
  saveChangesBtn: string;
  deleteHabitBtn: string;
  deleteConfirm: string;
  cancelBtn: string;
  saveBtn: string;

  // Settings Screen
  settingsTitle: string;
  settingsSubtitle: string;
  languageSection: string;
  languageSelectTitle: string;
  soundEffectsTitle: string;
  soundEffectsSubtitle: string;
  hapticsTitle: string;
  hapticsSubtitle: string;
  resetDataTitle: string;
  resetDataSubtitle: string;
  resetDataBtn: string;
  resetConfirm: string;
  memberBadge: string;
  activeStreak: string;
  overallScore: string;

  // Weekdays Short
  weekDays: [string, string, string, string, string, string, string];
}

export const translations: Record<Language, Translations> = {
  ru: {
    navHome: 'Главная',
    navCalendar: 'Календарь',
    navAlarm: 'Будильник',
    navSettings: 'Настройки',

    appTitle: 'Daily Sanctuary',
    greetingMorning: 'Доброе утро',
    greetingDay: 'Добрый день',
    greetingEvening: 'Добрый вечер',

    todayProgressTitle: 'Прогресс дня',
    streakDays: 'дней подряд',
    completedOf: 'Выполнено {completed} из {total} ритуалов',
    rituals: 'ритуалов',
    thisWeekTitle: 'Текущая неделя',
    liveCalendarBadge: 'Живой календарь',
    filterAll: 'Все',
    filterMorning: 'Утро',
    filterAfternoon: 'День',
    filterEvening: 'Вечер',
    stepButtonText: '+ 500 шагов',

    calendarTitle: 'Календарь',
    interactiveCalendarSubtitle: 'Интерактивный календарь',
    exportToCalendarBtn: 'В календарь',
    scheduleFor: 'Расписание на',
    completedTasksCount: '{completed}/{total} выполнено',

    alarmTitle: 'Будильники',
    alarmSubtitle: 'Напоминания и подъем',
    testSoundBtn: 'Тест звука',
    addAlarmBtn: 'Добавить напоминание',
    editAlarmTitle: 'Редактировать будильник',
    newAlarmTitle: 'Новый будильник',
    deleteAlarmBtn: 'Удалить будильник',
    deleteAlarmConfirm: 'Вы уверены, что хотите удалить этот будильник?',
    alarmSoundLabel: 'Звук мелодии',


    newRitualTitle: 'Новый ритуал',
    editRitualTitle: 'Редактировать ритуал',
    habitNamePlaceholder: 'Название ритуала',
    habitTitleLabel: 'Название привычки',
    inspirationsLabel: 'Быстрый выбор',
    aestheticTitle: 'Символ и цвет',
    aestheticSubtitle: 'Выберите иконку и цвет оформления',
    categoryLabel: 'Категория',
    cadenceLabel: 'Периодичность',
    cadenceSubtitle: 'Когда выполнять ритуал?',
    everyday: 'Каждый день',
    weekdays: 'Будни',
    targetGoalLabel: 'Целевое значение',
    unitLabel: 'Единица измерения',
    reminderLabel: 'Время выполнения / интервал',
    timeRangeLabel: 'Интервал времени',
    timeFrom: 'С',
    timeTo: 'До',
    createHabitBtn: 'Создать привычку',
    saveChangesBtn: 'Сохранить изменения',
    deleteHabitBtn: 'Удалить привычку',
    deleteConfirm: 'Вы уверены, что хотите удалить эту привычку?',
    cancelBtn: 'Отмена',
    saveBtn: 'Сохранить',

    settingsTitle: 'Настройки',
    settingsSubtitle: 'Параметры приложения',
    languageSection: 'Язык интерфейса',
    languageSelectTitle: 'Выберите язык',
    soundEffectsTitle: 'Звуковые сигналы',
    soundEffectsSubtitle: 'Звук колокольчика при завершении',
    hapticsTitle: 'Виброотклик (Haptics)',
    hapticsSubtitle: 'Тактильная отдача в Telegram',
    resetDataTitle: 'Сброс данных',
    resetDataSubtitle: 'Очистить историю и вернуть исходные',
    resetDataBtn: 'Сбросить',
    resetConfirm: 'Вы уверены, что хотите сбросить все данные?',
    memberBadge: 'Премиум участник ✨',
    activeStreak: 'Активная серия',
    overallScore: 'Общий счет',

    weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  },

  en: {
    navHome: 'Home',
    navCalendar: 'Calendar',
    navAlarm: 'Alarm',
    navSettings: 'Settings',

    appTitle: 'Daily Sanctuary',
    greetingMorning: 'Good morning',
    greetingDay: 'Good afternoon',
    greetingEvening: 'Good evening',

    todayProgressTitle: 'Today\'s Progress',
    streakDays: 'day streak',
    completedOf: 'Completed {completed} of {total} rituals',
    rituals: 'rituals',
    thisWeekTitle: 'This Week',
    liveCalendarBadge: 'Live Calendar',
    filterAll: 'All',
    filterMorning: 'Morning',
    filterAfternoon: 'Afternoon',
    filterEvening: 'Evening',
    stepButtonText: '+ 500 steps',

    calendarTitle: 'Calendar',
    interactiveCalendarSubtitle: 'Interactive Calendar',
    exportToCalendarBtn: 'Sync Calendar',
    scheduleFor: 'Schedule for',
    completedTasksCount: '{completed}/{total} completed',

    alarmTitle: 'Alarms',
    alarmSubtitle: 'Reminders & Wake-up',
    testSoundBtn: 'Test Sound',
    addAlarmBtn: 'Add Reminder',
    editAlarmTitle: 'Edit Alarm',
    newAlarmTitle: 'New Alarm',
    deleteAlarmBtn: 'Delete Alarm',
    deleteAlarmConfirm: 'Are you sure you want to delete this alarm?',
    alarmSoundLabel: 'Alarm Sound',


    newRitualTitle: 'New Ritual',
    editRitualTitle: 'Edit Ritual',
    habitNamePlaceholder: 'Ritual Name',
    habitTitleLabel: 'Habit Title',
    inspirationsLabel: 'Inspirations',
    aestheticTitle: 'Aesthetic & Symbol',
    aestheticSubtitle: 'Select talisman and visual hue',
    categoryLabel: 'Category',
    cadenceLabel: 'Cadence & Cycle',
    cadenceSubtitle: 'When does this ritual live?',
    everyday: 'Every day',
    weekdays: 'Weekdays',
    targetGoalLabel: 'Target Goal',
    unitLabel: 'Unit Metric',
    reminderLabel: 'Execution time / interval',
    timeRangeLabel: 'Time Range',
    timeFrom: 'From',
    timeTo: 'To',
    createHabitBtn: 'Create Habit',
    saveChangesBtn: 'Save Changes',
    deleteHabitBtn: 'Delete Habit',
    deleteConfirm: 'Are you sure you want to delete this habit?',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',

    settingsTitle: 'Settings',
    settingsSubtitle: 'App Preferences',
    languageSection: 'App Language',
    languageSelectTitle: 'Select Language',
    soundEffectsTitle: 'Sound Effects',
    soundEffectsSubtitle: 'Soft chimes on completion',
    hapticsTitle: 'Haptic Feedback',
    hapticsSubtitle: 'Tactile subtle pulses in Telegram',
    resetDataTitle: 'Reset Data',
    resetDataSubtitle: 'Clear storage and restore defaults',
    resetDataBtn: 'Reset',
    resetConfirm: 'Are you sure you want to reset all data?',
    memberBadge: 'Habit Pro Member ✨',
    activeStreak: 'Active Streak',
    overallScore: 'Overall Score',

    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },

  uz: {
    navHome: 'Asosiy',
    navCalendar: 'Taqvim',
    navAlarm: 'Budilnik',
    navSettings: 'Sozlamalar',

    appTitle: 'Daily Sanctuary',
    greetingMorning: 'Xayrli tong',
    greetingDay: 'Xayrli kun',
    greetingEvening: 'Xayrli kech',

    todayProgressTitle: 'Bugungi natija',
    streakDays: 'kun ketma-ket',
    completedOf: '{total} tadan {completed} ta odat bajarildi',
    rituals: 'odatlar',
    thisWeekTitle: 'Joriy hafta',
    liveCalendarBadge: 'Jonli taqvim',
    filterAll: 'Barchasi',
    filterMorning: 'Tong',
    filterAfternoon: 'Kunduzi',
    filterEvening: 'Kechqurun',
    stepButtonText: '+ 500 qadam',

    calendarTitle: 'Taqvim',
    interactiveCalendarSubtitle: 'Interaktiv taqvim',
    exportToCalendarBtn: 'Taqvimga yuklash',
    scheduleFor: 'Reja sanasi:',
    completedTasksCount: '{completed}/{total} bajarildi',

    alarmTitle: 'Budilniklar',
    alarmSubtitle: 'Eslatma va uyg\'onish',
    testSoundBtn: 'Ovozni tekshirish',
    addAlarmBtn: 'Eslatma qo\'shish',
    editAlarmTitle: 'Budilnikni tahrirlash',
    newAlarmTitle: 'Yangi budilnik',
    deleteAlarmBtn: 'Budilnikni o\'chirish',
    deleteAlarmConfirm: 'Ushbu budilnikni o\'chirishga ishonchingiz komilmi?',
    alarmSoundLabel: 'Budilnik kuyi',


    newRitualTitle: 'Yangi odat',
    editRitualTitle: 'Odatni tahrirlash',
    habitNamePlaceholder: 'Odat nomi',
    habitTitleLabel: 'Odat nomi',
    inspirationsLabel: 'Tezkor tanlov',
    aestheticTitle: 'Belgi va rang',
    aestheticSubtitle: 'Belgi va rang tanlang',
    categoryLabel: 'Kategoriya',
    cadenceLabel: 'Takrorlanish',
    cadenceSubtitle: 'Qachon bajarilsin?',
    everyday: 'Har kuni',
    weekdays: 'Ish kunlari',
    targetGoalLabel: 'Maqsad miqdori',
    unitLabel: 'O\'lchov birligi',
    reminderLabel: 'Bajarish vaqti / oralig\'i',
    timeRangeLabel: 'Vaqt oralig\'i',
    timeFrom: 'Dan',
    timeTo: 'Gacha',
    createHabitBtn: 'Odatni yaratish',
    saveChangesBtn: 'O\'zgarishlarni saqlash',
    deleteHabitBtn: 'Odatni o\'chirish',
    deleteConfirm: 'Haqiqatan ham bu odatni o\'chirmoqchimisiz?',
    cancelBtn: 'Bekor qilish',
    saveBtn: 'Saqlash',

    settingsTitle: 'Sozlamalar',
    settingsSubtitle: 'Dastur parametrlari',
    languageSection: 'Dastur tili',
    languageSelectTitle: 'Tilni tanlang',
    soundEffectsTitle: 'Ovoz signallari',
    soundEffectsSubtitle: 'Bajarilganda yoqimli qo\'ng\'iroq ovozi',
    hapticsTitle: 'Tebranish (Haptics)',
    hapticsSubtitle: 'Telegram tebranish hissi',
    resetDataTitle: 'Ma\'lumotlarni tozalash',
    resetDataSubtitle: 'Barcha ma\'lumotlarni qayta tiklash',
    resetDataBtn: 'Tozalash',
    resetConfirm: 'Haqiqatan ham barcha ma\'lumotlarni tozalashni xohlaysizmi?',
    memberBadge: 'Habit Pro A\'zosi ✨',
    activeStreak: 'Faol seriya',
    overallScore: 'Umumiy ball',

    weekDays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
  },
};
