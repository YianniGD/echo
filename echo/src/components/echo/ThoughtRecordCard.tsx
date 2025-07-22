
'use client';
import React from 'react';
import { ThoughtRecord } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { Edit2, Trash2 } from 'lucide-react';

interface ThoughtRecordCardProps {
  record: ThoughtRecord;
  onView: (record: ThoughtRecord) => void;
  onEdit: (record: ThoughtRecord) => void;
  onDelete: (id: string) => void;
}

const ThoughtRecordCard: React.FC<ThoughtRecordCardProps> = ({ record, onView, onEdit, onDelete }) => {
  const formattedDate = new Date(record.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const situationPreview = record.data.situation.length > 150
    ? record.data.situation.substring(0, 150) + '...'
    : record.data.situation;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(record);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(record.id);
  };

  return (
    <div className="bg-surface-container-low shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl flex items-stretch w-full">
      {/* Clickable content area */}
      <div
        onClick={() => onView(record)}
        className="flex-grow p-5 sm:p-6 cursor-pointer"
        aria-label={`View record: ${record.title}`}
      >
        <h3 className="font-serif text-title-lg text-surface-on mb-0.5 break-words">{record.title}</h3>
        <p className="text-label-md text-surface-on-variant">{formattedDate}</p>
        <div className="text-body-md text-surface-on max-w-none mt-2 break-words">
          <p className="italic text-surface-on-variant">Situation: "{situationPreview}"</p>
        </div>
      </div>

      {/* Action buttons area */}
      <div className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-outline-variant/30">
        <ActionButton
          onClick={handleEditClick}
          variant="text"
          size="sm"
          isIconOnly
          title="Edit Record"
          className="text-surface-on-variant hover:bg-surface-on-variant/10"
          aria-label="Edit this thought record"
        >
          <Edit2 className="w-5 h-5" />
        </ActionButton>
        <ActionButton
          onClick={handleDeleteClick}
          variant="text"
          size="sm"
          isIconOnly
          title="Delete Record"
          className="text-error hover:bg-error-container/20"
          aria-label="Delete this thought record"
        >
          <Trash2 className="w-5 h-5" />
        </ActionButton>
      </div>
    </div>
  );
};

export default ThoughtRecordCard;
