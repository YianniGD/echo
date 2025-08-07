
import React from 'react';
import { Medication } from '../../types';
import { EditIcon } from '../icons/EditIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface Props {
  medication: Medication;
  onLog: () => void;
  onEdit: () => void;
  isLogged: boolean;
}

const MedicationCard: React.FC<Props> = ({ medication, onLog, onEdit, isLogged }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{medication.name}</h3>
          <button onClick={onEdit} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <EditIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <p><span className="font-semibold">Dosage:</span> {medication.dosage}</p>
          <p><span className="font-semibold">Frequency:</span> {medication.frequency}</p>
          {medication.notes && <p><span className="font-semibold">Notes:</span> {medication.notes}</p>}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onLog}
          disabled={isLogged}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isLogged
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
          }`}
        >
          {isLogged ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              Logged
            </>
          ) : (
            'Log as Taken'
          )}
        </button>
      </div>
    </div>
  );
};

export default MedicationCard;
