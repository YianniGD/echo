import React from 'react';
import { PlannerTask, JournalEntry, ThoughtRecord } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { BookOpenCheckIcon } from '../icons/BookOpenCheckIcon';
import { LightbulbIcon } from '../icons/LightbulbIcon';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: {
    tasks: PlannerTask[];
    entries: JournalEntry[];
    thoughts: ThoughtRecord[];
  };
  onDayClick: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({ date, isCurrentMonth, isToday, events, onDayClick }) => {
  const completedTasks = events.tasks.filter(t => t.isCompleted).length;
  const incompleteTasks = events.tasks.length - completedTasks;
  
  return (
    <div 
      className={`h-24 sm:h-32 p-2 border-t border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200 cursor-pointer ${
        !isCurrentMonth 
          ? 'bg-gray-50 dark:bg-gray-800/50' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
      onClick={() => onDayClick(date)}
      role="button"
      tabIndex={0}
      aria-label={`View events for ${date.toDateString()}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onDayClick(date)}
    >
      <div className="flex justify-between items-center">
        <time
          dateTime={formatDate(date)}
          className={`text-sm font-semibold ${
            isToday ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
          } ${
            !isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {date.getDate()}
        </time>
        <div className="flex items-center gap-1.5">
            {events.thoughts.length > 0 && (
                <LightbulbIcon className="w-4 h-4 text-yellow-500" />
            )}
            {events.entries.length > 0 && (
                <BookOpenCheckIcon className="w-4 h-4 text-blue-500" />
            )}
        </div>
      </div>
      <div className="mt-1 flex-grow overflow-hidden">
        <div className="flex flex-wrap gap-1">
            {Array.from({ length: Math.min(incompleteTasks, 3) }).map((_, i) => (
                <div key={`inc-${i}`} className="w-2 h-2 rounded-full bg-purple-500" title="Incomplete task"></div>
            ))}
             {Array.from({ length: Math.min(completedTasks, 3) }).map((_, i) => (
                <div key={`com-${i}`} className="w-2 h-2 rounded-full bg-green-500" title="Completed task"></div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DayCell;