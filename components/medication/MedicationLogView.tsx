
import React from 'react';
import { MedicationTakenLog } from '../../types';
import { HistoryIcon } from '../icons/HistoryIcon';
import { PillIcon } from '../icons/PillIcon';
import { LayersIcon } from '../icons/LayersIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  logs: MedicationTakenLog[];
  onClearLog: () => void;
}

const MedicationLogView: React.FC<Props> = ({ logs, onClearLog }) => {
  return (
    <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <HistoryIcon className="w-7 h-7 text-primary-500" />
                Today's Log
            </h2>
             {logs.length > 0 && (
                <button
                    onClick={onClearLog}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                    aria-label="Clear today's log"
                >
                    <TrashIcon className="w-4 h-4" />
                    Clear
                </button>
            )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
            {logs.length > 0 ? (
                <ul className="space-y-3">
                    {logs.map(log => (
                        <li key={log.id} className="flex items-center justify-between gap-4 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <div className="flex items-center gap-3">
                                {log.type === 'bundle' 
                                    ? <LayersIcon className="w-5 h-5 text-primary-500" />
                                    : <PillIcon className="w-5 h-5 text-primary-500" />
                                }
                                <span className="font-medium text-gray-700 dark:text-gray-200">{log.name}</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No medications logged yet today.</p>
            )}
        </div>
    </section>
  );
};

export default MedicationLogView;