export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days: Date[] = [];
  const numDays = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= numDays; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
};

export const getMonthName = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleDateString(locale, { month: 'long' });
};

export const getYear = (date: Date): number => {
  return date.getFullYear();
};

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const startOfWeek = (date: Date, weekStartsOn: number = 0): Date => { // 0 for Sunday, 1 for Monday
  const day = date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const endOfWeek = (date: Date, weekStartsOn: number = 0): Date => {
  const sow = startOfWeek(date, weekStartsOn);
  const newDate = new Date(sow);
  newDate.setDate(sow.getDate() + 6);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const formatToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatToHHMM = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Parses YYYY-MM-DD and HH:mm into a Date object
export const parseDateTime = (dateStr: string, timeStr?: string): Date => {
    if (!timeStr) { // If only date string is provided, assume it's an all-day event starting at UTC midnight
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
};

// Converts a local date and optional time to an ISO string. For all-day events, it's YYYY-MM-DD.
export const toISOStringWithLocalTimezone = (date: Date, allDay: boolean): string => {
  if (allDay) {
    return formatToYYYYMMDD(date); // Store all-day events as YYYY-MM-DD
  }
  // For timed events, keep local time but format as ISO string
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  // This will represent local time. Parsing should also assume local time or be timezone-aware.
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};


// Creates a Date object from an ISO string, interpreting YYYY-MM-DD as local midnight
export const fromISOStringToLocalDate = (isoString: string): Date => {
  if (isoString.length === 10 && isoString.match(/^\d{4}-\d{2}-\d{2}$/)) { // YYYY-MM-DD
    const [year, month, day] = isoString.split('-').map(Number);
    return new Date(year, month - 1, day); // Local midnight
  }
  return new Date(isoString); // Full ISO string, parsed by Date constructor
};


export const getWeekdays = (locale: string = 'en-US', weekStartsOn: number = 0): string[] => {
  const baseDate = startOfWeek(new Date(), weekStartsOn);
  const weekdays: string[] = [];
  for (let i = 0; i < 7; i++) {
    weekdays.push(addDays(baseDate, i).toLocaleDateString(locale, { weekday: 'short' }));
  }
  return weekdays;
};

export const formatWeekRangeDisplay = (date: Date, weekStartsOn: number = 0): string => {
  const sow = startOfWeek(date, weekStartsOn);
  const eow = endOfWeek(date, weekStartsOn);
  const startMonth = sow.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = eow.toLocaleDateString('en-US', { month: 'short' });

  if (sow.getFullYear() !== eow.getFullYear()) {
    return `${sow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${eow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  if (startMonth === endMonth) {
    return `${startMonth} ${sow.getDate()} - ${eow.getDate()}, ${sow.getFullYear()}`;
  }
  return `${startMonth} ${sow.getDate()} - ${endMonth} ${eow.getDate()}, ${sow.getFullYear()}`;
};

export const formatDayViewHeader = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};
