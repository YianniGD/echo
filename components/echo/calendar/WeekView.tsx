'use client';
import React from 'react';
import { CalendarEvent, JournalEntry, ThoughtRecord } from '@/lib/types';
import { startOfWeek, addDays, isSameDay, fromISOStringToLocalDate, formatToHHMM } from '@/components/echo/calendar/DateUtils';
import { BookOpen, Clipboard, ChevronLeft, ChevronRight } from 'lucide-react';
import ActionButton from '@/components/echo/ActionButton';

interface WeekViewProps {
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

const WeekView: React.FC<WeekViewProps> = ({
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
  onViewThoughtRecord
}) => {
  const today = new Date();
  const weekStartsOn = 0; // Sunday
  const startDate = startOfWeek(currentDisplayDate, weekStartsOn);

  const days: Date[] = [];
  for(let i = 0; i < 7; i++){
    days.push(addDays(startDate, i));
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
      return isSameDay(eventStart, date);
    }).sort((a,b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        const startA = fromISOStringToLocalDate(a.start).getTime();
        const startB = fromISOStringToLocalDate(b.start).getTime();
        return startA - startB;
    });
  };

  const getJournalEntryForDate = (date: Date): JournalEntry | undefined => {
    return journalEntries.find(entry => isSameDay(new Date(entry.timestamp), date));
  };
  
  const getThoughtRecordForDate = (date: Date): ThoughtRecord | undefined => {
    return thoughtRecords.find(record => isSameDay(new Date(record.timestamp), date));
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-surface-container-low shadow-lg rounded-xl">
          <h2 className="font-serif text-headline-sm sm:text-headline-md text-surface-on truncate" title={currentDateTitle}>
            {currentDateTitle}
          </h2>
          <div className="flex items-center gap-1">
              <ActionButton onClick={onPrev} variant="tonal" size="sm" isIconOnly leadingIcon={<ChevronLeft />} aria-label="Previous week" />
              <ActionButton onClick={onNext} variant="tonal" size="sm" isIconOnly leadingIcon={<ChevronRight />} aria-label="Next week" />
          </div>
      </div>
      
      {days.map((d, index) => {
        const dayEvents = getEventsForDate(d);
        const journalEntryOnDay = getJournalEntryForDate(d);
        const thoughtRecordOnDay = getThoughtRecordForDate(d);
        const isToday = isSameDay(d, today);

        return (
          <div
            key={index}
            className="bg-surface-container-low shadow-lg rounded-xl p-4 sm:p-5 cursor-pointer hover:bg-surface-container transition-colors"
            onClick={() => onDateClick(d)}
            role="article"
            aria-labelledby={`day-header-${index}`}
          >
            <div id={`day-header-${index}`} className="flex items-center justify-between mb-3">
              <h3 className={`font-serif text-title-lg ${isToday ? 'text-primary' : 'text-surface-on'}`}>
                {d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2">
                {journalEntryOnDay && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewJournalEntry(journalEntryOnDay);
                    }}
                    className="p-1 -m-1 rounded-full hover:bg-surface-container-high"
                    aria-label="View journal entry on this day"
                  >
                    <BookOpen className="w-5 h-5 text-secondary" />
                  </button>
                )}
                {thoughtRecordOnDay && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewThoughtRecord(thoughtRecordOnDay);
                    }}
                    className="p-1 -m-1 rounded-full hover:bg-surface-container-high"
                    aria-label="View thought record on this day"
                  >
                    <Clipboard className="w-5 h-5 text-tertiary" />
                  </button>
                )}
              </div>
            </div>

            {dayEvents.length > 0 ? (
              <div className="space-y-1.5">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                    className={`p-2 rounded-md text-white text-sm truncate cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 ${event.color || 'bg-indigo-500'}`}
                    title={event.title}
                  >
                    {!event.allDay && <span className="font-semibold text-xs whitespace-nowrap">{formatToHHMM(fromISOStringToLocalDate(event.start))}</span>}
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-on-variant text-center py-4 italic">No events scheduled.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
