'use client';
import React, from 'react';
import { CalendarEvent, JournalEntry, ThoughtRecord } from '@/lib/types';
import { fromISOStringToLocalDate, isSameDay, formatToHHMM } from '@/components/echo/calendar/DateUtils';
import { BookOpen, Clipboard, ChevronLeft, ChevronRight } from 'lucide-react';
import ActionButton from '@/components/echo/ActionButton';

interface DayViewProps {
  currentDisplayDate: Date;
  events: CalendarEvent[];
  journalEntries: JournalEntry[];
  thoughtRecords: ThoughtRecord[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
  currentDateTitle: string;
  onViewJournalEntry: (entry: JournalEntry) => void;
  onViewThoughtRecord: (record: ThoughtRecord) => void;
}

const DayView: React.FC<DayViewProps> = ({ 
  currentDisplayDate, 
  events, 
  journalEntries, 
  thoughtRecords,
  onEventClick, 
  onAddEvent,
  onPrev,
  onNext,
  currentDateTitle,
  onViewJournalEntry,
  onViewThoughtRecord
}) => {
  const dayEvents = events.filter(event => {
    const eventStart = fromISOStringToLocalDate(event.start);
    const eventEnd = fromISOStringToLocalDate(event.end);
    if (event.allDay) {
        const dateOnly = new Date(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth(), currentDisplayDate.getDate());
        const eventStartDateOnly = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
        const eventEndDateOnly = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
        return dateOnly >= eventStartDateOnly && dateOnly <= eventEndDateOnly;
    }
    return isSameDay(eventStart, currentDisplayDate);
  }).sort((a,b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    const startA = fromISOStringToLocalDate(a.start).getTime();
    const startB = fromISOStringToLocalDate(b.start).getTime();
    return startA - startB;
  });

  const allDayEvents = dayEvents.filter(e => e.allDay);
  const timedEvents = dayEvents.filter(e => !e.allDay);

  const dayJournalEntries = journalEntries.filter(entry => isSameDay(new Date(entry.timestamp), currentDisplayDate));
  const dayThoughtRecords = thoughtRecords.filter(record => isSameDay(new Date(record.timestamp), currentDisplayDate));
  
  return (
    <div className="bg-surface-container-low shadow-lg rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant">
          <h2 className="font-serif text-headline-sm sm:text-headline-md text-surface-on truncate" title={currentDateTitle}>
            {currentDateTitle}
          </h2>
          <div className="flex items-center gap-1">
              <ActionButton onClick={onPrev} variant="tonal" size="sm" isIconOnly leadingIcon={<ChevronLeft />} aria-label="Previous day" />
              <ActionButton onClick={onNext} variant="tonal" size="sm" isIconOnly leadingIcon={<ChevronRight />} aria-label="Next day" />
          </div>
      </div>
      
      <div className="space-y-6">
        {/* Entries Section */}
        {(dayJournalEntries.length > 0 || dayThoughtRecords.length > 0) && (
          <div className="space-y-2">
            <h3 className="font-serif text-title-md text-surface-on">Entries & Records</h3>
            {dayJournalEntries.map(entry => (
              <button
                key={entry.id}
                onClick={() => onViewJournalEntry(entry)}
                className="w-full text-left flex items-center gap-2 p-3 bg-secondary-container/30 rounded-lg text-sm text-on-secondary-container cursor-pointer hover:bg-secondary-container/50"
              >
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Journal: {entry.title || `Entry from ${formatToHHMM(new Date(entry.timestamp))}`}</span>
              </button>
            ))}
             {dayThoughtRecords.map(record => (
              <button
                key={record.id}
                onClick={() => onViewThoughtRecord(record)}
                className="w-full text-left flex items-center gap-2 p-3 bg-tertiary-container/30 rounded-lg text-sm text-on-tertiary-container cursor-pointer hover:bg-tertiary-container/50"
              >
                <Clipboard className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Thought Record: {record.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* All-day Events Section */}
        {allDayEvents.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-serif text-title-md text-surface-on">All-Day Events</h3>
            <div className="space-y-1">
              {allDayEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={`p-2 rounded-md text-white text-sm truncate cursor-pointer hover:opacity-80 transition-opacity ${event.color || 'bg-indigo-500'}`}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timed Events Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-title-md text-surface-on">
            {timedEvents.length > 0 ? "Scheduled Events" : "No Scheduled Events"}
          </h3>
          {timedEvents.length > 0 ? (
            <ul className="space-y-3">
              {timedEvents.map(event => (
                <li 
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary whitespace-nowrap">{formatToHHMM(fromISOStringToLocalDate(event.start))}</p>
                    <p className="text-xs text-primary/80 whitespace-nowrap">{formatToHHMM(fromISOStringToLocalDate(event.end))}</p>
                  </div>
                  <div className="w-1 h-full flex justify-center">
                      <div className={`w-0.5 h-full rounded-full ${event.color || 'bg-indigo-500'}`}></div>
                  </div>
                  <div className={`flex-grow p-3 rounded-md text-white -mt-1 group-hover:opacity-80 transition-opacity ${event.color || 'bg-indigo-500'}`}>
                      <p className="font-bold text-sm">{event.title}</p>
                      {event.description && <p className="text-xs opacity-90">{event.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
              <div 
                onClick={() => onAddEvent(currentDisplayDate)}
                className="text-center text-surface-on-variant py-8 cursor-pointer hover:bg-surface-container rounded-lg"
              >
                <p>Click here to add an event.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;
