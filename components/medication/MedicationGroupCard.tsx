
import React from 'react';
import { Medication, MedicationBundle } from '../../types';
import { EditIcon } from '../icons/EditIcon';
import { PillIcon } from '../icons/PillIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface Props {
  bundle: MedicationBundle;
  medications: Medication[];
  onLog: () => void;
  onEdit: () => void;
  isLogged: boolean;
}

const MedicationGroupCard: React.FC<Props> = ({ bundle, medications, onLog, onEdit, isLogged }) => {
  const medicationsInBundle = bundle.medicationIds
    .map(id => medications.find(m => m.id === id))
    .filter((m): m is Medication => !!m);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{bundle.name}</h3>
           <button onClick={onEdit} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <EditIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
            {medicationsInBundle.length > 0 ? (
                medicationsInBundle.map(med => (
                    <div key={med.id} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <PillIcon className="w-4 h-4 flex-shrink-0 text-primary-500" />
                        <span>{med.name} ({med.dosage})</span>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No medications in this bundle.</p>
            )}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            'Log All as Taken'
          )}
        </button>
      </div>
    </div>
  );
};

export default MedicationGroupCard;
