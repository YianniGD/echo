import React from 'react';
import { getWeekDays, formatDate } from '../../utils/dateUtils';
import { JournalEntry, PlannerTask, ThoughtRecord } from '../../types';
import { BookOpenCheckIcon } from '../icons/BookOpenCheckIcon';
import { LightbulbIcon } from '../icons/LightbulbIcon';

interface WeekViewProps {
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

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const CircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
     <circle cx="12" cy="12" r="10" />
  </svg>
);


const WeekView: React.FC<WeekViewProps> = ({ currentDate, eventsByDate, onDayClick }) => {
  const weekDays = getWeekDays(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md">
      {weekDays.map(day => {
        const isToday = day.getTime() === today.getTime();
        const events = eventsByDate[formatDate(day)] || { entries: [], tasks: [], thoughts: [] };
        const hasEvents = events.entries.length > 0 || events.tasks.length > 0 || events.thoughts.length > 0;

        return (
          <div 
            key={day.toISOString()} 
            className="bg-white dark:bg-gray-800 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => onDayClick(day)}
            role="button"
            tabIndex={0}
            aria-label={`View events for ${day.toDateString()}`}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onDayClick(day)}
          >
            <div className={`text-center mb-3 ${isToday ? 'font-bold text-primary-600 dark:text-primary-400' : ''}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <p className="text-2xl">{day.getDate()}</p>
            </div>
            <div className="space-y-2">
              {events.entries.length > 0 && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 dark:bg-blue-900/30">
                  <BookOpenCheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-200">Journal Entry</span>
                </div>
              )}
              {events.thoughts.length > 0 && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/30">
                  <LightbulbIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-200">Thought Record</span>
                </div>
              )}
              {events.tasks.length > 0 && (
                <div className="space-y-2">
                  {events.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-900/30">
                      {task.isCompleted ? <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" /> : <CircleIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />}
                      <p className={`text-sm text-gray-700 dark:text-gray-200 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {task.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {!hasEvents && (
                  <div className="h-20 flex items-center justify-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">No events</p>
                  </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;