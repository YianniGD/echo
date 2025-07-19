
'use client';
import React from 'react';
import { JournalEntry } from '@/lib/types';
import JournalEntryCard from '@/components/echo/JournalEntryCard';

interface JournalListProps {
  entries: JournalEntry[];
  onViewEntry: (entry: JournalEntry) => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const JournalList: React.FC<JournalListProps> = ({ entries, onViewEntry, onEdit, onDelete }) => {
  if (entries.length === 0) {
    const placeholderEntry: JournalEntry = {
      id: 'placeholder',
      timestamp: Date.now(),
      title: 'Your First Entry Awaits',
      text: "This is where your journal entries will appear. Click the '+' button below to capture your thoughts, reflections, and daily moments.",
    };
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in-0 duration-1000">
        <div className="max-w-2xl w-full">
            <JournalEntryCard
              entry={placeholderEntry}
              onView={() => {}} // No-op
              onEdit={() => {}} // No-op
              onDelete={() => {}} // No-op
              isPlaceholder={true}
            />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl w-full">
      {entries.map(entry => (
        <JournalEntryCard
          key={entry.id}
          entry={entry}
          onView={onViewEntry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default JournalList;
