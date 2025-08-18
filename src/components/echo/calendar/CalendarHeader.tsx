'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { PlusCircle } from 'lucide-react';
import SegmentedControl from '@/components/echo/SegmentedControl';

type CalendarViewMode = 'month' | 'week' | 'day';

interface CalendarHeaderProps {
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  onAddEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewMode,
  onViewChange,
  onAddEvent,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-2 bg-surface-container rounded-xl shadow mb-6">
      {/* Right side: View Switcher and Add Event */}
      <div className="flex items-center gap-3">
        <SegmentedControl
          value={viewMode}
          onChange={(value) => onViewChange(value as CalendarViewMode)}
          options={[
            { value: 'month', label: 'Month' },
            { value: 'week', label: 'Week' },
            { value: 'day', label: 'Day' },
          ]}
        />
        <ActionButton onClick={onAddEvent} variant="filled" size="md" leadingIcon={<PlusCircle />}>
          Add Event
        </ActionButton>
      </div>
    </div>
  );
};

export default CalendarHeader;
