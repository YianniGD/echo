
'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { CalendarEvent, JournalEntry, ThoughtRecord } from '@/lib/types';
import CalendarHeader from '@/components/echo/calendar/CalendarHeader';
import MonthView from '@/components/echo/calendar/MonthView';
import WeekView from '@/components/echo/calendar/WeekView'; 
import DayView from '@/components/echo/calendar/DayView';   
import EventModal from '@/components/echo/calendar/EventModal';
import EventViewModal from '@/components/echo/calendar/EventViewModal';
import { addMonths, addDays, fromISOStringToLocalDate, getMonthName, getYear, formatWeekRangeDisplay, formatDayViewHeader } from '@/components/echo/calendar/DateUtils';

type CalendarViewMode = 'month' | 'week' | 'day';

interface CalendarPageProps {
  events: CalendarEvent[];
  journalEntries: JournalEntry[];
  thoughtRecords: ThoughtRecord[];
  onAddEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onViewJournalEntry: (entry: JournalEntry) => void;
  onViewThoughtRecord: (record: ThoughtRecord) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({
  events,
  journalEntries,
  thoughtRecords,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onViewJournalEntry,
  onViewThoughtRecord,
}) => {
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | undefined>(undefined);
  
  const [isEventViewModalOpen, setIsEventViewModalOpen] = useState(false);
  const [selectedEventForView, setSelectedEventForView] = useState<CalendarEvent | null>(null);

  const handlePrev = useCallback(() => {
    setCurrentDisplayDate(prev => {
      switch (viewMode) {
        case 'month': return addMonths(prev, -1);
        case 'week': return addDays(prev, -7);
        case 'day': return addDays(prev, -1);
        default: return prev;
      }
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDisplayDate(prev => {
      switch (viewMode) {
        case 'month': return addMonths(prev, 1);
        case 'week': return addDays(prev, 7);
        case 'day': return addDays(prev, 1);
        default: return prev;
      }
    });
  }, [viewMode]);

  const handleViewChange = useCallback((newView: CalendarViewMode) => {
    setViewMode(newView);
  }, []);

  const handleOpenAddEventModal = (date?: Date) => {
    setEventToEdit(null);
    setSelectedDateForModal(date || new Date()); // Default to today or selected date
    setIsEventModalOpen(true);
  };
  
  const handleOpenEditEventModal = (event: CalendarEvent) => {
    setEventToEdit(event);
    setSelectedDateForModal(fromISOStringToLocalDate(event.start));
    setIsEventModalOpen(true);
  };

  const handleOpenViewEventModal = (event: CalendarEvent) => {
    setSelectedEventForView(event);
    setIsEventViewModalOpen(true);
  };
  
  const handleDateClick = (date: Date) => {
     // If in month or week view, switch to day view for the clicked date
    if (viewMode === 'month' || viewMode === 'week') {
      setCurrentDisplayDate(date);
      setViewMode('day');
    } else {
      // If already in day view, open the add event modal
      handleOpenAddEventModal(date);
    }
  };


  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'> & { id?: string }) => {
    if (eventData.id) {
      onUpdateEvent(eventData as CalendarEvent);
    } else {
      onAddEvent(eventData as Omit<CalendarEvent, 'id'>);
    }
    setIsEventModalOpen(false);
  };
  
  const memoizedEvents = useMemo(() => events, [events]);
  const memoizedJournalEntries = useMemo(() => journalEntries, [journalEntries]);
  const memoizedThoughtRecords = useMemo(() => thoughtRecords, [thoughtRecords]);

  const renderDateTitle = () => {
    switch(viewMode) {
      case 'month':
        return `${getMonthName(currentDisplayDate)} ${getYear(currentDisplayDate)}`;
      case 'week':
        return formatWeekRangeDisplay(currentDisplayDate, 0); // Assuming week starts on Sunday
      case 'day':
        return formatDayViewHeader(currentDisplayDate);
      default:
        return '';
    }
  }
  
  const renderCalendarView = () => {
    const commonViewProps = {
      currentDisplayDate: currentDisplayDate,
      events: memoizedEvents,
      journalEntries: memoizedJournalEntries,
      thoughtRecords: memoizedThoughtRecords,
      onPrev: handlePrev,
      onNext: handleNext,
      currentDateTitle: renderDateTitle(),
      onViewJournalEntry,
      onViewThoughtRecord,
    };

    switch(viewMode) {
      case 'month':
        return (
          <MonthView
            {...commonViewProps}
            onDateClick={handleDateClick}
            onEventClick={handleOpenViewEventModal}
          />
        );
      case 'week':
        return (
          <WeekView
            {...commonViewProps}
            onDateClick={handleDateClick}
            onEventClick={handleOpenViewEventModal}
          />
        );
      case 'day':
        return (
          <DayView
            {...commonViewProps}
            onEventClick={handleOpenViewEventModal}
            onAddEvent={handleOpenAddEventModal}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-750 w-full">
      <CalendarHeader
        viewMode={viewMode}
        onViewChange={handleViewChange}
        onAddEvent={() => handleOpenAddEventModal()}
      />

      {renderCalendarView()}

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
        initialDate={selectedDateForModal}
      />

      <EventViewModal
        isOpen={isEventViewModalOpen}
        onClose={() => setIsEventViewModalOpen(false)}
        event={selectedEventForView}
        onEdit={handleOpenEditEventModal}
        onDelete={onDeleteEvent}
      />
    </div>
  );
};

export default CalendarPage;
