'use client';
import React from 'react';
import { MedicationLogEntry } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

interface MedicationLogViewProps {
  logs: MedicationLogEntry[];
}

const MedicationLogView: React.FC<MedicationLogViewProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <p className="text-center text-surface-on-variant py-8 text-body-lg">
        No medication intakes logged yet.
      </p>
    );
  }

  const formatLogTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-3">
      {logs.map(log => (
        <div
          key={log.id}
          className="bg-surface-container-low p-4 rounded-lg shadow-sm flex items-center space-x-3"
        >
          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
          <div className="flex-grow">
            <p className="text-body-md text-surface-on">
              <span className="font-medium">{log.medicationName}</span> ({log.dosage})
            </p>
            <p className="text-label-sm text-surface-on-variant">
              Logged at: {formatLogTimestamp(log.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicationLogView;
