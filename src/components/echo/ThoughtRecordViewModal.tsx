'use client';
import React, { useMemo } from 'react';
import { ThoughtRecord, ThoughtRecordData } from '@/lib/types';
import Modal from '@/components/echo/Modal';
import { Edit2 } from 'lucide-react';
import ActionButton from './ActionButton';

interface ThoughtRecordViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ThoughtRecord | null;
  onEdit: (record: ThoughtRecord) => void;
}

const sections = [
  { id: 'situation', title: 'Situation / Trigger' },
  { id: 'feelings', title: 'Feelings & Body Sensations' },
  { id: 'unhelpfulThoughts', title: 'Unhelpful / Initial Thoughts & Images' },
  { id: 'evidenceFor', title: 'Facts Supporting Initial Thought' },
  { id: 'evidenceAgainst', title: 'Facts Against Initial Thought' },
  { id: 'alternativePerspective', title: 'Alternative, Balanced Perspective' },
  { id: 'outcome', title: 'Outcome' },
] as const;


const ThoughtRecordViewModal: React.FC<ThoughtRecordViewModalProps> = ({ isOpen, onClose, record, onEdit }) => {
  if (!record) {
    return null;
  }

  const handleEdit = () => {
    onEdit(record);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={record.title}>
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <p className="text-sm text-surface-on-variant mb-4">
            Recorded on {new Date(record.timestamp).toLocaleString()}
        </p>
        
        <div className="space-y-4">
          {sections.map(section => {
            const content = record.data[section.id as keyof typeof record.data];
            // Check for content beyond just empty paragraph tags
            const hasContent = content && typeof content === 'string' && content.replace(/<p><\/p>/g, '').trim() !== '';

            if (!hasContent) return null;

            let headerText = section.title;
            if (section.id === 'feelings' && record.data.feelingsRating) {
              headerText += ` (${record.data.feelingsRating}/100)`;
            } else if (section.id === 'outcome' && record.data.outcomeRating) {
              headerText += ` (${record.data.outcomeRating}/100)`;
            }

            return (
              <div key={section.id}>
                <h4 className="font-serif text-title-md text-surface-on mb-1">{headerText}</h4>
                <div
                  className="prose prose-sm sm:prose-base dark:prose-invert max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: content as string }}
                />
              </div>
            );
          })}
        </div>
      </div>
       <div className="flex justify-end space-x-3 p-6 border-t border-outline-variant">
          <ActionButton type="button" variant="text" onClick={onClose}>
            Close
          </ActionButton>
          <ActionButton type="button" variant="filled" leadingIcon={<Edit2 />} onClick={handleEdit}>
            Edit Record
          </ActionButton>
      </div>
    </Modal>
  );
};

export default ThoughtRecordViewModal;
