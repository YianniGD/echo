
'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { PlusCircle, Clipboard } from 'lucide-react';
import { ThoughtRecord } from '@/lib/types';
import ThoughtRecordCard from './ThoughtRecordCard';

interface ThoughtRecordListPageProps {
  thoughtRecords: ThoughtRecord[];
  onNew: () => void;
  onView: (record: ThoughtRecord) => void;
  onEdit: (record: ThoughtRecord) => void;
  onDelete: (id: string) => void;
}

const ThoughtRecordListPage: React.FC<ThoughtRecordListPageProps> = ({ thoughtRecords, onNew, onView, onEdit, onDelete }) => {
    return (
        <div className="space-y-10 animate-in fade-in-0 duration-750 max-w-3xl w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                    <Clipboard className="w-8 h-8 text-primary" />
                    <h2 className="font-serif text-headline-lg text-surface-on">My Thought Records</h2>
                </div>
                <ActionButton
                    variant="filled"
                    size="md"
                    leadingIcon={<PlusCircle />}
                    onClick={onNew}
                    className="w-full sm:w-auto"
                    aria-label="Create new thought record"
                >
                    New Thought Record
                </ActionButton>
            </div>
            
            <p className="text-body-lg text-surface-on-variant -mt-6">
                Use this structured exercise to examine and challenge unhelpful thoughts. 
                Track your progress by reviewing past records.
            </p>

            {thoughtRecords.length > 0 ? (
                <div className="space-y-6">
                    {thoughtRecords.map(record => (
                        <ThoughtRecordCard 
                            key={record.id}
                            record={record}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-surface-container-low rounded-xl">
                    <h3 className="font-serif text-headline-sm text-surface-on">No Records Yet</h3>
                    <p className="mt-2 text-body-md text-surface-on-variant">Click "New Thought Record" to get started.</p>
                </div>
            )}
        </div>
    );
};

export default ThoughtRecordListPage;
