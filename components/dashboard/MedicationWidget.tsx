import React from 'react';
import { Medication, MedicationBundle } from '../../types';
import { PillIcon } from '../icons/PillIcon';
import { LayersIcon } from '../icons/LayersIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface Props {
    medications: Medication[];
    bundles: MedicationBundle[];
    onLogTaken: (id: string, type: 'medication' | 'bundle') => void;
    isLoggedToday: (id:string) => boolean;
    className?: string;
}

const MedicationWidget: React.FC<Props> = ({ medications, bundles, onLogTaken, isLoggedToday, className }) => {

    const unbundledMedications = React.useMemo(() => {
        const bundledMedIds = new Set(bundles.flatMap(b => b.medicationIds));
        return medications.filter(m => !bundledMedIds.has(m.id));
    }, [medications, bundles]);
    
    const unloggedBundles = bundles.filter(b => !isLoggedToday(b.id));
    const unloggedMeds = unbundledMedications.filter(m => !isLoggedToday(m.id));

    const nothingToLog = unloggedBundles.length === 0 && unloggedMeds.length === 0;

  return (
    <div className={`p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-3">
        <PillIcon className="w-6 h-6 text-primary-500" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Medication Log</h3>
      </div>

      <div className="flex-grow my-4 space-y-3">
        {nothingToLog ? (
            <div className="h-full flex flex-col justify-center items-center text-center">
                <p className="text-gray-600 dark:text-gray-300 font-medium">All logged for today!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Great job staying on track.</p>
            </div>
        ) : (
            <>
                {unloggedBundles.map(bundle => (
                    <div key={bundle.id} className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <LayersIcon className="w-5 h-5 text-primary-500" />
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{bundle.name}</span>
                        </div>
                        <button onClick={() => onLogTaken(bundle.id, 'bundle')} className="px-3 py-1 text-xs font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700">Log</button>
                    </div>
                ))}
                 {unloggedMeds.map(med => (
                    <div key={med.id} className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                             <PillIcon className="w-5 h-5 text-primary-500" />
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{med.name}</span>
                        </div>
                        <button onClick={() => onLogTaken(med.id, 'medication')} className="px-3 py-1 text-xs font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700">Log</button>
                    </div>
                ))}
            </>
        )}
      </div>
      <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <button onClick={() => window.location.hash = '#/medication'} className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            Manage Meds <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MedicationWidget;