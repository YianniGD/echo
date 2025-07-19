'use client';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/components/echo/Modal';
import ActionButton from '@/components/echo/ActionButton';
import { CalendarEvent } from '@/lib/types';
import { Save, AlertTriangle } from 'lucide-react';
import { formatToYYYYMMDD, formatToHHMM, parseDateTime, toISOStringWithLocalTimezone, fromISOStringToLocalDate } from '@/components/echo/calendar/DateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  eventToEdit?: CalendarEvent | null;
  initialDate?: Date;
}

const eventColors = [
  { name: 'Indigo', class: 'bg-indigo-500' },
  { name: 'Teal', class: 'bg-teal-500' },
  { name: 'Amber', class: 'bg-amber-500' },
  { name: 'Rose', class: 'bg-rose-600' },
  { name: 'Sky', class: 'bg-sky-500' },
  { name: 'Lime', class: 'bg-lime-500' },
  { name: 'Violet', class: 'bg-violet-500' },
  { name: 'Fuchsia', class: 'bg-fuchsia-500' },
];

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, eventToEdit, initialDate }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(eventColors[0].class);
  const [error, setError] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (eventToEdit) {
        const startDateTime = fromISOStringToLocalDate(eventToEdit.start);
        const endDateTime = fromISOStringToLocalDate(eventToEdit.end);

        setTitle(eventToEdit.title);
        setAllDay(eventToEdit.allDay);
        setStartDate(formatToYYYYMMDD(startDateTime));
        setStartTime(eventToEdit.allDay ? '00:00' : formatToHHMM(startDateTime));
        setEndDate(formatToYYYYMMDD(endDateTime));
        setEndTime(eventToEdit.allDay ? '23:59' : formatToHHMM(endDateTime));
        setDescription(eventToEdit.description || '');
        setColor(eventToEdit.color || eventColors[0].class);
      } else {
        const defaultDate = initialDate || new Date();
        setTitle('');
        setAllDay(true);
        setStartDate(formatToYYYYMMDD(defaultDate));
        setStartTime('09:00');
        setEndDate(formatToYYYYMMDD(defaultDate));
        setEndTime('10:00');
        setDescription('');
        setColor(eventColors[0].class);
      }
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen, eventToEdit, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      return;
    }
    if (!allDay && !startTime) {
      setError('Start time is required for timed events.');
      return;
    }
    if (!endDate) {
        setEndDate(startDate);
    }
    if (!allDay && !endTime) {
        const tempStartTime = parseDateTime(startDate, startTime);
        tempStartTime.setHours(tempStartTime.getHours() + 1);
        setEndTime(formatToHHMM(tempStartTime));
    }


    let finalStart: Date;
    let finalEnd: Date;

    if (allDay) {
      finalStart = parseDateTime(startDate);
      finalEnd = parseDateTime(endDate || startDate);
    } else {
      finalStart = parseDateTime(startDate, startTime);
      finalEnd = parseDateTime(endDate || startDate, endTime || startTime);
    }
    
    if (finalEnd < finalStart) {
      setError('End date/time cannot be before start date/time.');
      return;
    }
    
    const eventData = {
      id: eventToEdit?.id,
      title: title.trim(),
      start: toISOStringWithLocalTimezone(finalStart, allDay),
      end: toISOStringWithLocalTimezone(finalEnd, allDay),
      allDay,
      description: description.trim() || undefined,
      color,
    };

    onSave(eventData);
    onClose();
  };
  
  const handleAllDayToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllDay(e.target.checked);
    if (e.target.checked) {
        // When switching to all-day, keep dates, but times become irrelevant for input
    } else {
        // When switching to timed, set default times if they were cleared
        if(!startTime) setStartTime('09:00');
        if(!endTime) setEndTime('10:00');
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={eventToEdit ? 'Edit Event' : 'Add New Event'}>
      <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm flex items-center gap-2" role="alert">
            <AlertTriangle size={18} /> {error}
          </div>
        )}
        <div>
          <label htmlFor="eventTitle" className="block text-sm font-medium text-surface-on-variant mb-1">
            Event Title <span className="text-error">*</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id="eventTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on placeholder-surface-on-variant"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="eventStartDate" className="block text-sm font-medium text-surface-on-variant mb-1">
              Start Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              id="eventStartDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on"
              required
            />
          </div>
          {!allDay && (
            <div className="flex-1">
              <label htmlFor="eventStartTime" className="block text-sm font-medium text-surface-on-variant mb-1">
                Start Time <span className="text-error">*</span>
              </label>
              <input
                type="time"
                id="eventStartTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on"
                required={!allDay}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="eventEndDate" className="block text-sm font-medium text-surface-on-variant mb-1">
              End Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              id="eventEndDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on"
              required
            />
          </div>
          {!allDay && (
            <div className="flex-1">
              <label htmlFor="eventEndTime" className="block text-sm font-medium text-surface-on-variant mb-1">
                End Time <span className="text-error">*</span>
              </label>
              <input
                type="time"
                id="eventEndTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on"
                required={!allDay}
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center">
            <input
                type="checkbox"
                id="allDayEvent"
                checked={allDay}
                onChange={handleAllDayToggle}
                className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded"
            />
            <label htmlFor="allDayEvent" className="ml-2 text-sm font-medium text-surface-on">
                All-day event
            </label>
        </div>

        <div>
          <label htmlFor="eventDescription" className="block text-sm font-medium text-surface-on-variant mb-1">
            Description (Optional)
          </label>
          <textarea
            id="eventDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on placeholder-surface-on-variant"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-on-variant mb-1">
            Event Color
          </label>
          <div className="flex flex-wrap gap-2">
            {eventColors.map(c => (
              <button
                key={c.class}
                type="button"
                onClick={() => setColor(c.class)}
                className={`w-8 h-8 rounded-full ${c.class} ${color === c.class ? 'ring-2 ring-offset-2 ring-primary' : ''} transition-all focus:outline-none`}
                aria-label={`Select color ${c.name}`}
                aria-pressed={color === c.class}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <ActionButton type="button" variant="text" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" variant="filled" leadingIcon={<Save />}>
            {eventToEdit ? 'Save Changes' : 'Add Event'}
          </ActionButton>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
