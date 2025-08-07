import React from 'react';
import DayCell from './DayCell';
import { getMonthCalendarDays, formatDate } from '../../utils/dateUtils';
import { JournalEntry, PlannerTask, ThoughtRecord } from '../../types';

interface MonthViewProps {
  currentDate: Date;
  eventsByDate: {
    [key: string]: {
      entries: JournalEntry[];
      tasks: PlannerTask[];
      thoughts: ThoughtRecord[];
    };
  };
  onDayClick: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthView: React.FC<MonthViewProps> = ({ currentDate, eventsByDate, onDayClick }) => {
  const days = getMonthCalendarDays(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white dark:bg-gray-900/50 border-l border-b border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-7">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-2 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 border-t border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map(day => (
          <DayCell
            key={day.toISOString()}
            date={day}
            isCurrentMonth={day.getMonth() === currentDate.getMonth()}
            isToday={day.getTime() === today.getTime()}
            events={eventsByDate[formatDate(day)] || { entries: [], tasks: [], thoughts: [] }}
            onDayClick={onDayClick}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthView;