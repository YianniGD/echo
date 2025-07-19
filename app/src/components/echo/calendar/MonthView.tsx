'use client';
import React from 'react';
import { CalendarEvent, JournalEntry, ThoughtRecord } from '@/lib/types';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, fromISOStringToLocalDate, getWeekdays, getMonthName } from '@/components/echo/calendar/DateUtils';
import { BookOpen, Clipboard, ChevronLeft, ChevronRight } from 'lucide-react';
import ActionButton from '@/components/echo/ActionButton';

interface MonthViewProps {
  currentDisplayDate: Date;
  events: CalendarEvent[];
  journalEntries: JournalEntry[];
  thoughtRecords: ThoughtRecord[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onPrev: () => void;
  onNext: () => void;
  currentDateTitle: string;
  onViewJournalEntry: (entry: JournalEntry) => void;
  onViewThoughtRecord: (record: ThoughtRecord) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDisplayDate,
  events,
  journalEntries,
  thoughtRecords,
  onDateClick,
  onEventClick,
  onPrev,
  onNext,
  currentDateTitle,
  onViewJournalEntry,
  onViewThoughtRecord,
}) => {
  const today = new Date();
  const monthStart = startOfMonth(currentDisplayDate);
  const monthEnd = endOfMonth(currentDisplayDate);
  const startDate = startOfWeek(monthStart, 0); 
  const endDate = endOfWeek(monthEnd, 0);

  const weekDayNames = getWeekdays('en-US', 0);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(new Date(day));
    day = addDays(day, 1);
  }

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventStart = fromISOStringToLocalDate(event.start);
      const eventEnd = fromISOStringToLocalDate(event.end);
      if (event.allDay) {
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const eventStartDateOnly = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
        const eventEndDateOnly = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
        return dateOnly >= eventStartDateOnly && dateOnly <= eventEndDateOnly;
      }
      return date >= eventStart && date < addDays(eventEnd, 1);
    }).sort((a,b) => (a.allDay === b.allDay) ? 0 : a.allDay ? -1 : 1);
  };

  const getJournalEntryForDate = (date: Date): JournalEntry | undefined => {
    return journalEntries.find(entry => isSameDay(new Date(entry.timestamp), date));
  };
  
  const getThoughtRecordForDate = (date: Date): ThoughtRecord | undefined => {
    return thoughtRecords.find(record => isSameDay(new Date(record.timestamp), date));
  };


  return (
    <div className="bg-surface-container-low shadow-lg rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <h2 className="font-serif text-headline-sm sm:text-headline-md text-surface-on truncate" title={currentDateTitle}>
            {currentDateTitle}
          </h2>
          <div className="flex items-center gap-1">
              <ActionButton onClick={onPrev} variant="tonal" size="sm" isIconOnly leadingIcon={<ChevronLeft />} aria-label="Previous month" />
              <ActionButton onClick={onNext} variant="tonal" size="sm" isIconOnly leadingIcon={<ChevronRight />} aria-label="Next month" />
          </div>
      </div>

      <div className="grid grid-cols-7 border-b border-outline-variant">
        {weekDayNames.map(dayName => (
          <div key={dayName} className="p-2 text-center text-label-md font-medium text-surface-on-variant">
            {dayName}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[minmax(100px,_1fr)] sm:auto-rows-[minmax(140px,_1fr)] md:auto-rows-[minmax(160px,_1fr)]">
        {days.map((d, index) => {
          const isCurrentMonth = isSameMonth(d, currentDisplayDate);
          const isToday = isSameDay(d, today);
          const dayEvents = getEventsForDate(d);
          const journalEntryForDay = getJournalEntryForDate(d);
          const thoughtRecordForDay = getThoughtRecordForDate(d);

          return (
            <div
              key={index}
              className={`p-2 sm:p-3 border border-outline-variant/30 
                          transition-colors duration-200 ease-in-out cursor-pointer group
                          ${isCurrentMonth ? 'bg-surface-container-low hover:bg-surface-container' : 'bg-surface-container-lowest text-surface-on-variant/50 hover:bg-surface-container/50'}
                          `}
              onClick={() => onDateClick(d)}
              role="gridcell"
              aria-label={`Date ${d.getDate()} ${getMonthName(d)}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs sm:text-sm font-medium rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center
                  ${isToday ? 'bg-primary text-primary-foreground' : isCurrentMonth ? 'text-surface-on' : 'text-surface-on-variant/70'}
                  group-hover:text-primary`}
                >
                  {d.getDate()}
                </span>
                <div className="flex items-center gap-1.5">
                  {journalEntryForDay && isCurrentMonth && (
                    <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onViewJournalEntry(journalEntryForDay); 
                        }}
                        className="p-1 -m-1 rounded-full hover:bg-surface-container-high"
                        aria-label="View journal entry"
                      >
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                      </button>
                  )}
                  {thoughtRecordForDay && isCurrentMonth && (
                    <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onViewThoughtRecord(thoughtRecordForDay); 
                        }}
                        className="p-1 -m-1 rounded-full hover:bg-surface-container-high"
                        aria-label="View thought record"
                      >
                        <Clipboard className="w-3 h-3 sm:w-4 sm:h-4 text-tertiary" />
                      </button>
                  )}
                </div>
              </div>
              
              {isCurrentMonth && (
                <div className="space-y-0.5 overflow-y-auto max-h-[48px] sm:max-h-[80px] md:max-h-[100px] text-xs">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      className={`px-1.5 py-0.5 rounded ${event.color || 'bg-indigo-500'} text-white text-[0.6rem] sm:text-xs truncate cursor-pointer hover:opacity-80`}
                      title={event.title}
                    >
                      {event.allDay && <span className="font-semibold">All Day: </span>}
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[0.6rem] sm:text-xs text-surface-on-variant text-center">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
