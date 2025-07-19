'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Edit3, BookOpen, PlusCircle } from 'lucide-react';
import { View } from '@/lib/types';

interface JournalWidgetProps {
  journalEntriesCount: number;
  latestEntryTitle?: string;
  latestEntryTimestamp?: number;
  onNavigate: (view: View) => void;
}

const JournalWidget: React.FC<JournalWidgetProps> = ({
  journalEntriesCount,
  latestEntryTitle,
  latestEntryTimestamp,
  onNavigate,
}) => {
  const formattedTimestamp = latestEntryTimestamp 
    ? new Date(latestEntryTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="bg-surface-container-low p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-7 h-7 text-primary" />
            <h3 className="font-serif text-headline-sm text-surface-on">
              My Journal
            </h3>
          </div>
          <span className="text-sm font-medium px-2.5 py-1 bg-primary-container text-on-primary-container rounded-full">
            {journalEntriesCount} {journalEntriesCount === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>
        {journalEntriesCount > 0 && latestEntryTitle && (
          <div className="mb-4 p-3 bg-surface rounded-lg">
            <p className="text-label-md text-surface-on-variant">Latest Entry ({formattedTimestamp}):</p>
            <p className="text-body-md text-surface-on truncate" title={latestEntryTitle}>
              {latestEntryTitle}
            </p>
          </div>
        )}
        {journalEntriesCount === 0 && (
          <p className="text-body-md text-surface-on-variant mb-4">
            Start capturing your thoughts and reflections.
          </p>
        )}
      </div>
      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ActionButton
          variant="filled"
          size="md"
          leadingIcon={<PlusCircle />}
          onClick={() => onNavigate('journal')}
          aria-label="Create new journal entry"
          className="w-full"
        >
          New Entry
        </ActionButton>
        <ActionButton
          variant="tonal"
          size="md"
          leadingIcon={<BookOpen />}
          onClick={() => onNavigate('journal')}
          aria-label="View all journal entries"
          className="w-full"
          disabled={journalEntriesCount === 0}
        >
          View All
        </ActionButton>
      </div>
    </div>
  );
};

export default JournalWidget;
