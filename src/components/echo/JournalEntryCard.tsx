
'use client';
import React from 'react';
import { JournalEntry } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { Edit2, PlayCircle, Trash2 } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onView: (entry: JournalEntry) => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  isPlaceholder?: boolean;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onView, onEdit, onDelete, isPlaceholder = false }) => {
  const formattedDate = isPlaceholder
    ? "Just now"
    : new Date(entry.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '');
  const plainText = stripHtml(entry.text);
  const previewTextLength = 200;
  const previewText = plainText.length > previewTextLength
    ? plainText.substring(0, previewTextLength) + '...'
    : plainText;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entry);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(entry.id);
  };

  return (
    <div className="bg-surface-container-low shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl flex items-stretch w-full">
      {/* Clickable content area */}
      <div
        onClick={() => !isPlaceholder && onView(entry)}
        className="flex-grow p-5 sm:p-6 cursor-pointer"
        aria-label={`View entry: ${entry.title || 'Journal Entry'}`}
      >
        <h3 className="font-serif text-title-lg text-surface-on mb-0.5 break-words">{entry.title}</h3>
        <p className="text-label-md text-surface-on-variant">{formattedDate}</p>
        
        {entry.audioBase64DataUrl && (
          <div className="flex items-center gap-2 mt-3 text-primary">
              <PlayCircle className="w-4 h-4" />
              <span className="text-label-md">Audio entry attached</span>
          </div>
        )}
        
        {plainText.trim() && (
          <div className="text-body-md text-surface-on max-w-none mt-2 break-words">
            {previewText}
          </div>
        )}
         {!plainText.trim() && entry.audioBase64DataUrl && (
            <p className="text-label-md text-surface-on-variant italic mt-2">
                This entry primarily contains audio.
            </p>
        )}
      </div>

      {/* Action buttons area */}
      {!isPlaceholder && (
        <div className="flex flex-col items-center justify-center space-y-2 p-2 border-l border-outline-variant/30">
          <ActionButton
            onClick={handleEditClick}
            variant="text"
            size="sm"
            isIconOnly
            title="Edit Entry"
            className="text-surface-on-variant hover:bg-surface-on-variant/10"
            aria-label="Edit this journal entry"
          >
            <Edit2 className="w-5 h-5" />
          </ActionButton>
          <ActionButton
            onClick={handleDeleteClick}
            variant="text"
            size="sm"
            isIconOnly
            title="Delete Entry"
            className="text-error hover:bg-error-container/20"
            aria-label="Delete this journal entry"
          >
            <Trash2 className="w-5 h-5" />
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default JournalEntryCard;
