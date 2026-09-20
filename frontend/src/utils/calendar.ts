// Real Dynamic Calendar Engine with Multilingual Support
import { Language, translations } from '../i18n/translations';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateKey: string; // YYYY-MM-DD
}

export const getMonthDays = (year: number, monthIndex: number): CalendarDay[] => {
  const today = new Date();
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Monday-based week: 0=Mon, ..., 6=Sun
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const days: CalendarDay[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, monthIndex - 1, prevMonthLastDay - i);
    days.push({
      date: d,
      dayNumber: d.getDate(),
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
      dateKey: formatDateKey(d),
    });
  }

  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(year, monthIndex, i);
    days.push({
      date: d,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: isSameDay(d, today),
      dateKey: formatDateKey(d),
    });
  }

  // Next month leading days to fill grid
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, monthIndex + 1, i);
    days.push({
      date: d,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
      dateKey: formatDateKey(d),
    });
  }

  return days;
};

export const getCurrentWeekDays = (lang: Language = 'ru'): { day: string; date: number; fullDate: Date; isToday: boolean }[] => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday);

  const dayNames = translations[lang].weekDays;
  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({
      day: dayNames[i],
      date: d.getDate(),
      fullDate: d,
      isToday: isSameDay(d, today),
    });
  }

  return week;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const formatMonthYear = (year: number, monthIndex: number, lang: Language = 'ru'): string => {
  const d = new Date(year, monthIndex, 1);
  const locale = lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-US' : 'ru-RU';
  return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
};

// Export to .ics calendar file for Apple Calendar / Google Calendar / Outlook
export const downloadIcsCalendar = (habits: { title: string; alarmTime?: string }[]) => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Daily Sanctuary//Daily Planner//EN',
    'CALSCALE:GREGORIAN',
  ];

  const now = new Date();
  const nowStr = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  habits.forEach((h, idx) => {
    let hour = 9;
    let minute = 0;
    if (h.alarmTime) {
      const parts = h.alarmTime.split(' ');
      const timeParts = parts[0].split(':');
      hour = parseInt(timeParts[0]);
      minute = parseInt(timeParts[1] || '0');
      if (parts[1] === 'PM' && hour < 12) hour += 12;
      if (parts[1] === 'AM' && hour === 12) hour = 0;
    }

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    const end = new Date(start.getTime() + 30 * 60000); // 30 mins

    const startStr = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endStr = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:habit-${idx}-${Date.now()}@dailysanctuary.com`,
      `DTSTAMP:${nowStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${h.title}`,
      'RRULE:FREQ=DAILY',
      'DESCRIPTION:Daily Sanctuary Habit',
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'habits_sanctuary.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
