'use client';
import React from 'react';
import { CalendarEvent, JournalEntry, ThoughtRecord, View } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { Calendar } from '@/components/ui/calendar'; // ShadCN calendar
import { isSameDay, fromISOStringToLocalDate } from '@/components/echo/calendar/DateUtils';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, List } from 'lucide-react';

interface CalendarWidgetProps {
  events: CalendarEvent[];
  journalEntries: JournalEntry[];
  thoughtRecords: ThoughtRecord[];
  onNavigate: (view: View) => void;
  className?: string;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events, journalEntries, thoughtRecords, onNavigate, className = '' }) => {
  const [date, setDate] = React.useState<Date>(new Date());

  const daysWithItems = React.useMemo(() => {
    const itemDays = new Set<string>();
    
    events.forEach(event => {
      const eventStart = fromISOStringToLocalDate(event.start);
      itemDays.add(eventStart.toDateString());
    });
    journalEntries.forEach(entry => {
      itemDays.add(new Date(entry.timestamp).toDateString());
    });
    thoughtRecords.forEach(record => {
      itemDays.add(new Date(record.timestamp).toDateString());
    });

    return Array.from(itemDays).map(d => new Date(d));
  }, [events, journalEntries, thoughtRecords]);

  const modifiers = {
    hasItem: daysWithItems,
  };

  const modifiersClassNames = {
    hasItem: 'has-item',
  };

  return (
    <div className={`bg-surface-container-low p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full ${className}`}>
      <style>{`
        .has-item {
          position: relative;
        }
        .has-item::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: hsl(var(--primary));
        }
        .rdp-day_today:not(.rdp-day_outside) {
          font-weight: 700;
          color: hsl(var(--on-primary-container));
          background-color: hsl(var(--primary-container));
        }
        .rdp-day_today:not(.rdp-day_outside).has-item::after {
          background-color: hsl(var(--on-primary-container));
        }
      `}</style>
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <CalendarIcon className="w-7 h-7 text-primary" />
          <h3 className="font-serif text-headline-sm text-surface-on">
            Calendar
          </h3>
        </div>
        <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="p-0"
            />
        </div>
      </div>
      <ActionButton
        variant="tonal"
        size="md"
        leadingIcon={<List />}
        onClick={() => onNavigate('planner')}
        aria-label="Open Full Calendar & Planner"
        className="w-full mt-auto"
      >
        View Full Calendar & Planner
      </ActionButton>
    </div>
  );
};

export default CalendarWidget;
