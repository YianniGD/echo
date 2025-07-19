'use client';
import React from 'react';
import { CalendarEvent } from '@/lib/types';
import Modal from '@/components/echo/Modal';
import ActionButton from '@/components/echo/ActionButton';
import { Edit, Trash2, Clock, Calendar as CalendarIcon, AlignLeft } from 'lucide-react';
import { fromISOStringToLocalDate, isSameDay } from './DateUtils';

interface EventViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  event: CalendarEvent | null;
}

const EventViewModal: React.FC<EventViewModalProps> = ({ isOpen, onClose, onEdit, onDelete, event }) => {
  if (!event) return null;

  const start = fromISOStringToLocalDate(event.start);
  const end = fromISOStringToLocalDate(event.end);

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to display all-day dates correctly regardless of user's timezone
    });
  };
  
  const formatDisplayTime = (date: Date) => {
     return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
  }

  const isMultiDay = event.allDay && !isSameDay(start, end);

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title}>
      <div className="p-6 space-y-6">
        <div className="space-y-4 text-surface-on-variant">
            <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${event.color || 'bg-indigo-500'}`} />
                <p className="text-sm font-medium text-surface-on">Event Color</p>
            </div>
            <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 text-primary" />
                <div>
                    <p className="text-sm font-medium text-surface-on">Time</p>
                    {event.allDay ? (
                        <p>All-day event</p>
                    ) : (
                        <p>{`${formatDisplayTime(start)} - ${formatDisplayTime(end)}`}</p>
                    )}
                </div>
            </div>
             <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 flex-shrink-0 text-primary" />
                <div>
                    <p className="text-sm font-medium text-surface-on">Date</p>
                    <p>
                        {formatDisplayDate(start)}
                        {isMultiDay && ` to ${formatDisplayDate(end)}`}
                    </p>
                </div>
            </div>
            {event.description && (
                 <div className="flex items-start gap-3">
                    <AlignLeft className="w-5 h-5 flex-shrink-0 text-primary mt-1" />
                    <div>
                        <p className="text-sm font-medium text-surface-on">Description</p>
                        <p className="whitespace-pre-wrap break-words">{event.description}</p>
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-outline-variant">
            <ActionButton type="button" variant="text" onClick={onClose}>
                Close
            </ActionButton>
            <ActionButton type="button" variant="outlined" onClick={handleDelete} className="text-error border-error hover:bg-error-container/20" isIconOnly title="Delete Event">
                <Trash2 className="w-5 h-5" />
            </ActionButton>
            <ActionButton type="button" variant="filled" onClick={handleEdit} leadingIcon={<Edit className="w-5 h-5"/>}>
                Edit
            </ActionButton>
        </div>
      </div>
    </Modal>
  );
};

export default EventViewModal;
