// This file will contain utility functions for date manipulation.
// For now, it's a placeholder.

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0];
};

export const getTodayDateString = (): string => {
    const today = new Date();
    // Adjust for timezone offset to get the correct local date.
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
    return todayWithOffset.toISOString().split('T')[0];
};

export const formatDateForInput = (isoDate: string): string => {
    return isoDate.split('T')[0];
};

export const getMonthCalendarDays = (year: number, month: number): Date[] => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const startDayOfWeek = startDate.getDay(); // 0 (Sun) - 6 (Sat)
    
    const days: Date[] = [];
    
    // Days from previous month
    for (let i = 0; i < startDayOfWeek; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() - (startDayOfWeek - i));
        days.push(date);
    }
    
    // Days from current month
    for (let i = 1; i <= endDate.getDate(); i++) {
        days.push(new Date(year, month, i));
    }
    
    // Days from next month
    const endDayOfWeek = endDate.getDay();
    for (let i = 1; i < 7 - endDayOfWeek; i++) {
        const date = new Date(endDate);
        date.setDate(date.getDate() + i);
        days.push(date);
    }

    return days;
};

export const getWeekDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week;
};