'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Clipboard, Cpu, HelpCircle } from 'lucide-react';
import { View } from '@/lib/types';

interface ThoughtRecordWidgetProps {
  onNavigate: (view: View) => void;
}

const ThoughtRecordWidget: React.FC<ThoughtRecordWidgetProps> = ({ onNavigate }) => {
  return (
    <div className="bg-surface-container-low p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Clipboard className="w-7 h-7 text-tertiary" />
          <h3 className="font-serif text-headline-sm text-surface-on">
            Thought Records
          </h3>
        </div>
        <p className="text-body-md text-surface-on-variant mb-4">
          Challenge and reframe unhelpful thoughts. Gain new perspectives.
        </p>
      </div>
      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ActionButton
          variant="filled"
          style={{backgroundColor: 'var(--tertiary)', color: 'var(--on-tertiary)'}}
          size="md"
          leadingIcon={<Cpu />}
          onClick={() => onNavigate('thoughtRecord')}
          aria-label="Start a new thought record"
        >
          New Record
        </ActionButton>
         <ActionButton
          variant="tonal"
          style={{backgroundColor: 'var(--tertiary-container)', color: 'var(--on-tertiary-container)'}}
          size="md"
          leadingIcon={<HelpCircle />}
          onClick={() => onNavigate('thoughtRecord')}
          aria-label="View past thought records"
        >
          View History
        </ActionButton>
      </div>
    </div>
  );
};

export default ThoughtRecordWidget;
