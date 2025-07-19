'use client';
import React from 'react';
import { JournalEntry } from '@/lib/types';
import Modal from '@/components/echo/Modal';
import { PlayCircle, Edit2 } from 'lucide-react';
import ActionButton from './ActionButton';

interface JournalEntryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
  onEdit: (entry: JournalEntry) => void;
}

const JournalEntryViewModal: React.FC<JournalEntryViewModalProps> = ({ isOpen, onClose, entry, onEdit }) => {
  if (!entry) {
    return null;
  }

  const formattedDate = new Date(entry.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  
  const handleEdit = () => {
    onEdit(entry);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry.title || 'Journal Entry'}>
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <p className="text-sm text-surface-on-variant mb-4">{formattedDate}</p>
        
        {entry.audioBase64DataUrl && (
          <div className="my-4 p-4 bg-surface-container rounded-lg">
            <div className="flex items-center mb-2">
              <PlayCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
              <p className="text-label-md text-surface-on font-medium">Play Dictated Audio</p>
            </div>
            <audio controls src={entry.audioBase64DataUrl} className="w-full h-10 rounded-md">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {entry.text.trim() && (
          <div
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: entry.text }}
          />
        )}

        {!entry.text.trim() && entry.audioBase64DataUrl && (
          <p className="text-label-md text-surface-on-variant italic mt-2">
            This entry primarily contains audio.
          </p>
        )}
      </div>
       <div className="flex justify-end space-x-3 p-6 border-t border-outline-variant">
          <ActionButton type="button" variant="text" onClick={onClose}>
            Close
          </ActionButton>
          <ActionButton type="button" variant="filled" leadingIcon={<Edit2 />} onClick={handleEdit}>
            Edit Entry
          </ActionButton>
      </div>
    </Modal>
  );
};

export default JournalEntryViewModal;
